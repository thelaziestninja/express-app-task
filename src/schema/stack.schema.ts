import { object, string, array, TypeOf } from "zod";

export const StackSchema = object({
  body: object({
    item: string({
      required_error: "Item is required.",
    }),
  }),
});

export type StackInput = TypeOf<typeof StackSchema>;

// export const createDestinationSchema = object({
//   body: object({
//     name: string({
//       required_error: "Name is required.",
//     }),
//     description: string({
//       required_error: "Description is required.",
//     }),
//     image_url: array(string()),
//     country: string({
//       required_error: "Country is required.",
//     }),
//     best_time_to_visit: string({
//       required_error: "Best time to visit is required.",
//     }),
//   }),
// });

// export type createDestinationInput = TypeOf<typeof createDestinationSchema>;

// export const updateDestinationSchema = object({
//   body: object({
//     name: string().optional(),
//     description: string().optional(),
//     image_url: array(string()).optional(),
//     country: string().optional(),
//     best_time_to_visit: string().optional(),
//   }),
// });

// export type updateDestinationInput = TypeOf<typeof updateDestinationSchema>;
