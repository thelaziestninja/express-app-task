"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NODE_ENV = exports.threshold = exports.maxKeys = exports.port = void 0;
exports.port = 3000 || process.env.PORT;
exports.maxKeys = 5 || process.env.MAX_KEYS;
exports.threshold = 0.8 || process.env.THRESHOLD;
exports.NODE_ENV = "production" || process.env.NODE_ENV;