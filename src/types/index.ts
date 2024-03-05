export type Stack = string[];

export type Store = {
  [key: string]: { value: string; ttl?: number; count?: number };
};

/* Objects in JSON are collections of key:value pairs, where the values in these pairs can be again any JSON Document. 
JSON schemas that specify objects are called Object Schemas. The document {"type": "object"} */

// export interface DestinationI extends Document {
//   _id: string;
//   name: string;
//   description: string;
//   image_url?: string[];
//   country: string;
//   best_time_to_visit: string;
// }

// export type destinationUpdates = Pick<
//   DestinationI,
//   "name" | "description" | "image_url" | "country" | "best_time_to_visit"
// >;

// export type countries = string[];

// export type DestinationCreation = Pick<
//   DestinationI,
//   "name" | "description" | "image_url" | "country" | "best_time_to_visit"
// >;
