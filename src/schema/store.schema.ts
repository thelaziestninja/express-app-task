import { number, object, string, TypeOf, z } from "zod";

export type Store = { [key: string]: string };

export const store: Store = {};

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

// export const createFeedbackSchema = object({
//   body: object({
//     feedback_text: string({
//       required_error: 'Feedback text is required.',
//     }),
//     left_by: string({
//       required_error: 'Name of the person leaving feedback is required.',
//     }),
//   }),
// });

// export type createFeedbackInput = TypeOf<typeof createFeedbackSchema>;
