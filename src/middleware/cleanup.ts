import { ZodError } from "zod";
import logger from "../utils/logger";
import { Request, Response, NextFunction } from "express";
import { maxKeys, threshold } from "../../config/default";
import { storeWithTTL, storeWithoutTTL } from "../controller/store.controller";
// const sortKeysWithoutTTLForCleanup = async () => {
//   try {
//     let sortedKeysWithoutTTL: string[] = [];
//     const totalKeysWithoutTTL = storeWithoutTTL.size;
//     const totalKeysWithTTL = storeWithTTL.size;

//     logger.info(
//       `Total keys in store: ${
//         totalKeysWithoutTTL + totalKeysWithTTL
//       }, max keys allowed: ${maxKeys * threshold}`
//     );

//     if (totalKeysWithoutTTL + totalKeysWithTTL > maxKeys * threshold) {
//       logger.info(
//         `Cleanup keys without TTL triggered as total keys are greater than or equal to ${
//           maxKeys * threshold
//         }`
//       );

//       sortedKeysWithoutTTL = Array.from(storeWithoutTTL.keys()).sort((a, b) => {
//         const aItem = storeWithoutTTL.get(a);
//         const bItem = storeWithoutTTL.get(b);
//         if ((aItem?.count ?? 0) !== (bItem?.count ?? 0)) {
//           return (aItem?.count ?? 0) - (bItem?.count ?? 0);
//         } else {
//           return (
//             (aItem?.created_at?.getTime() ?? 0) -
//             (bItem?.created_at?.getTime() ?? 0)
//           );
//         }
//       });
//     }

//     return sortedKeysWithoutTTL;
//   } catch (e: any) {
//     logger.info(`Error in sortKeysWithoutTTLForCleanup method: ${e.message}`);
//     return [];
//   }
// };

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

export const cleanupKeys = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    logger.info("Started checking for keys without TTL to delete in store");

    await sortAndDeleteKeysWithoutTTL();
    // if keys still exceed the threshold, delete the least used and oldest keys with ttl

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
