import { Router } from "express";
import { StackInput, StackSchema } from "../schema/stack.schema";
import logger from "../utils/logger";
import {
  Request,
  Response,
  StackResponse,
  ResponseStatus,
} from "../types/request";
import { Stack } from "../types";
import { validateRequestData } from "../middleware/validate";

const router = Router();

const stack: Stack = [];

router.post(
  "/",
  validateRequestData(StackSchema),
  async (req: Request<StackInput["body"]>, res: Response<StackResponse>) => {
    try {
      logger.info("Add item to stack called", req.body.item);
      const { item } = req.body;

      if (stack.length > 10) {
        logger.info("Stack length is greater than 10, stack overflow error");
        return res.status(ResponseStatus.BadRequest).json({
          message: "Stack Overflow",
          stack,
          stackLength: stack.length,
        });
      }

      if (stack.includes(item)) {
        logger.info(`Item already exists in stack - ${item}`);
        return res.status(ResponseStatus.BadRequest).json({
          message: "Item already exists in stack",
          stack,
          stackLength: stack.length,
        });
      }

      stack.push(item);
      logger.info(`Item added to stack - ${item}`);
      return res.status(ResponseStatus.Success).json({
        message: "Item added to stack",
        stack: stack,
        stackLength: stack.length,
      });
    } catch (e: any) {
      logger.error("Error adding item to stack", e);
      return res.status(ResponseStatus.InternalServerError).json({
        message: "Internal server error",
      });
    }
  }
);

// Route to pop an item from the stack
router.delete("/", async (res: Response<StackResponse>) => {
  try {
    if (stack.length === 0) {
      logger.info("Stack length is less than 0, stack underflow error");
      return res.status(ResponseStatus.BadRequest).json({
        message: "Stack Underflow",
        stack,
        stackLength: stack.length,
      });
    }

    const item = stack.pop();
    logger.info(`Pop item from stack - ${item}`);
    return res.status(ResponseStatus.Success).json({
      message: "Item popped from stack",
      item,
      stack,
      stackLength: stack.length,
    });
  } catch (e: any) {
    logger.error("Error popping item from stack", e);
    return res.status(ResponseStatus.InternalServerError).json({
      message: "Internal server error",
    });
  }
});

export default router;
