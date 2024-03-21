import { ZodError } from "zod";
import logger from "../utils/logger";
import { store } from "../controller/store.controller";
import { Request, Response, NextFunction } from "express";
import { maxKeys, threshold } from "../../config/default";

const sortKeysForCleanup = async () => {
  try {
    let sortedKeys: string[] = [];
    const totalKeys = Object.keys(store).length;

    if (totalKeys >= maxKeys * threshold) {
      sortedKeys = Object.keys(store).sort((a, b) => {
        if ((store[a].count ?? 0) !== (store[b].count ?? 0)) {
          return (store[a].count ?? 0) - (store[b].count ?? 0);
        } else {
          return store[a].created_at.getTime() - store[b].created_at.getTime();
        }
      });
    }
    return sortedKeys;
  } catch (e: any) {
    logger.info(`Error in sortKeysForCleanup method: ${e.message}`);
    return [];
  }
};

const deleteKeys = async (keysToDelete: string[]) => {
  try {
    for (const keyToDelete of keysToDelete) {
      logger.info(
        `Deleting key: ${keyToDelete}, total keys deleted: ${keysToDelete.length}`
      );
      delete store[keyToDelete];
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
    logger.info("Started checking for keys to delete in store");
    const sortedKeys = await sortKeysForCleanup();

    if (sortedKeys.length) {
      const keysToDelete: string[] = [];

      for (const key of sortedKeys) {
        if (store[key].ttl) {
          logger.info(`Skipping key(${key}) deletion as it has ttl set`);
          continue;
        }

        keysToDelete.push(key);
        logger.info(`Key(${key}) added to delete list`);
        if (keysToDelete.length >= Object.keys(store).length - maxKeys) {
          logger.info(
            `Total keys to be deleted: ${keysToDelete.length}, breaking the loop`
          );
          break;
        }
      }
      await deleteKeys(keysToDelete);
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
