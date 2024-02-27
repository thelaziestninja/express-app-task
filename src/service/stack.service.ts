/*
  Services separate the business logic of the application from the controllers and routes,
  promoting modularity and maintainability. Each of the route handlers (createDestinationHandler, getDestinationsHandler, etc.) 
  should delegate the actual business logic to the corresponding service function.
  In this service layer, we can encapsulate operations related to the data mode. 
*/

import { stack } from "../app";
import { Stack } from "../types";
import logger from "../utils/logger";

// import { DestinationM } from "../models/destination.model";
// import {
//   DestinationI,
//   destinationUpdates,
//   DestinationCreation,
//   countries,
// } from "../types";

// export async function findDestinationByName(
//   name: string
// ): Promise<DestinationI | null> {
//   try {
//     return await DestinationM.findOne({ name });
//   } catch (e: any) {
//     throw new Error(e);
//   }
// }

// export async function addToStack(item: AddToStackInput): Promise<Stack> {
//   try {
//     if (stack.length < 10) {
//       if (stack.includes(item.body.item)) {
//         logger.info(`Item already exists in stack - ${item.body.item}`);
//         return stack; // Fix: Return the stack as is
//       }

//       logger.info(`Item added to stack - ${item.body.item}`);
//       stack.push(item.body.item);
//       return stack; // Fix: Wrap stack inside an array
//     }
//     return stack || undefined; // Fix: Add a return statement with a return type of 'undefined'
//   } catch (e: any) {
//     throw new Error(e);
//   }
// }

// export async function AddToStackHandler(
//   req: Request<AddToStackInput["body"]>,
//   res: Response
// ) {
//   logger.info("Add item to stack", req.body.item);
//   const item = req.body.item;
//   if (stack.length < 10) {
//     logger.info(`Stack length is ${stack.length}`);
//     if (stack.includes(item)) {
//       logger.info(`Item already exists in stack - ${item}`);
//       return res.status(400).json({ message: "Item already exists in stack" });
//     }
//     logger.info(`Item added to stack - ${item}`);
//     return res
//       .status(200)
//       .json({ message: "Item added to stack", stack: stack.push(item) });
//   }
//   logger.error("Stack length is greater than 10, stack overflow error");
//   return res.status(400).json({ message: "Stack Overflow" });
// }

// export async function createDestination(
//   input: DestinationCreation
// ): Promise<DestinationI> {
//   try {
//     return await DestinationM.create(input);
//   } catch (e: any) {
//     throw new Error(e);
//   }
// }

// export async function getDestinations(): Promise<DestinationI[]> {
//   try {
//     return await DestinationM.find().exec();
//   } catch (e: any) {
//     throw new Error(e);
//   }
// }

// export async function getCountries(): Promise<countries[]> {
//   try {
//     return await DestinationM.distinct("country").exec();
//   } catch (e: any) {
//     throw new Error(e);
//   }
// }

// export async function getDestinationById(
//   id: string
// ): Promise<DestinationI | null> {
//   try {
//     return await DestinationM.findById(id);
//   } catch (e: any) {
//     throw new Error(e);
//   }
// }

// // export interface Credentials {
// //   name: string;
// //   email: string;
// //   password: string;
// // }

// // type LoginUser = Pick<Credentials, 'email' | 'password'>;
// // type ResetPassword = Pick<Credentials, 'email'>;

// export async function updateDestination(
//   id: string,
//   updates: destinationUpdates // I used Picker
// ): Promise<DestinationI | null> {
//   try {
//     const updatedDestination = await DestinationM.findByIdAndUpdate(
//       id,
//       updates,
//       { new: true } // Return the updated document
//     );

//     return updatedDestination;
//   } catch (e: any) {
//     throw new Error(e);
//   }
// }

// export async function deleteDestination(
//   id: string
// ): Promise<DestinationI | null> {
//   try {
//     return await DestinationM.findByIdAndDelete(id);
//   } catch (e: any) {
//     throw new Error(e);
//   }
// }
