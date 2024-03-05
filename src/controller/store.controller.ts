import { store } from "../app";
import logger from "../utils/logger";
import {
  EmptyRequest,
  Request,
  Response,
  StoreResponse,
} from "../types/request";
import { StoreInput, UpdateKeyInput } from "../schema/store.schema";
import { maxKeys } from "../middleware/cleanup";

export async function GetStoreHandler(
  req: Request<EmptyRequest>,
  res: Response<StoreResponse>
) {
  try {
    if (Object.keys(store).length > 0) {
      Object.keys(store).forEach((key) => {
        if (typeof store[key] === "object") {
          store[key].count = (store[key].count || 0) + 1;
        }
      });

      logger.info("Get store requested and it's not empty");
      return res.status(200).json({ message: "Giving store", store });
    }
    logger.info(`Store requested but it's empty`);
    return res.status(400).json({ message: "Store is empty" });
  } catch (e: any) {
    logger.error("Error getting store", e);
    return res.status(500).send(e.message);
  }
}

export async function AddToStoreHandler(
  req: Request<StoreInput["body"]>,
  res: Response<StoreResponse>
) {
  try {
    if (Object.keys(store).length >= 200) {
      // or maxKeys
      logger.info("Store Overflowed, can't add more keys");
      return res.status(400).json({ message: "Store is full" });
    }

    const { key, value, ttl } = req.body;

    if (!store[key]) {
      store[key] = { value, created_at: new Date() };
    } else {
      logger.info(`Key already exists in store - ${key}`);
      return res.status(400).json({ message: "Key already exists in store" });
    }

    // console.log("Keys of the store: ", Object.keys(store));
    // console.log("Values of the store: ", Object.values(store));
    // console.log("Entries of the store: ", Object.entries(store)); // array of key-value pairs

    if (ttl) {
      setTimeout(() => {
        delete store[key];
      }, Number(ttl) * 1000);
    }

    logger.info(`Added key-value pair to store - ${key}:${value}`);
    return res
      .status(200)
      .json({ message: "key-value pair added to store", store });
  } catch (e: any) {
    logger.error("Error adding key-value pair to store", e);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function GetKeyHandler(
  req: Request<{ key: string }>,
  res: Response<StoreResponse>
) {
  try {
    const key = req.params.key;
    if (store[key]) {
      store[key].count = (store[key].count || 0) + 1;
      logger.info(`Key found in store - ${key}:${store[key].value}`);
      return res.status(200).json({
        message: "Key found in store",
        key,
        value: store[key].value,
        count: store[key].count,
        created_at: store[key].created_at,
      });
    }
    logger.info(`Key not found in store - ${key}`);
    return res.status(400).json({ message: "Key not found in store" });
  } catch (e: any) {
    logger.error("Error getting key from store", e);
    return res.status(500).json({ message: "Internal server error" });
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
      return res.status(400).json({ message: "Key not found in store" });
    } else {
      store[key].value = value;
      store[key].count = (store[key].count || 0) + 1;
      if (ttl) {
        setTimeout(() => {
          delete store[key];
        }, Number(ttl) * 1000);
      }
      logger.info(`Updated key-value pair in store - ${key}:${value}`);
      return res
        .status(200)
        .json({ message: "key-value pair updated in store", store });
    }

    // logger.info(`Key not found in store - ${key}`);
    // return res.status(400).json({ message: "Key not found in store" });
  } catch (e: any) {
    logger.error("Error updating key-value pair in store", e);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function DeleteKeyHandler(
  req: Request<{ key: string }>,
  res: Response<StoreResponse>
) {
  try {
    const key = req.params.key;

    if (store[key]) {
      logger.info("User succesfully deleted key", key);
      delete store[key];
      return res.status(200).json({ message: "key deleted from store", store });
    }
    logger.info("User failed to delete key", key);
    return res.status(400).json({ message: "Key not found in store", store });
  } catch (e: any) {
    logger.error("Error deleting key", e);
    return res.status(500).json({ message: "Internal server error" });
  }
}
