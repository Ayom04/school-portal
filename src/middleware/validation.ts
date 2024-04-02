const Joi = require("joi");
import { Request, Response, NextFunction } from "express";
import response from "../utils/response";

const validationMiddleware = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    const valid = error == null;

    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details.map((i: any) => i.message).join(",");
      return next(response(res, 400, message));
    }
  };
};

export default validationMiddleware;
