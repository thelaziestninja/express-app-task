import { stack } from "../app";
import logger from "../utils/logger";
import { StackInput } from "../schema/stack.schema";
import {
  Request,
  Response,
  StackResponse,
  EmptyRequest,
} from "../types/request";

export async function AddToStackHandler(
  req: Request<StackInput["body"]>,
  res: Response<StackResponse>
) {
  try {
    logger.info("Add item to stack", req.body.item);
    const { item } = req.body;
    if (stack.length < 10) {
      logger.info(`Stack length is ${stack.length}`);
      if (stack.includes(item)) {
        logger.info(`Item already exists in stack - ${item}`);
        return res.status(400).json({
          message: "Item already exists in stack",
          stack,
          stackLength: stack.length,
        });
      }
      logger.info(`Item added to stack - ${item}`);
      stack.push(item);
      return res.status(200).json({
        message: "Item added to stack",
        stack: stack,
        stackLength: stack.length,
      });
    }

    logger.error("Stack length is greater than 10, stack overflow error");
    return res
      .status(400)
      .json({ message: "Stack Overflow", stack, stackLength: stack.length });
  } catch (e: any) {
    logger.error("Error adding item to stack", e);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function PopFromStackHandler(
  req: Request<EmptyRequest>,
  res: Response<StackResponse>
) {
  try {
    if (stack.length > 0) {
      const item = stack.pop();
      logger.info(`Pop item from stack - ${item}`);
      return res.status(200).json({
        message: "Item popped from stack",
        item,
        stack,
        stackLength: stack.length,
      });
    }
    logger.error("Stack length is 0, stack underflow error");
    return res
      .status(400)
      .json({ message: "Stack Underflow", stack, stackLength: stack.length });
  } catch (e: any) {
    logger.error("Error popping item from stack", e);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

// export async function createDestinationHandler(
//   req: Request<{}, {}, createDestinationInput["body"]>,
//   res: Response
// ) {
//   try {
//     const { name } = req.body;
//     const existingDestination = await findDestinationByName(name);
//     if (existingDestination) {
//       res.status(400).send("A destination with that name already exists");
//     } else {
//       const newDestination = await createDestination(req.body as DestinationI); // from destination.service
//       res.status(201).json(newDestination);
//     }
//   } catch (e: any) {
//     logger.error(e);
//     res.status(409).send(e);
//   }
// }

// export async function getCountriesHandler(
//   req: Request,
//   res: Response<countries[] | { error: string }>
// ) {
//   try {
//     const countries = await getCountries();
//     res.status(200).json(countries);
//   } catch (e: any) {
//     logger.error(e);
//     res.status(409).send(e.message);
//   }
// }

// export async function getDestinationsHandler(
//   req: Request,
//   res: Response<DestinationI[] | { error: string }>
// ) {
//   try {
//     const destinations = await getDestinations(); // from destination.service
//     if (!destinations || destinations.length === 0) {
//       return res.status(404).send({ error: "No destinations found!" });
//     }

//     res.status(200).json(destinations);
//   } catch (e: any) {
//     logger.error(e);
//     res.status(409).send(e.message);
//   }
// }

// export async function getDestinationByIdHandler(
//   req: Request<{ id: string }>,
//   res: Response
// ) {
//   try {
//     const destinationId = req.params.id;
//     const destination = await getDestinationById(destinationId); // from destination.service

//     if (!destination) {
//       return res.status(404).send({ error: "Destination not existing!" });
//     }

//     res.status(200).json(destination);
//   } catch (e: any) {
//     logger.error(e);
//     res.status(409).send(e.message);
//   }
// }

// export async function updateDestinationHandler(
//   req: Request<{ id: string }, {}, updateDestinationInput["body"]>,
//   res: Response
// ) {
//   const { id } = req.params;
//   // const { name, description, image_url, country, best_time_to_visit } = req.body; -> not needed after I added updateDestination

//   try {
//     const destination = await updateDestination(id, req.body as DestinationI); //from destination.service

//     if (!destination) {
//       return res.status(404).json({ error: "Destination not found!" });
//     }

//     res.status(200).json(destination);
//   } catch (e: any) {
//     logger.error("Error updating destination:", e);
//     res.status(500).json(e);
//   }
// }

// export async function deleteDestinationHandler(
//   req: Request<{ id: string }>,
//   res: Response
// ) {
//   try {
//     const destinationId = req.params.id;
//     const destination = await deleteDestination(destinationId); //from destination.service

//     if (!destination) {
//       return res.status(404).json({ error: "Destination not existing!" });
//     }

//     res.status(200).json({
//       message: `${destination.name} with ID: ${destination._id} has been deleted.`,
//     });
//   } catch (e: any) {
//     logger.error("Error deleting destination by ID:", e);
//     res.status(500).send(e);
//   }
// }
