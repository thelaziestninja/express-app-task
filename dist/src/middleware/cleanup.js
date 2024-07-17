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
exports.cleanupKeys = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const zod_1 = require("zod");
const logger_1 = __importDefault(require("../utils/logger"));
const default_1 = require("../../config/default");
const store_controller_1 = require("../controller/store.controller");
const cleanupHeapWithTTL = () => __awaiter(void 0, void 0, void 0, function* () {
    let totalKeys = store_controller_1.storeWithTTL.size + store_controller_1.storeWithoutTTL.size;
    const deletionThreshold = default_1.maxKeys * default_1.threshold;
    while (totalKeys > deletionThreshold) {
        const removedElement = store_controller_1.minHeapWithTTL.pop();
        if (removedElement) {
            const { key } = removedElement;
            if (store_controller_1.storeWithTTL.has(key)) {
                store_controller_1.storeWithTTL.delete(key);
            }
            totalKeys = store_controller_1.storeWithoutTTL.size + store_controller_1.storeWithTTL.size;
        }
        else {
            break;
        }
    }
});
// const cleanupHeapWithoutTTL = async () => {
//   let totalKeys = storeWithTTL.size + storeWithoutTTL.size;
//   const deletionThreshold = maxKeys * threshold;
//   while (totalKeys > deletionThreshold) {
//     const removedElement = minHeapWithoutTTL.pop();
//     if (removedElement) {
//       const { key } = removedElement;
//       if (storeWithoutTTL.has(key)) {
//         storeWithoutTTL.delete(key);
//       }
//       totalKeys = storeWithoutTTL.size + storeWithTTL.size;
//     } else {
//       break;
//     }
//   }
// };
const cleanupKeys = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalKeys = store_controller_1.storeWithTTL.size + store_controller_1.storeWithoutTTL.size;
        const deletionThreshold = default_1.maxKeys * default_1.threshold;
        if (totalKeys <= deletionThreshold) {
            logger_1.default.info("Total keys are within the threshold. No cleanup needed.");
            return next();
        }
        // await cleanupHeapWithoutTTL();
        if (totalKeys > deletionThreshold) {
            logger_1.default.info("Started checking for keys with TTL to delete in store");
            yield cleanupHeapWithTTL();
            console.log("storeWithTTL", store_controller_1.storeWithTTL.size);
        }
        next();
    }
    catch (e) {
        if (e instanceof zod_1.ZodError) {
            logger_1.default.info(`Zod Error in validation request body middleware: ${e.issues[0].message}`);
            return res.status(400).send({ msg: e.issues[0].message });
        }
        logger_1.default.info(`Error in cleanupKeys middleware: ${e.message}`);
        return res.status(500).send(e.message);
    }
});
exports.cleanupKeys = cleanupKeys;
