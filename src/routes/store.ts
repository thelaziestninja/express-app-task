import logger from "../utils/logger";
import { StoreElement } from "../types";
import MinHeap from "../structures/MinHeap";
import { setTimeoutId } from "../utils/utils";
import { maxKeys } from "../../config/default";
import { Request, Response, Router } from "express";
import { StoreResponse, ResponseStatus } from "../types/request";
import {
  StoreInput,
  StoreParams,
  StoreParamsSchema,
  StoreQueryParams,
  StoreSchema,
} from "../schema/store.schema";
import { validateRequestData } from "../middleware/validate";
import { cleanupKeys } from "../middleware/cleanup";

const router = Router();

const storeWithTTL = new Map<string, StoreElement>();
const storeWithoutTTL = new Map<string, StoreElement>();
const minHeapWithTTL = new MinHeap();
const minHeapWithoutTTL = new MinHeap();

router.post(
  "/",
  validateRequestData(StoreSchema),
  async (req: Request, res: Response<StoreResponse>) => {
    try {
      const { key, value, ttl } = req.body as StoreInput["body"];

      if (storeWithTTL.get(key) || storeWithoutTTL.get(key)) {
        logger.info(`Key already exists in store - ${key}`);
        return res
          .status(ResponseStatus.BadRequest)
          .send({ message: "Key already exists in store" });
      }

      if (storeWithTTL.size + storeWithoutTTL.size >= maxKeys) {
        // or 200
        logger.info("Store Overflowed, can't add more keys");
        return res
          .status(ResponseStatus.BadRequest)
          .send({ message: "Store is full" });
      }

      let timeoutId: NodeJS.Timeout | undefined;
      if (ttl) {
        timeoutId = setTimeoutId(
          key,
          Number(ttl),
          storeWithTTL,
          minHeapWithTTL
        );
      }

      const data: StoreElement = {
        key,
        value,
        ttl,
        count: 0,
        created_at: new Date(Date.now()),
        timeoutId,
        heapIndex: -1,
      };

      const store = ttl ? storeWithTTL : storeWithoutTTL;
      const heap = ttl ? minHeapWithTTL : minHeapWithoutTTL;

      store.set(key, data);
      heap.add(data);

      console.log("storeWithTTL", storeWithTTL);
      console.log("minheapWithTTL", minHeapWithTTL);

      logger.info(`Added key-value pair to store - ${key}:${value}`);
      return res.status(ResponseStatus.Created).send({
        message: "key-value pair added to store",
        key,
        value,
        ttl,
        created_at: data.created_at,
      });
    } catch (e: any) {
      logger.info("Error adding key-value pair to store", e);
      return res
        .status(ResponseStatus.InternalServerError)
        .send({ message: "Internal server error" });
    }
  }
);

router.get(
  "/:key",
  cleanupKeys,
  async (req: Request<{ key: string }>, res: Response<StoreResponse>) => {
    try {
      const key = req.params.key;

      const item = storeWithTTL.get(key) ?? storeWithoutTTL.get(key);

      if (!item) {
        logger.info(`Key not found in store - ${key}`);
        return res
          .status(ResponseStatus.BadRequest)
          .send({ message: "Key not found in store" });
      }

      item.count = (item.count || 0) + 1;

      console.log("storeWithTTL", storeWithTTL);
      console.log("minheapWithTTL", minHeapWithTTL);

      logger.info(`Key found in store - ${key}:${item.value}`);
      return res.status(ResponseStatus.Success).send({
        message: "Key found in store",
        key,
        ttl: item.ttl,
        value: item.value,
        count: item.count,
        created_at: item.created_at,
      });
    } catch (e: any) {
      logger.info("Error getting key from store", e);
      return res
        .status(ResponseStatus.InternalServerError)
        .send({ message: "Internal server error" });
    }
  }
);

router.patch(
  "/:key",
  validateRequestData(StoreParamsSchema),
  cleanupKeys,
  async (
    req: Request<StoreParams["params"], {}, StoreParams["body"]>,
    res: Response<StoreResponse>
  ) => {
    try {
      const { value } = req.body;
      const { key } = req.params;

      const item = storeWithTTL.get(key) ?? storeWithoutTTL.get(key);

      if (!item) {
        logger.info(`Key not found in store - ${key}`);
        return res
          .status(ResponseStatus.BadRequest)
          .send({ message: "Key not found in store" });
      }

      item.value = value;
      item.count = (item.count || 0) + 1;

      console.log("storeWithTTL", storeWithTTL);
      console.log("minheapWithTTL", minHeapWithTTL);

      logger.info(`Updated key-value pair in store - ${key}:${value}`);
      return res.status(ResponseStatus.Success).send({
        message: "key-value pair updated in store",
        key,
        value,
        ttl: item.ttl,
        count: item.count,
        created_at: item.created_at,
      });
    } catch (e: any) {
      logger.info("Error updating key-value pair in store", e);
      return res
        .status(ResponseStatus.InternalServerError)
        .send({ message: "Internal server error" });
    }
  }
);

router.delete(
  "/:key",
  validateRequestData(StoreQueryParams),
  cleanupKeys,
  async (req: Request<{ key: string }>, res: Response<StoreResponse>) => {
    try {
      const key = req.params.key;

      const foundItem = storeWithTTL.get(key) ?? storeWithoutTTL.get(key);

      if (!foundItem) {
        logger.info("User failed to delete key", key);
        return res.status(ResponseStatus.NotFound).send({
          message: "Key not found in store",
        });
      }

      logger.info("User succesfully deleted key", key);
      const store = foundItem.ttl ? storeWithTTL : storeWithoutTTL;
      const heap = foundItem.ttl ? minHeapWithTTL : minHeapWithoutTTL;

      store.delete(key);
      heap.remove(foundItem);

      console.log("storeWithTTL", storeWithTTL);
      console.log("minheapWithTTL", minHeapWithTTL);

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
);

export default router;
