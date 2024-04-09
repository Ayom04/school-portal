import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import messages from "../constants/messages";
import response from "../utils/response";
const models = require("../models");

const registerStudent = async (req: Request, res: Response) => {
  const {
    surname,
    othernames,
    email,
    phone,
    gender,
    dob,
    photo_url,
  }: {
    surname: string;
    othernames: string;
    email: string;
    phone: string;
    gender: string;
    dob: string;
    photo_url?: string;
  } = req.body;
  try {
    const checkIfStudentExists = await models.Registrations.findOne({
      where: {
        email,
      },
    });
    if (checkIfStudentExists) throw new Error(messages.pendindAdmission);

    await models.Registrations.create({
      registration_id: uuidv4(),
      email,
      surname,
      othernames,
      phone,
      gender,
      date_of_birth: dob,
      photo_url: photo_url
        ? photo_url
        : `https://api.dicebear.com/7.x/micah/svg?seed=${email}`,
    });
    return response(res, 201, messages.Registration);
  } catch (error: any) {
    return response(res, 400, error.message);
  }
};

const getRegisteredStudents = async (req: Request, res: Response) => {
  const { admin_id } = req.params;
  try {
    if (!admin_id) throw new Error(messages.unauthorizedPermission);

    const students = await models.Registrations.findAll();
    if (!students) throw new Error(messages.notFound);

    return response(res, 200, messages.getRgisteredStudentMessage, students);
  } catch (error: any) {
    return response(res, 400, error.message);
  }
};

const deletePendingRegistrations = async (req: Request, res: Response) => {
  const { admin_id } = req.params;
  try {
    if (!admin_id) throw new Error(messages.unauthorisedAccess);

    const students = await models.Registrations.findAll();
    if (!students) throw new Error(messages.notFound);

    await models.Registrations.destroy({
      where: { admission_status: "pending" },
    });

    return response(res, 200, messages.deletePendingAdmissionsMessage);
  } catch (error: any) {
    return response(res, 400, error.message);
  }
};

export { deletePendingRegistrations, getRegisteredStudents, registerStudent };
