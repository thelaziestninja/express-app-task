import express from "express";
import request from "supertest";
import { Express } from "express";
import { store } from "../src/app";
import { createServer, Server } from "http";
import { validate } from "../src/middleware/validate";
import {
  AddToStoreHandler,
  DeleteKeyHandler,
  GetKeyHandler,
  GetStoreHandler,
} from "../src/controller/store.controller";
import { StoreQueryParams, StoreSchema } from "../src/schema/store.schema";

describe("Store Operations", () => {
  let app: Express;
  let server: Server;

  beforeAll((done) => {
    app = express();
    server = createServer(app);

    app.use(express.json());

    app.get("/store", GetStoreHandler);
    app.post("/store", validate(StoreSchema), AddToStoreHandler);
    app.get("/store/key/:key", validate(StoreQueryParams), GetKeyHandler);
    app.delete("/store/:key", validate(StoreQueryParams), DeleteKeyHandler);

    server = createServer(app).listen(0, () => {
      const address = server.address();
      const port = typeof address === "string" ? address : address?.port;
      console.log(`Test server listening on port ${port}`);
      done();
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
    expect(response.body.value).toEqual("testValue");
  });

  it("should delete a key from the store", async () => {
    store.testKey = "testValue";

    const response = await request(app).delete("/store/testKey");

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual("key deleted from store");
    expect(response.body.store).toEqual({});
  });
});
