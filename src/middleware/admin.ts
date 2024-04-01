const authentication = require("./authentication");
import { NextFunction, Request, Response } from "express";
import messages from "../constants/messages";
import response from "../utils/response";
const models = require("../models");

const checkAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const { userEmail } = req.params;
  try {
    const data = await models.Admins.findOne({
      where: { email: userEmail },
    });
    if (!data) throw new Error(messages.unauthorisedAccess);
    req.params.admin_id = data.admin_id;
    next();
  } catch (error: any) {
    return response(res, 401, error.message || messages.serverError);
  }
};

export default checkAdmin;
