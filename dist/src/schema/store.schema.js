"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreParams = exports.UpdateKeySchema = exports.StoreQueryParams = exports.StoreSchema = void 0;
const zod_1 = require("zod");
exports.StoreSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        key: (0, zod_1.string)({
            required_error: "Key is required.",
        }),
        value: (0, zod_1.string)({
            required_error: "Value is required.",
        }),
        ttl: (0, zod_1.number)().optional(),
    }),
});
exports.StoreQueryParams = (0, zod_1.object)({
    params: zod_1.z.object({
        key: zod_1.z.string({
            required_error: "Key in path string is required.",
        }),
    }),
});
exports.UpdateKeySchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        value: (0, zod_1.string)({
            required_error: "Value is required.",
        }),
        ttl: (0, zod_1.number)().optional(),
    }),
});
exports.StoreParams = (0, zod_1.object)({
    params: zod_1.z.object({
        key: zod_1.z.string({
            required_error: "Key in path string is required.",
        }),
    }),
    body: (0, zod_1.object)({
        value: (0, zod_1.string)({
            required_error: "Value is required.",
        }),
        ttl: (0, zod_1.number)().optional(),
    }),
});
