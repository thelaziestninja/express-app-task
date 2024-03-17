import { Express } from "express";
import { validate } from "./middleware/validate";
import { StackSchema } from "./schema/stack.schema";
import {
  AddToStackHandler,
  PopFromStackHandler,
} from "./controller/stack.controller";
import {
  AddToStoreHandler,
  DeleteKeyHandler,
  GetKeyHandler,
  GetStoreHandler,
  UpdateKeyHandler,
} from "./controller/store.controller";
import { StoreParams, StoreSchema } from "./schema/store.schema";
import { cleanupKeys } from "./middleware/cleanup";

function routes(app: Express) {
  app.post("/stack", validate(StackSchema), AddToStackHandler);
  app.get("/stack", PopFromStackHandler); // here it doesn't need to validate the request body / query params / path params as it's a GET request

  app.get("/store", GetStoreHandler); // dev api
  app.post("/store", validate(StoreSchema), AddToStoreHandler);
  app.patch(
    "/store/:key",
    cleanupKeys,
    validate(StoreParams),
    // validate(UpdateKeySchema),
    UpdateKeyHandler
  );
  app.get("/store/:key", cleanupKeys, GetKeyHandler); // here it doesn't need to validate the request body / query params / path params as it's a GET request
  app.delete("/store/:key", DeleteKeyHandler); // here it doesn't need to validate the request body / query params / path params as it's a DELETE request
}

export default routes;
