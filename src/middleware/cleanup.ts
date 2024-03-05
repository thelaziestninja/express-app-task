import { store } from "../app";
import { ZodError } from "zod";
import logger from "../utils/logger";
import { Request, Response, NextFunction } from "express";

export const maxKeys = 5;

//higher order function that takes a Zod schema (AnyZodObject) as an argument and returns middleware for Express.
export const cleanupKeys = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    logger.info("Cleaning up keys in store");

    const totalKeys = Object.keys(store).length;
    const maxKeys = 5;
    const threshold = 0.8;

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
        // logger.info(`Sorting keys based on count: ${a}, ${b}`);
        return store[a].created_at.getTime() - store[b].created_at.getTime(); // count or undefined. if undefined, then it 0
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
