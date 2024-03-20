export type Stack = string[];

export type Store = {
  [key: string]: {
    value: string;
    ttl?: number;
    count?: number;
    created_at: Date;
    timeoutId?: NodeJS.Timeout;
  };
};
