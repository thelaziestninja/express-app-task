import { ZodError } from "zod";
import logger from "../utils/logger";
import { Request, Response, NextFunction } from "express";
import { maxKeys, threshold } from "../../config/default";
import { storeWithTTL, storeWithoutTTL } from "../controller/store.controller";

const sortKeysWithoutTTLForCleanup = async () => {
  try {
    let sortedKeysWithoutTTL: string[] = [];
    const totalKeysWithoutTTL = Object.keys(storeWithoutTTL).length;
    const totalKeysWithTTL = Object.keys(storeWithTTL).length;
    console.log("totalKeysWithoutTTL.length", totalKeysWithoutTTL);
    console.log("totalKeysWithTTL.length", totalKeysWithTTL);
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

      sortedKeysWithoutTTL = Object.keys(storeWithoutTTL).sort((a, b) => {
        if (
          (storeWithoutTTL[a].count ?? 0) !== (storeWithoutTTL[b].count ?? 0)
        ) {
          return (
            (storeWithoutTTL[a].count ?? 0) - (storeWithoutTTL[b].count ?? 0)
          );
        } else {
          return (
            storeWithoutTTL[a].created_at.getTime() -
            storeWithoutTTL[b].created_at.getTime()
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

const deleteKeysWithoutTTL = async (keysWithoutTTLToDelete: string[]) => {
  try {
    for (const keyWithoutTTLToDelete of keysWithoutTTLToDelete) {
      delete storeWithoutTTL[keyWithoutTTLToDelete];
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

    if (sortedKeysWithoutTTL.length) {
      const keysToDelete: string[] = [];

      for (const key of sortedKeysWithoutTTL) {
        if (storeWithoutTTL[key].ttl) {
          logger.info(`Skipping key(${key}) deletion as it has ttl set`);
          continue;
        }

        keysToDelete.push(key);
        logger.info(`Key(${key}) added to delete list`);
        if (
          keysToDelete.length >
          Object.keys(storeWithoutTTL).length +
            Object.keys(storeWithTTL).length -
            maxKeys
        ) {
          break;
        }
      }
      logger.info(`Deleting Keys without TTL: ${keysToDelete.join(",")}`);
      await deleteKeysWithoutTTL(keysToDelete);
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
