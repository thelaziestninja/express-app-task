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

// describe("Feedback Routes", () => {
//   let app: Express;
//   let server: Server;

//   beforeAll(async () => {
//     // Initialize your Express app and database connection here
//     app = express();
//     server = createServer(app);

//     // Start your Express server
//     server.listen(3001, () => {
//       console.log("Server listening on port 3001");
//     });

//     // Set up any necessary configurations or middleware
//     app.use(express.json());

//     // Define your routes
//     app.post("/feedback/:destinationId", createFeedbackHandler);
//     app.get("/feedback/:destinationId", getFeedbackHandler);
//     app.delete("/feedback/:id", deleteFeedbackHandler);

//     // Clear mock function calls before each test
//     jest.clearAllMocks();

//     // Mock your database functions
//     FeedbackM.create = jest.fn();
//     FeedbackM.find = jest.fn();
//     FeedbackM.findById = jest.fn();
//     FeedbackM.findByIdAndDelete = jest.fn();
//   });

//   afterAll(async () => {
//     // Close your server after all tests are done
//     server.close(() => {
//       console.log("Server closed successfully");
//     });

//     // Disconnect from the database
//     await mongoose.disconnect();
//   });

//   it("should create feedback for a destination", async () => {
//     const destinationId = new mongoose.Types.ObjectId();
//     const newFeedback = {
//       destination_id: destinationId,
//       feedback_text: "Great place!",
//       left_by: "User123",
//     };

//     console.log("Before FeedbackM.create");

//     // Mock the behavior of your Mongoose model function
//     (FeedbackM.create as jest.Mock).mockResolvedValueOnce(newFeedback);

//     const res = await request(app)
//       .post(`/feedback/${destinationId}`)
//       .send(newFeedback);

//     console.log("After request");

//     expect(res.status).toBe(201);
//     expect(res.body).toEqual(newFeedback);
//   }, 30000);
// });

// it("should get the store", async () => {
//     const response = await request(app).get("/store");
//     expect(response.status).toBe(200);
//     expect(response.body.message).toEqual("Store retrieved");
//     expect(response.body.store).toEqual({});
//   });

//     it("should add an item to the store", async () => {
//         const itemToAdd = { key: "testKey", value: "testValue" };
//         const response = await request(app)
//         .post("/store")
//         .send(itemToAdd);

//         expect(response.status).toBe(200);
//         expect(response.body.message).toEqual("Item added to store");
//         expect(response.body.store).toEqual({ testKey: "testValue" });
//     });
