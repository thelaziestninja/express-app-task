/* eslint-disable @typescript-eslint/no-explicit-any */
import { Stack } from "../types";
import logger from "../utils/logger";
import { StackInput } from "../schema/stack.schema";
import {
  Request,
  Response,
  StackResponse,
  EmptyRequest,
  ResponseStatus,
} from "../types/request";

export const stack: Stack = [];

export async function AddToStackHandler(
  req: Request<StackInput["body"]>,
  res: Response<StackResponse>
) {
  try {
    logger.info("Add item to stack called", req.body.item);
    const { item } = req.body;

    if (stack.length > 10) {
      logger.info("Stack length is greater than 10, stack overflow error");
      return res
        .status(ResponseStatus.BadRequest)
        .json({ message: "Stack Overflow", stack, stackLength: stack.length });
    }

    logger.info(`Stack length is ${stack.length}`);
    if (stack.includes(item)) {
      logger.info(`Item already exists in stack - ${item}`);
      return res.status(ResponseStatus.BadRequest).json({
        message: "Item already exists in stack",
        stack,
        stackLength: stack.length,
      });
    }

    logger.info(`Item added to stack - ${item}`);
    stack.push(item);
    return res.status(ResponseStatus.Success).json({
      message: "Item added to stack",
      stack: stack,
      stackLength: stack.length,
    });
  } catch (e: any) {
    logger.info("Error adding item to stack", e);
    return res.status(ResponseStatus.InternalServerError).json({
      message: "Internal server error",
    });
  }
}

export async function PopFromStackHandler(
  req: Request<EmptyRequest>,
  res: Response<StackResponse>
) {
  try {
    if (stack.length <= 0) {
      logger.info("Stack length is less than 0, stack underflow error");
      return res
        .status(ResponseStatus.BadRequest)
        .json({ message: "Stack Underflow", stack, stackLength: stack.length });
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
    logger.info("Error popping item from stack", e);
    return res.status(ResponseStatus.InternalServerError).json({
      message: "Internal server error",
    });
  }
}
