import { v4 as uuidv4 } from "uuid";
import { NextFunction, Request, Response } from "express";
import response from "../utils/response";
const models = require("../models");
import messages from "../constants/messages";
import { deleteRegistration } from "../utils/index";
import { readFileAndSendEmail, sendHtmlEmail } from "../services/email";
import {
  generateMatricNumber,
  generateRandomCharacters,
  hashPassword,
} from "../utils/helper";

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
    const checkIfStudentExists = await models.Registration.findOne({
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

    return response(res, 200, students);
  } catch (error: any) {
    return response(res, 400, error.message);
  }
};
const deletePendingRegistrations = async (req: Request, res: Response) => {
  const { admin_id } = req.params;
  try {
    if (!admin_id) throw new Error(messages.unauthorizedPermission);

    const students = await models.Registrations.findAll();
    if (!students) throw new Error(messages.notFound);

    await models.Registrations.destroy({
      where: { admission_status: "pending" },
    });

    return response(res, 200, messages.updateStudent);
  } catch (error: any) {
    return response(res, 400, error.message);
  }
};
const createStudent = async (req: Request, res: Response) => {
  const { admin_id } = req.params;
  const { studentEmail, admissionStatus, studentClass } = req.body;
  try {
    if (!admin_id) throw new Error(messages.unauthorizedPermission);

    const student = await models.Registrations.findOne({
      where: {
        email: studentEmail,
      },
    });
    if (!student) throw new Error(messages.notFound);

    if (admissionStatus === "rejected") {
      const dataReplacement = {
        student_name: `${student.surname} ${student.othernames}`,
        school_name: process.env.SCHOOL_NAME,
      };

      await readFileAndSendEmail(
        student.email,
        "Application Rejection",
        dataReplacement,
        "reject_admission"
      );
    } else if (admissionStatus === "admitted") {
      const studentData = await models.Students.findOne({
        where: {
          email: studentEmail,
        },
      });
      if (studentData) throw new Error(messages.forbidden);
      const password = await generateRandomCharacters(10);
      const admissionNumber = await generateMatricNumber();

      const { hash } = await hashPassword(password);

      await models.Students.create({
        student_id: uuidv4(),
        surname: student.dataValues.surname,
        othernames: student.dataValues.othernames,
        date_of_birth: student.dataValues.date_of_birth,
        gender: student.dataValues.gender,
        photo_url: student.dataValues.photo_url,
        phone: student.dataValues.phone,
        email: studentEmail,
        password: hash,
        admission_number: admissionNumber,
        class: studentClass,
      });

      const dataReplacement = {
        student_name: `${student.surname} ${student.othernames}`,
        school_name: process.env.SCHOOL_NAME,
        admission_number: admissionNumber,
        password,
        support: `${process.env.SCHOOL_NAME?.toLowerCase().replace(
          " ",
          ""
        )}@support.com`,
      };
      readFileAndSendEmail(
        studentEmail,
        "Admission Approval",
        dataReplacement,
        "admit_student"
      );
    }
    await deleteRegistration(studentEmail);
    return response(res, 200, messages.updateStudent);
  } catch (error: any) {
    return response(res, 400, error.message);
  }
};

export {
  registerStudent,
  createStudent,
  getRegisteredStudents,
  deletePendingRegistrations,
};
