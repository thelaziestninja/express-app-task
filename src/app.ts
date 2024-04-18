import cors from "cors";
import config from "config";
import express from "express";
import logger from "./utils/logger";
import stackRoutes from "./routes/stack";
import storeRoutes from "./routes/store";

const port = config.get<number>("port");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.use("/stack", stackRoutes);
app.use("/store", storeRoutes);

if (process.env.NODE_ENV !== "test") {
  app.listen(port, async () => {
    logger.info(`App is running at port ${port}!`);
  });
}
