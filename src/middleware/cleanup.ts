import { ZodError } from "zod";
import logger from "../utils/logger";
import { Request, Response, NextFunction } from "express";
import { maxKeys, threshold } from "../../config/default";
import { storeWithTTL, storeWithoutTTL } from "../controller/store.controller";

const sortKeysWithoutTTLForCleanup = async () => {
  try {
    let sortedKeysWithoutTTL: string[] = [];
    const totalKeysWithoutTTL = storeWithoutTTL.size;
    const totalKeysWithTTL = storeWithTTL.size;

    logger.info(
      `Total keys in store: ${
        totalKeysWithoutTTL + totalKeysWithTTL
      }, max keys allowed: ${maxKeys * threshold}`
    );

    if (totalKeysWithoutTTL + totalKeysWithTTL > maxKeys * threshold) {
      logger.info(
        `Cleanup keys without TTL triggered as total keys are greater than or equal to ${
          maxKeys * threshold
        }`
      );

      sortedKeysWithoutTTL = Array.from(storeWithoutTTL.keys()).sort((a, b) => {
        const aItem = storeWithoutTTL.get(a);
        const bItem = storeWithoutTTL.get(b);
        if ((aItem?.count ?? 0) !== (bItem?.count ?? 0)) {
          return (aItem?.count ?? 0) - (bItem?.count ?? 0);
        } else {
          return (
            (aItem?.created_at?.getTime() ?? 0) -
            (bItem?.created_at?.getTime() ?? 0)
          );
        }
      });
    }

    return sortedKeysWithoutTTL;
  } catch (e: any) {
    logger.info(`Error in sortKeysWithoutTTLForCleanup method: ${e.message}`);
    return [];
  }
};

const sortKeysWithTTLForCleanup = async (): Promise<string[]> => {
  try {
    let sortedKeysWithTTL: string[] = [];
    const totalKeysWithoutTTL = storeWithoutTTL.size;
    const totalKeysWithTTL = storeWithTTL.size;

    logger.info(
      `Total keys in store: ${
        totalKeysWithoutTTL + totalKeysWithTTL
      }, max keys allowed: ${maxKeys * threshold}`
    );

    if (totalKeysWithoutTTL + totalKeysWithTTL > maxKeys * threshold) {
      logger.info(
        `Cleanup keys with TTL triggered as total keys are greater than or equal to ${
          maxKeys * threshold
        }`
      );

      const keysWithTTL = Array.from(storeWithTTL.keys());
      const items = await Promise.all(
        keysWithTTL.map(async (key) => {
          const item = storeWithTTL.get(key);
          return {
            key,
            count: item?.count ?? 0,
            created_at: item?.created_at?.getTime() ?? 0,
          };
        })
      );

      sortedKeysWithTTL = keysWithTTL.sort((a, b) => {
        const aItem = items.find((item) => item.key === a);
        const bItem = items.find((item) => item.key === b);
        if (aItem && bItem) {
          if (aItem.count !== bItem.count) {
            return aItem.count - bItem.count;
          } else {
            return aItem.created_at - bItem.created_at;
          }
        }
        return 0;
      });
    }

    return sortedKeysWithTTL;
  } catch (e: any) {
    logger.info(`Error in sortKeysWithTTLForCleanup method: ${e.message}`);
    return [];
  }
};

const deleteKeysWithoutTTL = async (keysWithoutTTLToDelete: string[]) => {
  try {
    for (const keyWithoutTTLToDelete of keysWithoutTTLToDelete) {
      storeWithoutTTL.delete(keyWithoutTTLToDelete);
    }
  } catch (e: any) {
    logger.info(`Error in deleteKeysWithoutTTL method: ${e.message}`);
  }
};

export const cleanupKeys = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    logger.info("Started checking for keys without TTL to delete in store");
    const sortedKeysWithoutTTL = await sortKeysWithoutTTLForCleanup();
    const sortedKeysWithTTL = await sortKeysWithTTLForCleanup();

    if (sortedKeysWithoutTTL.length) {
      const keysToDelete: string[] = [];

      for (const key of sortedKeysWithoutTTL) {
        const item = storeWithoutTTL.get(key);
        if (!item || item.ttl) {
          logger.info(`Skipping key(${key}) deletion as it has ttl set`);
          continue;
        }

        keysToDelete.push(key);
        logger.info(`Key(${key}) added to delete list`);
        if (
          keysToDelete.length >
          storeWithoutTTL.size + storeWithTTL.size - maxKeys
        ) {
          break;
        }
      }
      logger.info(`Deleting Keys without TTL: ${keysToDelete.join(",")}`);
      await deleteKeysWithoutTTL(keysToDelete);
    }

    // if keys still exceed the threshold, delete the least used and oldest keys with ttl
    const totalKeys = storeWithoutTTL.size + storeWithTTL.size;
    if (totalKeys > maxKeys * threshold) {
      logger.info(
        "Started cleaning keys with TTL as total keys still exceed threshold"
      );
      const keysToDelete: string[] = [];

      // Use sortedKeysWithTTL here
      for (const key of sortedKeysWithTTL) {
        keysToDelete.push(key);
        if (keysToDelete.length >= totalKeys - maxKeys * threshold) {
          break;
        }
      }

      logger.info(`Deleting Keys with TTL: ${keysToDelete.join(",")}`);
      keysToDelete.forEach((key) => {
        storeWithTTL.delete(key);
      });
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
