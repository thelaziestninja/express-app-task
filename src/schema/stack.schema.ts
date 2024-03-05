import { object, string, TypeOf } from "zod";

export const StackSchema = object({
  body: object({
    item: string({
      required_error: "Item is required.",
    }),
  }),
});

export type StackInput = TypeOf<typeof StackSchema>;
