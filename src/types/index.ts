export type Stack = string[];

export type Store = {
  [key: string]: {
    value: string;
    ttl?: number;
    count?: number;
    created_at: Date;
    timeoutId?: NodeJS.Timeout; // Type safety for timeoutId, setTimeout returns NodeJS.Timeout
  };
};

export type StoreValue = {
  value: string;
  ttl?: number;
  count?: number;
  created_at: Date;
  timeoutId?: NodeJS.Timeout; // Type safety for timeoutId, setTimeout returns NodeJS.Timeout
};

export type HeapElement = {
  key: string;
  createdAt: number;
  count: number;
  size: number;
};
