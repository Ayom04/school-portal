import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { hashPassword, comparePassword, generateOtp } from "../utils/helper";
import response from "../utils/response";
const models = require("../models");
import messages from "../constants/messages";
import { readFileAndSendEmail } from "../services/email";

const registerAdmin = async (req: Request, res: Response) => {
  const { email, password, receiver_email } = req.body;

  try {
    const checkIfUserExists = await models.Admins.findOne({
      where: {
        email,
      },
    });
    if (checkIfUserExists) throw new Error(messages.userExists);

    const { hash } = await hashPassword(password);

    await models.Admins.create({
      admin_id: uuidv4(),
      email,
      password_hash: hash,
    });
    return response(res, 201, messages.accoutCreated);
  } catch (error: any) {
    return response(res, 400, error.message);
  }
};
const logIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await models.Admins.findOne({
      where: {
        email,
      },
    });

    if (!user) throw new Error(messages.invalidCredentials);

    const checkPasssword = await comparePassword(
      password,
      user.dataValues.password_hash
    );

    if (!checkPasssword) throw new Error(messages.invalidCredentials);

    const token = jwt.sign(
      {
        email: user.dataValues.email,
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
  const { email } = req.body;

  try {
    const user = await models.Admins.findOne({ where: { email } });

    if (!user) throw new Error(messages.invalidCredentials);

    const otp = generateOtp(6);
    const _otp = await models.Otps.findOne({ where: { email } });
    if (!_otp) {
      await models.Otps.create({
        otp_id: uuidv4(),
        otp,
        email,
      });
    }
    const { hash } = await hashPassword(String(otp));
    const link = `${process.env.ADMIN_RESET_PASSWORD_URL}?email=${email}&otp=${hash}`;

    const dataReplacement = {
      resetPasswordlink: link,
    };

    await readFileAndSendEmail(
      email,
      "password reset",
      dataReplacement,
      "forget_password"
    );

    return response(res, 200, messages.passwordLink);
  } catch (error: any) {
    return response(res, 400, error.message);
  }
};

const completeForgetPassword = async (req: Request, res: Response) => {
  const { password } = req.body;
  const { email, otp } = req.query;

  try {
    const user = await models.Admins.findOne({ where: { email } });
    if (!user) throw new Error(messages.invalidCredentials);

    const _otp = await models.Otps.findOne({
      where: {
        email,
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
    await models.Users.update(
      {
        password_hash: hash,
      },
      {
        where: { email },
      }
    );

    await models.Otps.destroy({
      where: {
        email,
      },
    });
    return response(res, 200, messages.passwordReset);
  } catch (error: any) {
    return response(res, 400, error.message);
  }
};
const changePassword = async (req: Request, res: Response) => {};
const login = async (req: Request, res: Response) => {};
const createStudent = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;
    const studentExists = await models.Student.findOne({ where: { email } });
    if (studentExists) response(res, 409, messages.userExists);

    const student = await models.Student.create({
      id: uuidv4(),
      firstName,
      lastName,
      email,
      password: hashPassword(password),
      phone,
    });
    return response(res, 201, messages.studentCreated, student);
  } catch (error) {
    return response(res, 500, messages.serverError, error);
  }
};
const updateStudent = async (req: Request, res: Response) => {};
const deleteStudent = async (req: Request, res: Response) => {};
const getStudent = async (req: Request, res: Response) => {};
const getStudents = async (req: Request, res: Response) => {};

const createSubject = async (req: Request, res: Response) => {};
const updateSubject = async (req: Request, res: Response) => {};
const deleteSubject = async (req: Request, res: Response) => {};
const getSubject = async (req: Request, res: Response) => {};
const getSubjects = async (req: Request, res: Response) => {};
const getStudentSubjects = async (req: Request, res: Response) => {};
const getTeacherSubjects = async (req: Request, res: Response) => {};
const getTermCourses = async (req: Request, res: Response) => {};

export {
  registerAdmin,
  logIn,
  startForgetPassword,
  completeForgetPassword,
  changePassword,
  login,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudent,
  getStudents,
  createSubject,
  updateSubject,
  deleteSubject,
  getSubject,
  getSubjects,
  getStudentSubjects,
  getTeacherSubjects,
  getTermCourses,
};
