import { ZodError } from "zod";
import logger from "../utils/logger";
import { store } from "../controller/store.controller";
import { Request, Response, NextFunction } from "express";
import { maxKeys, threshold } from "../../config/default";

const sortKeysForCleanup = async () => {
  try {
    let sortedKeys: string[] = [];
    const totalKeys = Object.keys(store).length;
    logger.info(
      `Total keys in store: ${totalKeys}, max keys allowed: ${
        maxKeys * threshold
      }`
    );

    if (totalKeys >= maxKeys * threshold) {
      logger.info(
        `Cleanup triggered as total keys are greater than or equal to ${
          maxKeys * threshold
        }`
      );

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
      delete store[keyToDelete];
    }
  } catch (e: any) {
    logger.info(`Error in deleteKeys method: ${e.message}`);
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
          // logger.info(`Skipping key(${key}) deletion as it has ttl set`);
          continue;
        }

        keysToDelete.push(key);
        // logger.info(`Key(${key}) added to delete list`);
        if (keysToDelete.length >= Object.keys(store).length - maxKeys) {
          break;
        }
      }
      logger.info(`Deleting Keys: ${keysToDelete.join(",")}`);
      await deleteKeys(keysToDelete);

      // if keys still exceed the threshold, delete the least used and oldest keys with ttl

      if (Object.keys(store).length >= maxKeys * threshold) {
        const sortedKeysWithTTL = await sortKeysForCleanup();
        if (sortedKeysWithTTL.length) {
          const keysToDeleteWithTTL: string[] = [];

          for (const key of keysToDeleteWithTTL) {
            if (!store[key].timeoutId || keysToDelete.includes(key)) {
              // logger.info(`Skipping key(${key}) deletion as it doesn't have ttl set`);
              continue;
            }

            keysToDeleteWithTTL.push(key);
            // logger.info(`Key(${key}) added to delete list`);
            if (
              keysToDeleteWithTTL.length >=
              Object.keys(store).length - maxKeys
            ) {
              break;
            }
          }
          logger.info(
            `Deleting Keys with TTL: ${keysToDeleteWithTTL.join(",")}`
          );
          await deleteKeys(keysToDeleteWithTTL);
        }
      }
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
