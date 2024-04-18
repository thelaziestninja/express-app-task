import MinHeap from "../structures/MinHeap";
import { StoreElement } from "../types";

export const setTimeoutId = (
  key: string,
  ttl: number,
  storeWithTTL: Map<string, StoreElement>,
  heapWithTTL: MinHeap // Fix: Make MinHeap generic by specifying the type parameter
): NodeJS.Timeout => {
  const timeoutId = setTimeout(() => {
    if (storeWithTTL.has(key)) {
      const item = storeWithTTL.get(key);
      storeWithTTL.delete(key);
      if (item && typeof item.heapIndex === "number") {
        heapWithTTL.removeAt(item.heapIndex);
      }
    }

    console.log(`Expired and removed key from store and heap: ${key}`);
  }, ttl * 1000);
  return timeoutId;
};

//clearTimeout(storeWithTTL.get(key)?.timeoutId);
