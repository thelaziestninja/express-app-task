import cors from "cors";
import config from "config";
import express from "express";
import routes from "./routes";
import logger from "./utils/logger";
import { Stack, Store } from "./types";
import { cleanupKeys } from "./middleware/cleanup";

const port = config.get<number>("port");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

export const stack: Stack = [];

export const store: Store = {};

if (process.env.NODE_ENV !== "test") {
  app.listen(port, async () => {
    logger.info(`App is running at port ${port}!`);
    routes(app);
  });
}
