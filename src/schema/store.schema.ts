import { number, object, string, TypeOf, z } from "zod";

export const StoreSchema = object({
  body: object({
    key: string({
      required_error: "Key is required.",
    }),
    value: string({
      required_error: "Value is required.",
    }),
    ttl: number().optional(),
  }),
});

export const StoreQueryParams = object({
  params: z.object({
    key: z.string({
      required_error: "Key in path string is required.",
    }),
  }),
});

export type StoreInput = TypeOf<typeof StoreSchema>;

export const UpdateKeySchema = object({
  body: object({
    value: string({
      required_error: "Value is required.",
    }),
    ttl: number().optional(),
  }),
});

export type UpdateKeyInput = TypeOf<typeof UpdateKeySchema>;
