import cors from "cors";
import config from "config";
import express from "express";
import routes from "./src/routes";
import logger from "./src/utils/logger";

const port = config.get<number>("port");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

if (process.env.NODE_ENV !== "test") {
  app.listen(port, async () => {
    logger.info(`App is running at port ${port}!`);
    routes(app);
  });
}
