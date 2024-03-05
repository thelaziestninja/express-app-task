import { Stack } from "../types";
import logger from "../utils/logger";
import { StackInput } from "../schema/stack.schema";
import {
  Request,
  Response,
  StackResponse,
  EmptyRequest,
} from "../types/request";

export const stack: Stack = [];

export async function AddToStackHandler(
  req: Request<StackInput["body"]>,
  res: Response<StackResponse>
) {
  try {
    logger.info("Add item to stack", req.body.item);
    const { item } = req.body;
    if (stack.length < 10) {
      logger.info(`Stack length is ${stack.length}`);
      if (stack.includes(item)) {
        logger.info(`Item already exists in stack - ${item}`);
        return res.status(400).json({
          message: "Item already exists in stack",
          stack,
          stackLength: stack.length,
        });
      }
      logger.info(`Item added to stack - ${item}`);
      stack.push(item);
      return res.status(200).json({
        message: "Item added to stack",
        stack: stack,
        stackLength: stack.length,
      });
    }

    logger.error("Stack length is greater than 10, stack overflow error");
    return res
      .status(400)
      .json({ message: "Stack Overflow", stack, stackLength: stack.length });
  } catch (e: any) {
    logger.error("Error adding item to stack", e);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function PopFromStackHandler(
  req: Request<EmptyRequest>,
  res: Response<StackResponse>
) {
  try {
    if (stack.length > 0) {
      const item = stack.pop();
      logger.info(`Pop item from stack - ${item}`);
      return res.status(200).json({
        message: "Item popped from stack",
        item,
        stack,
        stackLength: stack.length,
      });
    }
    logger.error("Stack length is 0, stack underflow error");
    return res
      .status(400)
      .json({ message: "Stack Underflow", stack, stackLength: stack.length });
  } catch (e: any) {
    logger.error("Error popping item from stack", e);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
