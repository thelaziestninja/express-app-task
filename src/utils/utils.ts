import { StoreValue } from "../types";

export const setTimeoutId = (
  key: string,
  ttl: number,
  storeWithTTL: Map<string, StoreValue>
): NodeJS.Timeout => {
  const timeoutId = setTimeout(() => {
    storeWithTTL.delete(key);
  }, ttl * 1000);
  return timeoutId;
};

//clearTimeout(storeWithTTL.get(key)?.timeoutId);
