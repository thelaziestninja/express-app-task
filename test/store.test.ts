import express from "express";
import request from "supertest";
import { Express } from "express";
import logger from "../src/utils/logger";
import { createServer, Server } from "http";
import { validateRequestData } from "../src/middleware/validate";
import { store } from "../src/controller/store.controller";
import {
  AddToStoreHandler,
  DeleteKeyHandler,
  GetKeyHandler,
  GetStoreHandler,
  UpdateKeyHandler,
} from "../src/controller/store.controller";
import {
  StoreParams,
  StoreSchema,
  StoreQueryParams,
} from "../src/schema/store.schema";
import { cleanupKeys } from "../src/middleware/cleanup";

describe("Store Operations", () => {
  let app: Express;
  let server: Server;

  beforeAll(async () => {
    app = express();
    server = createServer(app);

    app.use(express.json());

    if (process.env.NODE_ENV !== "production") {
      app.get("/store", GetStoreHandler);
    }

    app.post("/store", validateRequestData(StoreSchema), AddToStoreHandler);

    app.patch(
      "/store/:key",
      cleanupKeys,
      validateRequestData(StoreParams),
      UpdateKeyHandler
    );
    app.get("/store/:key", cleanupKeys, GetKeyHandler);

    app.delete(
      "/store/:key",
      validateRequestData(StoreQueryParams),
      DeleteKeyHandler
    );

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

  it("should get the store", async () => {
    const itemToAdd = { key: "testKey", value: "testValue" };
    const firstResponse = await request(app).post("/store").send(itemToAdd);

    expect(firstResponse.status).toBe(201);
    expect(firstResponse.body.message).toEqual("key-value pair added to store");
    expect(firstResponse.body.store).toEqual({
      testKey: { value: "testValue", created_at: expect.any(String) },
    });

    store.testKey = { value: "testValue", created_at: new Date(), count: 1 };

    const response = await request(app).get("/store");

    expect(response.status).toBe(200);
    expect(response.body.store).toEqual({
      testKey: { value: "testValue", created_at: expect.any(String), count: 1 },
    });
  });

  it("should add an item to the store", async () => {
    const itemToAdd = { key: "testKey", value: "testValue" };
    const response = await request(app).post("/store").send(itemToAdd);

    expect(response.status).toBe(201);
    expect(response.body.message).toEqual("key-value pair added to store");
    expect(response.body.store).toEqual({
      testKey: { value: "testValue", created_at: expect.any(String) },
    });
  });

  it("should get a key from the store", async () => {
    const itemToAdd = { key: "testKey", value: "testValue" };
    const firstResponse = await request(app).post("/store").send(itemToAdd);

    expect(firstResponse.status).toBe(201);
    expect(firstResponse.body.message).toEqual("key-value pair added to store");
    expect(firstResponse.body.store).toEqual({
      testKey: { value: "testValue", created_at: expect.any(String) },
    });

    store.testKey = {
      value: "testValue",
      created_at: new Date(),
      count: 1,
    };

    const response = await request(app).get("/store/testKey");

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual("Key found in store");
    expect(response.body.key).toEqual("testKey");
    expect(response.body.value).toEqual("testValue");
    expect(response.body.count).toEqual(2);
    expect(response.body.created_at).toEqual(expect.any(String));
  });

  it("should update a key in the store", async () => {
    const itemToAdd = { key: "testKey", value: "testValue" };
    const firstResponse = await request(app).post("/store").send(itemToAdd);

    expect(firstResponse.status).toBe(201);
    expect(firstResponse.body.message).toEqual("key-value pair added to store");
    expect(firstResponse.body.store).toEqual({
      testKey: { value: "testValue", created_at: expect.any(String) },
    });

    store.testKey = { value: "testValue", created_at: new Date(), count: 1 };

    const response = await request(app)
      .patch("/store/testKey")
      .send({ value: "updatedValue" });

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual("key-value pair updated in store");
    expect(response.body.store).toEqual({
      testKey: {
        value: "updatedValue",
        created_at: expect.any(String),
        count: 2,
      },
    });
  });

  it("should delete a key from the store", async () => {
    store.testKey = { value: "testValue", created_at: new Date() };

    const response = await request(app).delete("/store/testKey");

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual("key deleted from store");
    expect(response.body.store).toEqual({});
  });
});
