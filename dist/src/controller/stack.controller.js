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
exports.stack = void 0;
exports.AddToStackHandler = AddToStackHandler;
exports.PopFromStackHandler = PopFromStackHandler;
const logger_1 = __importDefault(require("../utils/logger"));
const request_1 = require("../types/request");
exports.stack = [];
function AddToStackHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            logger_1.default.info("Add item to stack called", req.body.item);
            const { item } = req.body;
            if (exports.stack.length > 10) {
                logger_1.default.info("Stack length is greater than 10, stack overflow error");
                return res
                    .status(request_1.ResponseStatus.BadRequest)
                    .json({ message: "Stack Overflow", stack: exports.stack, stackLength: exports.stack.length });
            }
            logger_1.default.info(`Stack length is ${exports.stack.length}`);
            if (exports.stack.includes(item)) {
                logger_1.default.info(`Item already exists in stack - ${item}`);
                return res.status(request_1.ResponseStatus.BadRequest).json({
                    message: "Item already exists in stack",
                    stack: exports.stack,
                    stackLength: exports.stack.length,
                });
            }
            logger_1.default.info(`Item added to stack - ${item}`);
            exports.stack.push(item);
            return res.status(request_1.ResponseStatus.Success).json({
                message: "Item added to stack",
                stack: exports.stack,
                stackLength: exports.stack.length,
            });
        }
        catch (e) {
            logger_1.default.info("Error adding item to stack", e);
            return res.status(request_1.ResponseStatus.InternalServerError).json({
                message: "Internal server error",
            });
        }
    });
}
function PopFromStackHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (exports.stack.length <= 0) {
                logger_1.default.info("Stack length is less than 0, stack underflow error");
                return res
                    .status(request_1.ResponseStatus.BadRequest)
                    .json({ message: "Stack Underflow", stack: exports.stack, stackLength: exports.stack.length });
            }
            const item = exports.stack.pop();
            logger_1.default.info(`Pop item from stack - ${item}`);
            return res.status(request_1.ResponseStatus.Success).json({
                message: "Item popped from stack",
                item,
                stack: exports.stack,
                stackLength: exports.stack.length,
            });
        }
        catch (e) {
            logger_1.default.info("Error popping item from stack", e);
            return res.status(request_1.ResponseStatus.InternalServerError).json({
                message: "Internal server error",
            });
        }
    });
}
