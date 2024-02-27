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
import {
  StoreQueryParams,
  StoreSchema,
  UpdateKeySchema,
} from "./schema/store.schema";

function routes(app: Express) {
  // app.get("/destination", getDestinationsHandler);

  // app.get("/destination/:id", getDestinationByIdHandler);

  // app.post(
  //   "/destination",
  //   validateResource(createDestinationSchema),
  //   createDestinationHandler
  // );

  // app.delete("/destination/:id", deleteDestinationHandler);

  // app.put(
  //   "/destination/:id",
  //   validateResource(updateDestinationSchema),
  //   updateDestinationHandler
  // );

  // app.post(
  //   "/feedback/:destinationId",
  //   validateResource(createFeedbackSchema),
  //   createFeedbackHandler
  // );

  // app.get("/feedback/:destinationId", getFeedbackHandler);

  // app.delete("/feedback/:id", deleteFeedbackHandler);

  // app.get(
  //   "/countries",
  //   (req, res, next) => {
  //     console.log("Countries route hit");
  //     next();
  //   },
  //   getCountriesHandler
  // );

  app.post("/stack", validate(StackSchema), AddToStackHandler);
  app.get("/stack", PopFromStackHandler); // here it doesn't need to validate the request body / query params / path params as it's a GET request

  app.get("/store", GetStoreHandler); // here it doesn't need to validate the request body / query params / path params as it's a GET request
  app.post("/store", validate(StoreSchema), AddToStoreHandler);
  app.patch(
    "/store/key/:key",
    validate(StoreQueryParams),
    validate(UpdateKeySchema),
    UpdateKeyHandler
  );
  app.get("/store/key/:key", validate(StoreQueryParams), GetKeyHandler); // here it doesn't need to validate the request body / query params / path params as it's a GET request
  app.delete("/store/:key", validate(StoreQueryParams), DeleteKeyHandler); // here it doesn't need to validate the request body / query params / path params as it's a GET request
}

export default routes;
