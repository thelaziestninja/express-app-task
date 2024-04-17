import { ZodError } from "zod";
import logger from "../utils/logger";
import { Request, Response, NextFunction } from "express";
import { maxKeys, threshold } from "../../config/default";
import {
  storeWithTTL,
  storeWithoutTTL,
  minHeapWithTTL,
  minHeapWithoutTTL,
} from "../controller/store.controller";

const cleanupHeapWithTTL = async () => {
  let totalKeys = storeWithTTL.size + storeWithoutTTL.size;
  const deletionThreshold = maxKeys * threshold;

  while (totalKeys > deletionThreshold) {
    const removedElement = minHeapWithTTL.pop();
    if (removedElement) {
      const { key } = removedElement;

      if (storeWithTTL.has(key)) {
        storeWithTTL.delete(key);
      }
      totalKeys = storeWithoutTTL.size + storeWithTTL.size;
    } else {
      break;
    }
  }
};

const cleanupHeapWithoutTTL = async () => {
  let totalKeys = storeWithTTL.size + storeWithoutTTL.size;
  const deletionThreshold = maxKeys * threshold;

  while (totalKeys > deletionThreshold) {
    const removedElement = minHeapWithoutTTL.pop();
    if (removedElement) {
      const { key } = removedElement;

      if (storeWithoutTTL.has(key)) {
        storeWithoutTTL.delete(key);
      }
      totalKeys = storeWithoutTTL.size + storeWithTTL.size;
    } else {
      break;
    }
  }
};

export const cleanupKeys = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let totalKeys = storeWithTTL.size + storeWithoutTTL.size;
    const deletionThreshold = maxKeys * threshold;

    if (totalKeys <= deletionThreshold) {
      logger.info("Total keys are within the threshold. No cleanup needed.");
      return next();
    }
    // await cleanupHeapWithoutTTL();

    if (totalKeys > deletionThreshold) {
      logger.info("Started checking for keys with TTL to delete in store");
      await cleanupHeapWithTTL();
      console.log("storeWithTTL", storeWithTTL.size);
    }

    next();
  } catch (e: any) {
    if (e instanceof ZodError) {
      logger.info(
        `Zod Error in validation request body middleware: ${e.issues[0].message}`
      );
      return res.status(400).send({ msg: e.issues[0].message });
    }

    logger.info(`Error in cleanupKeys middleware: ${e.message}`);
    return res.status(500).send(e.message);
  }
};
