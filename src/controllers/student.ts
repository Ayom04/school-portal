import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import {
  hashPassword,
  comparePassword,
  generateOtp,
  generateMatricNumber,
  generateRandomCharacters,
} from "../utils/helper";
import response from "../utils/response";
const models = require("../models");
import messages from "../constants/messages";
import { readFileAndSendEmail } from "../services/email";
import { ADMISSION_STATUS } from "../constants/enum";
import { deleteRegistration } from "../utils";
import { where } from "sequelize";

const createStudent = async (req: Request, res: Response) => {
  const { admin_id } = req.params;
  const { studentEmail, admissionStatus } = req.body;
  try {
    if (!admin_id) throw new Error(messages.unauthorizedPermission);

    const student = await models.Registrations.findOne({
      where: {
        email: studentEmail,
      },
    });
    if (!student) throw new Error(messages.notFound);

    if (admissionStatus === ADMISSION_STATUS.REJECTED) {
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
      await deleteRegistration(studentEmail);
    } else if (admissionStatus === ADMISSION_STATUS.ADMITTED) {
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
        class: student.dataValues.class,
        phone: student.phone,
        email: studentEmail,
        password_hash: hash,
        admission_number: admissionNumber,
      });

      const dataReplacement = {
        student_name: `${student.surname} ${student.othernames}`,
        school_name: process.env.SCHOOL_NAME,
        admission_number: admissionNumber,
        portal_link: process.env.PORTAL_LINK,
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
        "approve_admission"
      );
      await deleteRegistration(studentEmail);
    }

    return response(res, 200, messages.updateStudent);
  } catch (error: any) {
    console.log(error);
    return response(res, 400, error.message);
  }
};


const login = async (req: Request, res: Response) => {
  const { admissionNumber, password } = req.body;

  try {
    const student = await models.Students.findOne({
      where: {
        admission_number: admissionNumber,
      },
    });

    if (!student) throw new Error(messages.invalidCredentials);

    if (!student.dataValues.is_password_changed) {
      return res.redirect(
        `${process.env.PASSWORD_CHANGE_URL}?admissionNumber=${student.dataValues.admission_number}`
      );
    }

    const checkPasssword = await comparePassword(
      password,
      student.dataValues.password_hash
    );

    if (!checkPasssword) throw new Error(messages.invalidCredentials);

    const token = jwt.sign(
      {
        email: student.dataValues.email,
        _id: uuidv4(),
      },
      process.env.JWT_SECRET || "somethingsecret",
      {
        expiresIn: "24h",
      }
    );
    res.set("Authorization", `Bearer ${token}`);
    return response(res, 200, messages.loginSuccess, {
      token,
    });
  } catch (error: any) {
    return response(res, 400, error.message);
  }
};

  const startForgetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { admissionNumber } = req.body;

  try {
    const student = await models.Students.findOne({
      where: { admissionNumber },
    });

    if (!student) throw new Error(messages.invalidCredentials);
  
    const otp = generateOtp(6);
    const _otp = await models.Otps.findOne({
      where: { email_or_admssionNumber: admissionNumber },
    });
    if (!_otp) {
      await models.Otps.create({
        otp_id: uuidv4(),
        otp,
        email_or_admssionNumber: admissionNumber,
      });
    }
    const { hash } = await hashPassword(String(otp));
    const link = `${process.env.STUDENT_RESET_PASSWORD_URL}?email=${admissionNumber}&otp=${hash}`;

    const dataReplacement = {
      resetPasswordlink: link,
    };

    await readFileAndSendEmail(
      student.dataValues.email,
      "password reset",
      dataReplacement,
      "forget_password"
    );

    return response(res, 200, messages.passwordLink);

  } catch (error: any) {
    return response(res, 400, error.message);
  }
};


const changePassword = async (req: Request, res: Response) => {
  const { admissionNumber } = req.query;
  const { password } = req.body;

  try {
    if (!admissionNumber) throw new Error(messages.invalidCredentials);

    const student = await models.Students.findOne({
      where: {
        admission_number: admissionNumber,
      },
    });

    if (!student) throw new Error(messages.invalidCredentials);

    const checkPasssword = await comparePassword(
      password,
      student.dataValues.password_hash
    );
    if (checkPasssword) throw new Error(messages.passwordMisamtch);

    const { hash } = await hashPassword(password);
    await models.Students.update(
      {
        password_hash: hash,
        is_password_changed: true,
      },
      {
        where: { admission_number: admissionNumber },
      }
    );

    response(res, 200, messages.passwordUpdatedSuccesfully);
  } catch (error: any) {
    return response(res, 400, error.message);
  }
};

const completeForgetPassword = async (req: Request, res: Response) => {
  const { password } = req.body;
  const { admissionNumber, otp } = req.query;

  try {
    1;
    const student = await models.Students.findOne({
      where: { admissionNumber },
    });
    if (!student) throw new Error(messages.invalidCredentials);

    const _otp = await models.Otps.findOne({
      where: {
        email_or_admssionNumber: admissionNumber,
      },
    });
    if (!_otp) throw new Error(messages.notFound);
    const checkIfOtpMatch = comparePassword(_otp.dataValues.otp, otp as string);
    if (!checkIfOtpMatch) throw new Error(messages.invalidOtp);

    const timeDifference: number =
      new Date().getTime() - new Date(_otp.createdAt).getTime();

    const timeDifferenceInMinutes = Math.ceil(
      timeDifference / (1000 * 60 * 60 * 24)
    );

    if (timeDifferenceInMinutes > 5) throw new Error(messages.otpExpired);


    const { hash } = await hashPassword(password);
    await models.Students.update(
      {
        password_hash: hash,
        is_password_changed: true,
      },
      {
        where: { admission_number: admissionNumber },
      }
    );

    response(res, 200, messages.passwordUpdatedSuccesfully);

     
    await models.Otps.destroy({
      where: {
        email_or_admssionNumber: admissionNumber,
      },
    });
    return response(res, 200, messages.passwordReset);

  } catch (error: any) {
    return response(res, 400, error.message);
  }
};



const getProfile = async (req: Request, res: Response) => {
  const { student_id } = req.params;
  try {
    if (!student_id) throw new Error(messages.unauthorizedPermission);
    const student = await models.Students.findOne({
      where: { student_id },
      attributes: [
        "surname",
        "othernames",
        "email",
        "phone",
        "gender",
        "date_of_birth",
        "class",
        "photo_url",
        "admission_number",
      ],
    });

    if (!student) throw new Error(messages.notFound);

    return response(res, 200, messages.studentRetrievedMessage, {
      studentDetail: student,
    });
  } catch (error: any) {
    return response(res, 400, error.message);
  }
};

const getSubjects = async (req: Request, res: Response) => {};

export {
  createStudent,
  login,
  startForgetPassword,
  completeForgetPassword,
  getProfile,
  getSubjects,
};
