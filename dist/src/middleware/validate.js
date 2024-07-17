"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequestData = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const logger_1 = __importDefault(require("../utils/logger"));
const zod_1 = require("zod");
// higher order function that takes a Zod schema (AnyZodObject) as an argument and returns middleware for Express.
const validateRequestData = (schema) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.default.info("Validating request body or request params");
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        // console.log("Validate before");
        next();
        // console.log("Validate after and passed control to the next middleware");
    }
    catch (e) {
        if (e instanceof zod_1.ZodError) {
            logger_1.default.error(`Zod Error in validation request body middleware: ${e.issues[0].message}`);
            return res.status(400).send({ msg: e.issues[0].message });
        }
        logger_1.default.error(`Error in validation middleware: ${e.message}`);
        return res.status(500).send(e.message);
    }
});
exports.validateRequestData = validateRequestData;
