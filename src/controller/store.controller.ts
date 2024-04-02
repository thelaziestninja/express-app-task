import { Store } from "../types";
import {
  EmptyRequest,
  Request,
  Response,
  StoreResponse,
  ResponseStatus,
} from "../types/request";
import logger from "../utils/logger";
import { maxKeys } from "../../config/default";
import { StoreInput, UpdateKeyInput } from "../schema/store.schema";
import { clear } from "console";

export const storeWithTTL: Store = {};
export const storeWithoutTTL: Store = {};

//dev request
// export async function GetStoresHandler(
//   req: Request<EmptyRequest>,
//   res: Response<StoreResponse>
// ) {
//   try {
//     if (
//       Object.keys(storeWithTTL).length + Object.keys(storeWithoutTTL).length <=
//       0
//     ) {
//       logger.info(`Store requested but it's empty`);
//       return res
//         .status(ResponseStatus.BadRequest)
//         .send({ message: "Store is empty", storeWithoutTTL, storeWithTTL });
//     }

//     logger.info("Store requested, store returned");
//     return res
//       .status(ResponseStatus.Success)
//       .send({ message: "Keys in store:", store });
//   } catch (e: any) {
//     logger.info("Error getting store", e);
//     console.log(e);
//     return res.status(ResponseStatus.InternalServerError).send(e.message);
//   }
// }

export async function AddToStoreHandler(
  req: Request<StoreInput["body"]>,
  res: Response<StoreResponse>
) {
  try {
    if (
      Object.keys(storeWithTTL).length + Object.keys(storeWithoutTTL).length >=
      maxKeys
    ) {
      // or 200
      logger.info("Store Overflowed, can't add more keys");
      return res
        .status(ResponseStatus.BadRequest)
        .send({ message: "Store is full" });
    }

    const { key, value, ttl } = req.body;

    if (storeWithTTL[key] || storeWithoutTTL[key]) {
      logger.info(`Key already exists in store - ${key}`);
      return res
        .status(ResponseStatus.BadRequest)
        .send({ message: "Key already exists in store" });
    }

    let timeoutId: NodeJS.Timeout | undefined;
    if (ttl) {
      timeoutId = setTimeout(() => {
        delete storeWithTTL[key];
      }, Number(ttl) * 1000);
      clearTimeout(storeWithTTL[key]?.timeoutId);
    }

    if (ttl) {
      storeWithTTL[key] = { value, created_at: new Date(), ttl, timeoutId };
    } else {
      storeWithoutTTL[key] = { value, created_at: new Date(), ttl, timeoutId };
    }

    console.log("storeWithTTL", storeWithTTL);
    console.log("storeWithoutTTL", storeWithoutTTL);

    logger.info(`Added key-value pair to store - ${key}:${value}`);
    return res.status(ResponseStatus.Created).send({
      message: "key-value pair added to store",
      key,
      value,
      ttl,
      created_at: ttl
        ? storeWithTTL[key].created_at
        : storeWithoutTTL[key].created_at,
    });
  } catch (e: any) {
    logger.info("Error adding key-value pair to store", e);
    console.log(e);
    return res
      .status(ResponseStatus.InternalServerError)
      .send({ message: "Internal server error" });
  }
}

export async function GetKeyHandler(
  req: Request<{ key: string }>,
  res: Response<StoreResponse>
) {
  try {
    const key = req.params.key;

    const foundKey = storeWithTTL[key] || storeWithoutTTL[key];

    if (!foundKey) {
      logger.info(`Key not found in store - ${key}`);
      return res
        .status(ResponseStatus.BadRequest)
        .send({ message: "Key not found in store" });
    }

    if (foundKey.ttl) {
      storeWithTTL[key].count = (storeWithTTL[key].count || 0) + 1;
    } else {
      storeWithoutTTL[key].count = (storeWithoutTTL[key].count || 0) + 1;
    }

    logger.info(`Key found in store - ${key}:${foundKey.value}`);
    return res.status(ResponseStatus.Success).send({
      message: "Key found in store",
      key,
      value: foundKey.value,
      count: foundKey.count,
      created_at: foundKey.created_at,
    });
  } catch (e: any) {
    logger.info("Error getting key from store", e);
    return res
      .status(ResponseStatus.InternalServerError)
      .send({ message: "Internal server error" });
  }
}

export async function UpdateKeyHandler(
  req: Request<UpdateKeyInput["body"]>,
  res: Response<StoreResponse>
) {
  try {
    const { value, ttl } = req.body;
    const key = req.params.key;

    const foundKeyWithTTL = storeWithTTL[key];
    const foundKeyWithoutTTL = storeWithoutTTL[key];

    const foundKey = storeWithTTL[key] || storeWithoutTTL[key];

    if (!foundKeyWithTTL && !foundKeyWithoutTTL) {
      logger.info(`Key not found in store - ${key}`);
      return res
        .status(ResponseStatus.BadRequest)
        .send({ message: "Key not found in store" });
    }

    if (
      foundKeyWithTTL &&
      foundKeyWithTTL.ttl &&
      Number(foundKeyWithTTL.ttl) <= 4
    ) {
      logger.info(`Key has a TTL of 4 seconds or less, cannot be updated.`);
      return res.status(ResponseStatus.BadRequest).send({
        message: "Key has a TTL of 4 seconds or less, cannot be updated",
      });
    }

    // case 1: update a key without ttl to a key without ttl with another value
    // case 2: update a key with ttl to a key with (another) ttl with another value
    // case 3: update a key without ttl to a key with ttl
    // case 4: update a key with ttl to a key without ttl

    if (foundKeyWithoutTTL && !foundKeyWithTTL && !ttl) {
      storeWithoutTTL[key].value = value;
      storeWithoutTTL[key].count = (storeWithoutTTL[key].count || 0) + 1;
    }

    if (foundKeyWithTTL && !foundKeyWithoutTTL && ttl) {
      storeWithTTL[key].value = value;
      storeWithTTL[key].count = (storeWithTTL[key].count || 0) + 1;

      clearTimeout(storeWithTTL[key].timeoutId);
      storeWithTTL[key].timeoutId = setTimeout(() => {
        delete storeWithTTL[key];
      }, Number(ttl) * 1000);
    }

    if (!foundKeyWithTTL && foundKeyWithoutTTL && ttl) {
      storeWithTTL[key] = {
        ...foundKeyWithoutTTL,
        ttl,
        count: (foundKeyWithoutTTL.count || 0) + 1,
        timeoutId: setTimeout(() => {
          delete storeWithTTL[key];
        }, Number(ttl) * 1000),
      };
      delete storeWithoutTTL[key];
    }

    if (foundKeyWithTTL && !foundKeyWithoutTTL && !ttl) {
      // here I want to move the foundKeyWithTTL[key] to storeWithoutTTL
      // and delete the foundKeyWithTTL[key]
      storeWithoutTTL[key] = {
        ...foundKeyWithTTL,
        count: (foundKeyWithTTL.count || 0) + 1,
      };
      delete storeWithTTL[key];
    }

    // console.log("storeWithTTL", storeWithTTL);
    // console.log("storeWithoutTTL", storeWithoutTTL);

    logger.info(`Updated key-value pair in store - ${key}:${value}`);
    return res.status(ResponseStatus.Success).send({
      message: "key-value pair updated in store",
      key,
      value,
      ttl,
      count: foundKey.count,
      created_at: foundKey.created_at,
    });
  } catch (e: any) {
    logger.info("Error updating key-value pair in store", e);
    return res
      .status(ResponseStatus.InternalServerError)
      .send({ message: "Internal server error" });
  }
}

export async function DeleteKeyHandler(
  req: Request<{ key: string }>,
  res: Response<StoreResponse>
) {
  try {
    const key = req.params.key;

    const foundKey = storeWithTTL[key] || storeWithoutTTL[key];

    if (!foundKey) {
      logger.info("User failed to delete key", key);
      return res.status(ResponseStatus.NotFound).send({
        message: "Key not found in store",
      });
    }

    logger.info("User succesfully deleted key", key);
    delete foundKey.ttl ? storeWithTTL[key] : storeWithoutTTL[key];
    return res
      .status(ResponseStatus.Success)
      .send({ message: "key deleted from store", key });
  } catch (e: any) {
    logger.info("Error deleting key", e);
    return res
      .status(ResponseStatus.InternalServerError)
      .send({ message: "Internal server error" });
  }
}
