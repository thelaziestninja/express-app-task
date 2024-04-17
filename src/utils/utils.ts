import MinHeap from "../structures/MinHeap";
import { StoreElement } from "../types";

export const setTimeoutId = (
  key: string,
  ttl: number,
  storeWithTTL: Map<string, StoreElement>,
  heapWithTTL: MinHeap // Fix: Make MinHeap generic by specifying the type parameter
): NodeJS.Timeout => {
  const timeoutId = setTimeout(() => {
    storeWithTTL.delete(key);
    heapWithTTL.remove(key);
    console.log(`Expired and removed key from store and heap: ${key}`);
  }, ttl * 1000);
  return timeoutId;
};

//clearTimeout(storeWithTTL.get(key)?.timeoutId);
