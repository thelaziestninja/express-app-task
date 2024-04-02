import { Express } from "express";
import { validateRequestData } from "./middleware/validate";
import { StackSchema } from "./schema/stack.schema";
import {
  AddToStackHandler,
  PopFromStackHandler,
} from "./controller/stack.controller";
import {
  AddToStoreHandler,
  DeleteKeyHandler,
  GetKeyHandler,
  // GetStoreHandler,
  UpdateKeyHandler,
} from "./controller/store.controller";
import {
  StoreParams,
  StoreQueryParams,
  StoreSchema,
} from "./schema/store.schema";
import { cleanupKeys } from "./middleware/cleanup";

function routes(app: Express) {
  app.post("/stack", validateRequestData(StackSchema), AddToStackHandler);
  app.get("/stack", PopFromStackHandler); // here it doesn't need to validate the request body / query params / path params as it's a GET request

  //hiding the dev api
  // if (process.env.NODE_ENV !== "production") {
  //   app.get("/store", GetStoreHandler);
  // }

  app.post("/store", validateRequestData(StoreSchema), AddToStoreHandler);
  app.patch(
    "/store/:key",
    cleanupKeys,
    validateRequestData(StoreParams),
    UpdateKeyHandler
  );
  app.get("/store/:key", cleanupKeys, GetKeyHandler); // here it doesn't need to validate the request body / query params / path params as it's a GET request
  app.delete(
    "/store/:key",
    validateRequestData(StoreQueryParams),
    DeleteKeyHandler
  ); // here it doesn't need to validate the request body / query params / path params as it's a DELETE request
}

export default routes;
