import { NextFunction, Request, Response } from "express";

import response from "../utils/response";
const models = require("../models");

const messages = require("../constants/messages");

const authentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userEmail = req.params.userEmail;
  try {
    if (!userEmail) throw new Error(messages.unauthorisedAccess);

    const userData = await models.Students.findOne({
      where: { email: userEmail },
    });
    if (!userData) throw new Error(messages.unauthorisedAccess);

    req.params.user_id = userData.user_id;

    next();
  } catch (error: any) {
    response(res, 401, error.message || messages.serverError);
  }
};

export default authentication;
