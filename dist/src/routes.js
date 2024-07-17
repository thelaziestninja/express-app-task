"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validate_1 = require("./middleware/validate");
const stack_schema_1 = require("./schema/stack.schema");
const stack_controller_1 = require("./controller/stack.controller");
const store_controller_1 = require("./controller/store.controller");
const store_schema_1 = require("./schema/store.schema");
const cleanup_1 = require("./middleware/cleanup");
function routes(app) {
    app.post("/stack", (0, validate_1.validateRequestData)(stack_schema_1.StackSchema), stack_controller_1.AddToStackHandler);
    app.get("/stack", stack_controller_1.PopFromStackHandler); // here it doesn't need to validate the request body / query params / path params as it's a GET request
    //hiding the dev api
    // if (process.env.NODE_ENV !== "production") {
    //   app.get("/store", GetStoreHandler);
    // }
    app.post("/store", (0, validate_1.validateRequestData)(store_schema_1.StoreSchema), store_controller_1.AddToStoreHandler);
    app.patch("/store/:key", cleanup_1.cleanupKeys, (0, validate_1.validateRequestData)(store_schema_1.StoreParams), store_controller_1.UpdateKeyHandler);
    app.get("/store/:key", cleanup_1.cleanupKeys, store_controller_1.GetKeyHandler); // here it doesn't need to validate the request body / query params / path params as it's a GET request
    app.delete("/store/:key", (0, validate_1.validateRequestData)(store_schema_1.StoreQueryParams), store_controller_1.DeleteKeyHandler); // here it doesn't need to validate the request body / query params / path params as it's a DELETE request
}
exports.default = routes;
