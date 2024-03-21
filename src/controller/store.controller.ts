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

export const store: Store = {};

//dev request
export async function GetStoreHandler(
  req: Request<EmptyRequest>,
  res: Response<StoreResponse>
) {
  try {
    if (Object.keys(store).length <= 0) {
      logger.info(`Store requested but it's empty`);
      return res
        .status(ResponseStatus.BadRequest)
        .send({ message: "Store is empty", store });
    }

    logger.info("Store requested, store returned");
    return res
      .status(ResponseStatus.Success)
      .send({ message: "Keys in store:", store });
  } catch (e: any) {
    logger.info("Error getting store", e);
    console.log(e);
    return res.status(ResponseStatus.InternalServerError).send(e.message);
  }
}

export async function AddToStoreHandler(
  req: Request<StoreInput["body"]>,
  res: Response<StoreResponse>
) {
  try {
    if (Object.keys(store).length >= maxKeys) {
      // or 200
      logger.info("Store Overflowed, can't add more keys");
      return res
        .status(ResponseStatus.BadRequest)
        .send({ message: "Store is full" });
    }

    const { key, value, ttl } = req.body;

    if (store[key]) {
      logger.info(`Key already exists in store - ${key}`);
      return res
        .status(ResponseStatus.BadRequest)
        .send({ message: "Key already exists in store" });
    }

    let timeoutId: NodeJS.Timeout | undefined;
    if (ttl) {
      timeoutId = setTimeout(() => {
        delete store[key];
      }, Number(ttl) * 1000);
      clearTimeout(store[key]?.timeoutId);
    }

    store[key] = { value, created_at: new Date(), ttl, timeoutId };

    logger.info(`Added key-value pair to store - ${key}:${value}`);
    return res.status(ResponseStatus.Created).send({
      message: "key-value pair added to store",
      key,
      value,
      ttl,
      created_at: store[key].created_at,
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

    if (!store[key]) {
      logger.info(`Key not found in store - ${key}`);
      return res
        .status(ResponseStatus.BadRequest)
        .send({ message: "Key not found in store" });
    }

    store[key].count = (store[key].count || 0) + 1;

    logger.info(`Key found in store - ${key}:${store[key].value}`);
    return res.status(ResponseStatus.Success).send({
      message: "Key found in store",
      key,
      value: store[key].value,
      count: store[key].count,
      created_at: store[key].created_at,
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

    if (!store[key]) {
      logger.info(`Key not found in store - ${key}`);
      return res
        .status(ResponseStatus.BadRequest)
        .send({ message: "Key not found in store" });
    }

    if (store[key] && store[key].ttl && Number(store[key].ttl) <= 4) {
      logger.info(`Key has a TTL of 4 seconds or less, cannot be updated.`);
      return res.status(ResponseStatus.BadRequest).send({
        message: "Key has a TTL of 4 seconds or less, cannot be updated",
      });
    }

    store[key].value = value;
    store[key].count = (store[key].count || 0) + 1;

    if (store[key].timeoutId && ttl) {
      logger.info(`Clearing timeout for key - ${key}`);
      clearTimeout(store[key].timeoutId);
      setTimeout(() => {
        delete store[key];
      }, Number(ttl) * 1000);
    }

    if (!store[key].ttl && ttl) {
      store[key].timeoutId = setTimeout(() => {
        delete store[key];
      }, Number(ttl) * 1000);
    }

    logger.info(`Updated key-value pair in store - ${key}:${value}`);
    return res.status(ResponseStatus.Success).send({
      message: "key-value pair updated in store",
      key,
      value,
      ttl,
      count: store[key].count,
      created_at: store[key].created_at,
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

    if (!store[key]) {
      logger.info("User failed to delete key", key);
      return res
        .status(ResponseStatus.NotFound)
        .send({ message: "Key not found in store", store });
    }

    logger.info("User succesfully deleted key", key);
    delete store[key];
    return res
      .status(ResponseStatus.Success)
      .send({ message: "key deleted from store", store });
  } catch (e: any) {
    logger.info("Error deleting key", e);
    return res
      .status(ResponseStatus.InternalServerError)
      .send({ message: "Internal server error" });
  }
}
