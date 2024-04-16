import MinHeap from "../structures/MinHeap";
import { HeapElement, StoreValue } from "../types";

export const setTimeoutId = (
  key: string,
  ttl: number,
  storeWithTTL: Map<string, StoreValue>,
  heapWithTTL: MinHeap<HeapElement>
): NodeJS.Timeout => {
  const timeoutId = setTimeout(() => {
    storeWithTTL.delete(key);
    heapWithTTL.pop(key);
    console.log(`Expired and removed key from store and heap: ${key}`);
  }, ttl * 1000);
  return timeoutId;
};

//clearTimeout(storeWithTTL.get(key)?.timeoutId);
