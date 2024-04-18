export type Stack = string[];

export type StoreElement = {
  key: string;
  value: string;
  ttl?: number;
  count: number;
  created_at: Date;
  timeoutId?: NodeJS.Timeout; // Type safety for timeoutId, setTimeout returns NodeJS.Timeout
  heapIndex: number;
};
