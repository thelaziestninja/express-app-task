import express from "express";
import request from "supertest";
import { Express } from "express";
import { store } from "../src/app";
import logger from "../src/utils/logger";
import { createServer, Server } from "http";
import { validate } from "../src/middleware/validate";
import {
  AddToStoreHandler,
  DeleteKeyHandler,
  GetKeyHandler,
  GetStoreHandler,
  UpdateKeyHandler,
} from "../src/controller/store.controller";
import {
  StoreQueryParams,
  StoreSchema,
  UpdateKeySchema,
} from "../src/schema/store.schema";

describe("Store Operations", () => {
  let app: Express;
  let server: Server;

  beforeAll(async () => {
    app = express();
    server = createServer(app);

    app.use(express.json());

    app.get("/store", GetStoreHandler);
    app.post("/store", validate(StoreSchema), AddToStoreHandler);
    app.get("/store/key/:key", validate(StoreQueryParams), GetKeyHandler);
    app.patch(
      "/store/key/:key",
      validate(StoreQueryParams),
      validate(UpdateKeySchema),
      UpdateKeyHandler
    );
    app.delete("/store/:key", validate(StoreQueryParams), DeleteKeyHandler);

    server.listen(3002, () => {
      logger.info("Server listening on port 3002");
      console.log("Server listening on port 3002");
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  beforeEach(() => {
    Object.keys(store).forEach((key) => delete store[key]);
    jest.clearAllMocks();
  });

  it("should add an item to the store", async () => {
    const itemToAdd = { key: "testKey", value: "testValue" };
    const response = await request(app).post("/store").send(itemToAdd);

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual("key-value pair added to store");
    expect(response.body.store).toEqual({ testKey: "testValue" });
  });

  it("should get the store", async () => {
    store.testKey = "testValue";

    const response = await request(app).get("/store");

    expect(response.status).toBe(200);
    expect(response.body.store).toEqual({ testKey: "testValue" });
  });

  it("should get a key from the store", async () => {
    store.testKey = "testValue";

    const response = await request(app).get("/store/key/testKey");

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual("Key found in store");
    expect(response.body.key).toEqual("testKey");
    expect(response.body.value).toEqual("testValue");
  });

  it("should update a key in the store", async () => {
    store.testKey = "testValue";

    const response = await request(app)
      .patch("/store/key/testKey")
      .send({ value: "updatedValue" });

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual("key-value pair updated in store");
    expect(response.body.store).toEqual({ testKey: "updatedValue" });
  });

  it("should delete a key from the store", async () => {
    store.testKey = "testValue";

    const response = await request(app).delete("/store/testKey");

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual("key deleted from store");
    expect(response.body.store).toEqual({});
  });
});
