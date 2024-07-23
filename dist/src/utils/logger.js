"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pino_1 = __importDefault(require("pino"));
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
// Set up the log file path
const logDirectory = "/var/log";
const logFilePath = path_1.default.join(logDirectory, "application.log");
const logFile = fs.createWriteStream(logFilePath, { flags: "a" });
// Initialize the logger
const logger = (0, pino_1.default)({
    level: "info", // Adjust this level as needed
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
        },
    },
    base: {
        pid: false,
    },
    timestamp: () => `,"time":"${new Date().toISOString()}"`,
}, logFile);
logger.info("Logger initialized");
exports.default = logger;
