import logger from "../utils/logger";
import { AnyZodObject, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

// higher order function that takes a Zod schema (AnyZodObject) as an argument and returns middleware for Express.

export const validateRequestData =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info("Validating request body or request params");
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      // console.log("Validate before");
      next();
      // console.log("Validate after and passed control to the next middleware");
    } catch (e: any) {
      if (e instanceof ZodError) {
        logger.error(
          `Zod Error in validation request body middleware: ${e.issues[0].message}`
        );
        return res.status(400).send({ msg: e.issues[0].message });
      }

      logger.error(`Error in validation middleware: ${e.message}`);
      return res.status(500).send(e.message);
    }
  };
