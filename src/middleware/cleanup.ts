import { store } from "../app";
import { ZodError } from "zod";
import logger from "../utils/logger";
import { Request, Response, NextFunction } from "express";
import { maxKeys, threshold } from "../../config/default";

//higher order function that takes a Zod schema (AnyZodObject) as an argument and returns middleware for Express.
export const cleanupKeys = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    logger.info("Cleaning up keys in store");

    const totalKeys = Object.keys(store).length;

    logger.info(
      `Total keys in store: ${totalKeys}, max keys allowed: ${maxKeys}`
    );

    let sortedKeys: string[] = [];

    if (totalKeys >= maxKeys * threshold) {
      logger.info(
        `Cleanup triggered as total keys are greater than or equal to ${
          maxKeys * threshold
        }`
      );
      sortedKeys = Object.keys(store).sort((a, b) => {
        logger.info(`Sorting keys based on least used count: ${a}, ${b}`);
        // return store[a].created_at.getTime() - store[b].created_at.getTime(); // count or undefined. if undefined, then it 0
        if ((store[a].count ?? 0) !== (store[b].count ?? 0)) {
          return (store[a].count ?? 0) - (store[b].count ?? 0);
        } else {
          logger.info(
            `Sorting keys based on created_at timestamp (oldest first): ${a}, ${b}`
          );

          return store[a].created_at.getTime() - store[b].created_at.getTime();
        }
      });

      const keysToDelete = totalKeys - maxKeys;

      for (let i = 0; i < keysToDelete; i++) {
        const keyToDelete = sortedKeys[i];
        logger.info(`Deleting key: ${keyToDelete}`);
        delete store[keyToDelete];
      }
    }

    next();
  } catch (e: any) {
    if (e instanceof ZodError) {
      logger.error(
        `Zod Error in validation request body middleware: ${e.issues[0].message}`
      );
      return res.status(400).send({ msg: e.issues[0].message });
    }

    logger.error(`Error in cleanupKeys middleware: ${e.message}`);
    return res.status(500).send(e.message);
  }
};
