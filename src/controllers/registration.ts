import { v4 as uuidv4 } from "uuid";
import { NextFunction, Request, Response } from "express";
import response from "../utils/response";
const models = require("../models");
import messages from "../constants/messages";
import { where } from "sequelize";

const registerStudent = async (req: Request, res: Response) => {
  const { firstName, lastName, email, phone, gender, dob } = req.body;
  try {
    const checkIfStudentExists = await models.Registration.findOne({
      where: {
        email,
      },
    });
    if (checkIfStudentExists) throw new Error(messages.userExists);

    await models.Registration.create({
      registration_id: uuidv4(),
      email,
      firstName,
      lastName,
      phone,
      gender,
      dob,
    });
    return response(res, 201, messages.Registration);
  } catch (error: any) {
    return response(res, 400, error.message);
  }
};

const updateRegistrationStatus = async (req: Request, res: Response) => {
  const { studentEmail, admin_id, admission_status } = req.params;
  try {
    if (!admin_id) throw new Error(messages.unauthorizedPermission);
    if (!studentEmail) throw new Error(messages.unauthorisedAccess);

    const student = await models.Registration.findOne({
      where: {
        email: studentEmail,
      },
    });
    if (!student) throw new Error(messages.notFound);

    await models.Registration.update(
      { admission_status },
      { where: { registration_id: student.registration_id } }
    );
    return response(res, 200, messages.updateStudent);
  } catch (error: any) {
    return response(res, 400, error.message);
  }
};

export { registerStudent, updateRegistrationStatus };
