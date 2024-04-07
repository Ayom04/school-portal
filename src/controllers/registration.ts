import { v4 as uuidv4 } from "uuid";
import { NextFunction, Request, Response } from "express";
import response from "../utils/response";
const models = require("../models");
import messages from "../constants/messages";
import {  deleteRegistration } from "../utils/index";
import { sendHtmlEmail } from "../services/email";

const registerStudent = async (req: Request, res: Response) => {
  const { firstName, lastName, email, phone, gender, dob, photo_url } : {firstName:string, lastName:string, email:string, phone:string, gender:string, dob:string, photo_url?:string} =
    req.body;
  try {
    const checkIfStudentExists = await models.Registration.findOne({
      where: {
        email,
      },
    });
    if (checkIfStudentExists) throw new Error(messages.userExists);

    const profilePicture = `https://api.dicebear.com/7.x/micah/svg?seed=${
      username||name}`;
      
    await models.Registration.create({
      registration_id: uuidv4(),
      email,
      first_name: firstName,
      last_name: lastName,
      phone,
      gender,
      date_of_birth: dob,
      photo_url: photo_url? photo_url: profilePicture,
    });
    return response(res, 201, messages.Registration);
  } catch (error: any) {
    return response(res, 400, error.message);
  }
};

const createStudent = async (req: Request, res: Response) => {
  const { admin_id } = req.params;
  const { student_email, admission_status, class } = req.body;
  try {
    if (!admin_id) throw new Error(messages.unauthorizedPermission);

    const student = await models.Registration.findOne({
      where: {
        email: student_email,
      },
    });
    if (!student) throw new Error(messages.notFound);

    if(admission_status === "rejected"){
      const subject = `admission rejected`
      const message = `we're sorry ${student.othernames}, your admission was rejected`

      
      sendHtmlEmail( student.email, subject, message);
      deleteRegistration(student_email);
    }else if(admission_status === "admitted"){
      const admissionNumber = `76540${student.id}`
    }
    return response(res, 200, messages.updateStudent);
  } catch (error: any) {
    return response(res, 400, error.message);
  }
};

export { registerStudent, createStudent };
