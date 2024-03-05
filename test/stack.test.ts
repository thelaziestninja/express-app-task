import express from "express";
import request from "supertest";
import { Express } from "express";
import { stack } from "../src/app";
import logger from "../src/utils/logger";
import { createServer, Server } from "http";
import { validate } from "../src/middleware/validate";
import { StackSchema } from "../src/schema/stack.schema";
import {
  AddToStackHandler,
  PopFromStackHandler,
} from "../src/controller/stack.controller";

describe("Stack Operations", () => {
  let app: Express;
  let server: Server;

  beforeAll(async () => {
    app = express();
    server = createServer(app);

    app.use(express.json());

    app.post("/stack", validate(StackSchema), AddToStackHandler);
    app.get("/stack", PopFromStackHandler);

    server.listen(3001, () => {
      logger.info("Server listening on port 3001");
      console.log("Server listening on port 3001");
    });
  });

  afterAll(async () => {
    server.close();
  });

  beforeEach(() => {
    stack.length = 0;
    jest.clearAllMocks();
  });

  it("should add an item to the stack", async () => {
    const itemToAdd = { item: "testItem" };
    const response = await request(app).post("/stack").send(itemToAdd);

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual("Item added to stack");
    expect(response.body.stack).toContain("testItem");
    expect(response.body.stackLength).toBe(1);
  });

  it("should pop an item from the stack", async () => {
    stack.push("testItem");

    const response = await request(app).get("/stack");

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual("Item popped from stack");
    expect(response.body.item).toEqual("testItem");
    expect(response.body.stackLength).toBe(0);
  });
});
