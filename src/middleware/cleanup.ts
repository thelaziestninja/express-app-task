import { ZodError } from "zod";
import logger from "../utils/logger";
import { Request, Response, NextFunction } from "express";
import { maxKeys, threshold } from "../../config/default";
import { storeWithTTL, storeWithoutTTL } from "../controller/store.controller";

const sortAndDeleteKeysWithoutTTL = async () => {
  try {
    const totalKeys = storeWithoutTTL.size + storeWithTTL.size;
    const deletionThreshold = maxKeys * threshold;

    if (totalKeys > deletionThreshold) {
      logger.info(
        "Sorting keys without TTL for cleanup as the total keys exceed threshold"
      );

      const entries = Array.from(storeWithoutTTL.entries());

      const sortedKeysWithoutTTL = entries.sort(([, a], [, b]) => {
        const aCreatedAt = a.created_at.getTime();
        const bCreatedAt = b.created_at.getTime();

        if (a.count !== undefined && b.count !== undefined) {
          return a.count - b.count;
        } else {
          return aCreatedAt - bCreatedAt;
        }
      });

      for (const [key, value] of sortedKeysWithoutTTL) {
        if (storeWithoutTTL.has(key) && !value.ttl) {
          storeWithoutTTL.delete(key);
          logger.info(`Deleted key(${key}) without TTL`);
        }

        if (storeWithoutTTL.size + storeWithTTL.size <= deletionThreshold) {
          break;
        }
      }
    }

    logger.info("Total keys are within the threshold. No cleanup needed.");
    return;
  } catch (e: any) {
    logger.info(`Error in sortKeysWithoutTTLForCleanup method: ${e.message}`);
    throw e;
  }
};

const sortAndDeleteKeysWithTTL = async () => {
  try {
    const totalKeys = storeWithoutTTL.size + storeWithTTL.size;
    const deletionThreshold = maxKeys * threshold;

    if (totalKeys > deletionThreshold) {
      logger.info(
        "Sorting keys without TTL for cleanup as the total keys exceed threshold"
      );
      const entries = Array.from(storeWithTTL.entries());
      const sortedKeysWithTTL = entries.sort(([, a], [, b]) => {
        const aCreatedAt = a.created_at.getTime();
        const bCreatedAt = b.created_at.getTime();

        if (a.count !== undefined && b.count !== undefined) {
          return a.count - b.count;
        } else {
          return aCreatedAt - bCreatedAt;
        }
      });
      for (const [key, value] of sortedKeysWithTTL) {
        if (storeWithTTL.has(key) && value.ttl) {
          storeWithTTL.delete(key);
          logger.info(`Deleted key(${key}) with TTL`);
        }

        if (storeWithoutTTL.size + storeWithTTL.size <= deletionThreshold) {
          break;
        }
      }
    }

    logger.info("Total keys are within the threshold. No cleanup needed.");
    return;
  } catch (e: any) {
    logger.info(`Error in sortKeysWithoutTTLForCleanup method: ${e.message}`);
    throw e;
  }
};

export const cleanupKeys = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    logger.info("Started checking for keys without TTL to delete in store");
    await sortAndDeleteKeysWithoutTTL();

    if (storeWithoutTTL.size + storeWithTTL.size > maxKeys * threshold) {
      await sortAndDeleteKeysWithTTL();
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
