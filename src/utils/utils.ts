import { StoreElement } from "../types";

export const setTimeoutId = (
  key: string,
  ttl: number,
  storeWithTTL: Map<string, StoreElement>
): NodeJS.Timeout => {
  const timeoutId = setTimeout(() => {
    storeWithTTL.delete(key);
    // heapWithTTL.remove();
    console.log(`Expired and removed key from store and heap: ${key}`);
  }, ttl * 1000);
  return timeoutId;
};

//clearTimeout(storeWithTTL.get(key)?.timeoutId);
