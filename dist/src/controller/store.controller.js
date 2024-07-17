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
exports.minHeapWithoutTTL = exports.minHeapWithTTL = exports.storeWithoutTTL = exports.storeWithTTL = void 0;
exports.AddToStoreHandler = AddToStoreHandler;
exports.GetKeyHandler = GetKeyHandler;
exports.UpdateKeyHandler = UpdateKeyHandler;
exports.DeleteKeyHandler = DeleteKeyHandler;
const request_1 = require("../types/request");
const logger_1 = __importDefault(require("../utils/logger"));
const utils_1 = require("../utils/utils");
const default_1 = require("../../config/default");
const MinHeap_1 = __importDefault(require("../structures/MinHeap"));
exports.storeWithTTL = new Map();
exports.storeWithoutTTL = new Map();
exports.minHeapWithTTL = new MinHeap_1.default();
exports.minHeapWithoutTTL = new MinHeap_1.default();
function AddToStoreHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { key, value, ttl } = req.body;
            if (exports.storeWithTTL.get(key) || exports.storeWithoutTTL.get(key)) {
                logger_1.default.info(`Key already exists in store - ${key}`);
                return res
                    .status(request_1.ResponseStatus.BadRequest)
                    .send({ message: "Key already exists in store" });
            }
            if (exports.storeWithTTL.size + exports.storeWithoutTTL.size >= default_1.maxKeys) {
                // or 200
                logger_1.default.info("Store Overflowed, can't add more keys");
                return res
                    .status(request_1.ResponseStatus.BadRequest)
                    .send({ message: "Store is full" });
            }
            let timeoutId;
            if (ttl) {
                timeoutId = (0, utils_1.setTimeoutId)(key, Number(ttl), exports.storeWithTTL); //minHeapWithTTL
            }
            const data = {
                key,
                value,
                ttl,
                count: 0,
                created_at: new Date(Date.now()),
                timeoutId,
                heapIndex: -1,
            };
            const store = ttl ? exports.storeWithTTL : exports.storeWithoutTTL;
            const heap = ttl ? exports.minHeapWithTTL : exports.minHeapWithoutTTL;
            store.set(key, data);
            heap.add(data);
            console.log("storeWithTTL", exports.storeWithTTL);
            console.log("minheapWithTTL", exports.minHeapWithTTL);
            logger_1.default.info(`Added key-value pair to store - ${key}:${value}`);
            return res.status(request_1.ResponseStatus.Created).send({
                message: "key-value pair added to store",
                key,
                value,
                ttl,
                created_at: data.created_at,
            });
        }
        catch (e) {
            logger_1.default.info("Error adding key-value pair to store", e);
            return res
                .status(request_1.ResponseStatus.InternalServerError)
                .send({ message: "Internal server error" });
        }
    });
}
function GetKeyHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const key = req.params.key;
            const item = (_a = exports.storeWithTTL.get(key)) !== null && _a !== void 0 ? _a : exports.storeWithoutTTL.get(key);
            if (!item) {
                logger_1.default.info(`Key not found in store - ${key}`);
                return res
                    .status(request_1.ResponseStatus.BadRequest)
                    .send({ message: "Key not found in store" });
            }
            item.count = (item.count || 0) + 1;
            console.log("storeWithTTL", exports.storeWithTTL);
            console.log("minheapWithTTL", exports.minHeapWithTTL);
            logger_1.default.info(`Key found in store - ${key}:${item.value}`);
            return res.status(request_1.ResponseStatus.Success).send({
                message: "Key found in store",
                key,
                ttl: item.ttl,
                value: item.value,
                count: item.count,
                created_at: item.created_at,
            });
        }
        catch (e) {
            logger_1.default.info("Error getting key from store", e);
            return res
                .status(request_1.ResponseStatus.InternalServerError)
                .send({ message: "Internal server error" });
        }
    });
}
function UpdateKeyHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const { value } = req.body;
            const key = req.params.key;
            const item = (_a = exports.storeWithTTL.get(key)) !== null && _a !== void 0 ? _a : exports.storeWithoutTTL.get(key);
            if (!item) {
                logger_1.default.info(`Key not found in store - ${key}`);
                return res
                    .status(request_1.ResponseStatus.BadRequest)
                    .send({ message: "Key not found in store" });
            }
            item.value = value;
            item.count = (item.count || 0) + 1;
            console.log("storeWithTTL", exports.storeWithTTL);
            console.log("minheapWithTTL", exports.minHeapWithTTL);
            logger_1.default.info(`Updated key-value pair in store - ${key}:${value}`);
            return res.status(request_1.ResponseStatus.Success).send({
                message: "key-value pair updated in store",
                key,
                value,
                ttl: item.ttl,
                count: item.count,
                created_at: item.created_at,
            });
        }
        catch (e) {
            logger_1.default.info("Error updating key-value pair in store", e);
            return res
                .status(request_1.ResponseStatus.InternalServerError)
                .send({ message: "Internal server error" });
        }
    });
}
function DeleteKeyHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const key = req.params.key;
            const foundItem = (_a = exports.storeWithTTL.get(key)) !== null && _a !== void 0 ? _a : exports.storeWithoutTTL.get(key);
            if (!foundItem) {
                logger_1.default.info("User failed to delete key", key);
                return res.status(request_1.ResponseStatus.NotFound).send({
                    message: "Key not found in store",
                });
            }
            logger_1.default.info("User succesfully deleted key", key);
            const store = foundItem.ttl ? exports.storeWithTTL : exports.storeWithoutTTL;
            const heap = foundItem.ttl ? exports.minHeapWithTTL : exports.minHeapWithoutTTL;
            store.delete(key);
            heap.remove(foundItem);
            console.log("storeWithTTL", exports.storeWithTTL);
            console.log("minheapWithTTL", exports.minHeapWithTTL);
            return res
                .status(request_1.ResponseStatus.Success)
                .send({ message: "key deleted from store", key });
        }
        catch (e) {
            logger_1.default.info("Error deleting key", e);
            return res
                .status(request_1.ResponseStatus.InternalServerError)
                .send({ message: "Internal server error" });
        }
    });
}
