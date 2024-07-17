"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTimeoutId = void 0;
const setTimeoutId = (key, ttl, storeWithTTL) => {
    const timeoutId = setTimeout(() => {
        storeWithTTL.delete(key);
        // heapWithTTL.remove();
        console.log(`Expired and removed key from store and heap: ${key}`);
    }, ttl * 1000);
    return timeoutId;
};
exports.setTimeoutId = setTimeoutId;
//clearTimeout(storeWithTTL.get(key)?.timeoutId);
