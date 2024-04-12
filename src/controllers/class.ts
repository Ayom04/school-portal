const models = require("../models");
import messages from "../constants/messages";
import { Request, Response } from "express";
import response from "../utils/response";
import { v4 as uuidv4 } from "uuid";
import { studentClassEnum } from "../constants/enum";
import { where } from "sequelize";

const createClass = async (req: Request, res: Response) => {
  const { admin_id } = req.params;
  const { class_name } = req.body;
  try {
    if (!admin_id) throw new Error(messages.unauthorizedPermission);

    const checkIfClassExists = await models.Classes.findOne({
      where: { class_name },
    });
    if (checkIfClassExists) throw new Error(messages.classExists);

    await models.Classes.create({
      class_id: uuidv4(),
      class_name: studentClassEnum[class_name as keyof typeof studentClassEnum],
    });
    return response(res, 201, messages.classCreated);
  } catch (error: any) {
    return response(res, 400, error.message);
  }
};

export { createClass };
