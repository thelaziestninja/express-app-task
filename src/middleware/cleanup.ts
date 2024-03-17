import { ZodError } from "zod";
import logger from "../utils/logger";
import { Request, Response, NextFunction } from "express";
import { maxKeys, threshold } from "../../config/default";
import { store } from "../controller/store.controller";

const keySorting = async () => {
  try {
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
        // return store[a].created_at.getTime() - store[b].created_at.getTime(); // count or undefined. if undefined, then it 0
        if ((store[a].count ?? 0) !== (store[b].count ?? 0)) {
          // logger.info(`Sorting keys based on least used count: ${a}, ${b}`);
          return (store[a].count ?? 0) - (store[b].count ?? 0);
        } else {
          // logger.info(
          //   `Sorting keys based on created_at timestamp (oldest first): ${a}, ${b}`
          // );
          return store[a].created_at.getTime() - store[b].created_at.getTime();
        }
      });

      const keysToDelete: string[] = [];

      for (const key of sortedKeys) {
        if (store[key].ttl) {
          logger.info(`Skipping key(${key}) deletion as it has ttl set`);
          continue;
        }

        keysToDelete.push(key);
        logger.info(`Key(${key}) added to delete list`);
        if (keysToDelete.length >= totalKeys - maxKeys) {
          logger.info(
            `Total keys to be deleted: ${keysToDelete.length}, breaking the loop`
          );
          break;
        }
      }
      for (const keyToDelete of keysToDelete) {
        logger.info(
          `Deleting key: ${keyToDelete}, total keys deleted: ${keysToDelete.length}`
        );
        delete store[keyToDelete];
      }
    }
  } catch (e: any) {
    logger.info(`Error in cleanUp logic / keySorting method: ${e.message}`);
  }
};

export const cleanupKeys = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    logger.info("Cleaning up keys in store called");
    await keySorting();

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
