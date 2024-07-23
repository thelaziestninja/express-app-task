import pino from "pino";
import * as fs from "fs";
import path from "path";

// Set up the log file path
const logDirectory = "/var/log"; // Use /var/log as configured in docker-compose
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

const logFilePath = path.join(logDirectory, "application.log");
const logFile = fs.createWriteStream(logFilePath, { flags: "a" });

// Initialize the logger
const logger = pino(
  {
    level: "info", // Adjust this level as needed
  },
  logFile
);

logger.info("Logger initialized");

export default logger;
