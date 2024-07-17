"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StackSchema = void 0;
const zod_1 = require("zod");
exports.StackSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        item: (0, zod_1.string)({
            required_error: "Item is required.",
        }),
    }),
});
