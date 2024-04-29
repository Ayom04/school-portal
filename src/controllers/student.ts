import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import path from "path";
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
import { QueryTypes, where } from "sequelize";
import { any } from "joi";
const { sequelize } = require("../models");

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

      const { hash, } = await hashPassword(password);
console.log("here: ",hash,admissionNumber)
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
    console.log(error)
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

    const checkPasssword = await comparePassword(
      password,
      student.password_hash
    );

    if (!student || !checkPasssword)
      throw new Error(messages.invalidCredentials);

    // if (!student.dataValues.is_password_changed) {
    //   res.set("Access-Control-Allow-Origin", process.env.PASSWORD_CHANGE_URL);

    //   return res.redirect(
    //     `${process.env.PASSWORD_CHANGE_URL}?admissionNumber=${student.dataValues.admission_number}`
    //   );
    // }

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
      where: { admission_number: admissionNumber },
    });

    if (!student) throw new Error(messages.invalidCredentials);

    // if (!student.dataValues.is_password_changed)
    //   throw new Error(messages.unauthorizedPermission);

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

const completeForgetPassword = async (req: Request, res: Response) => {
  const { password } = req.body;
  const { admissionNumber, otp } = req.query;

  try {
    1;
    const student = await models.Students.findOne({
      where: { admission_number: admissionNumber },
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

    if (student.dataValues.is_password_changed)
      throw new Error(messages.unauthorizedPermission);

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

const getProfile = async (req: Request, res: Response) => {
  const { student_id } = req.params;
  try {
    if (!student_id) throw new Error(messages.unauthorisedAccess);
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
      studentDetails: {
        surname: student.dataValues.surname,
        othernames: student.dataValues.othernames,
        email: student.dataValues.email,
        phone: student.dataValues.phone,
        gender: student.dataValues.gender,
        dateOfBirth: student.dataValues.date_of_birth,
        class: student.dataValues.class,
        photo: student.dataValues.photo_url,
        admissionNumber: student.dataValues.admission_number,
      },
    });
  } catch (error: any) {
    return response(res, 400, error.message);
  }
};

const uploadPicture = async (req: Request, res: Response) => {
  const { student_id } = req.params;
  const { file } = req;
  try {
    if (!student_id) throw new Error(messages.unauthorisedAccess);

    if (!file) throw new Error(messages.noFileUploaded);

    if (file.mimetype.split("/")[0] !== "image")
      throw new Error(messages.fileTypeNotSupportedMessage);

    const fileName = path.basename(file.path);

    await models.Students.update(
      {
        photo_url: fileName,
      },
      {
        where: { student_id },
      }
    );

    return response(res, 200, messages.fileUploaded);
  } catch (error: any) {
    return response(res, 400, error.message);
  }
};

const getStudentProfile = async (req: Request, res: Response) => {
  const { student_id } = req.params;

  try {
    const student = await models.Students.findOne({
      where: { student_id },
      attributes: {
        exclude: [
          "id",
          "password_hash",
          "createdAt",
          "updatedAt",
          "is_deleted",
          "is_password_changed",
        ],
      },
    });
    //to use group by
    await sequelize.query(
      `SET SESSION sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));`,
      { raw: true }
    );
    const subjects = await sequelize.query(
      `SELECT 
        Subjects.id AS subject_id,
        Subjects.subject_id,
        Subjects.subject_name,
        Subjects.class_name,
        Lessons.id AS lesson_id,
        Lessons.title AS lesson_title,
        Lessons.description AS lesson_description,
        Lessons.content AS lesson_content,
        Lessons.text_content AS lesson_text_content,
        Lessons.video_url AS lesson_video_url,
        Lessons.audio_url AS lesson_audio_url,
        Lessons_Results.id AS lesson_result_id,
        Lessons_Results.assessment_url AS lesson_result_assessment_url,
        Lessons_Results.assessment_score AS lesson_result_assessment_score 
      FROM 
        Subjects 
      LEFT OUTER JOIN Lessons ON Subjects.subject_id = Lessons.subject_id
      LEFT OUTER JOIN Results AS Lessons_Results ON Lessons.lesson_id = Lessons_Results.lesson_id
      WHERE 
        Subjects.class_name = 'SSS3'
      ORDER BY
        Subjects.subject_name, Lessons.title`,
      {
        type: QueryTypes.SELECT,
        replacements: { student_id },
        raw: true,
      }
    );

    // Organize subjects, lessons, and assessment results
    const subjectsArray: {
      subject_id: any;
      subject_name: any;
      class_name: any;
      lessons: any[]; // Change 'never[]' to 'any[]'
    }[] = [];
    let currentSubject: {
      subject_id: any;
      subject_name: any; // Ensure 'subject_name' is always present
      class_name: any;
      lessons: any[];
    } | null = null;
    subjects.forEach(
      (row: {
        subject_id: any;
        subject_name: any;
        class_name: any;
        lesson_id: any;
        lesson_title: any;
        lesson_description: any;
        lesson_content: any;
        lesson_text_content: any;
        lesson_video_url: any;
        lesson_audio_url: any;
        lesson_result_id: any;
        lesson_result_assessment_url: any;
        lesson_result_assessment_score: any;
      }) => {
        if (!currentSubject || currentSubject.subject_id !== row.subject_id) {
          currentSubject = {
            subject_id: row.subject_id,
            subject_name: row.subject_name,
            class_name: row.class_name,
            lessons: [],
          };
          subjectsArray.push(currentSubject);
        }
        if (row.lesson_id) {
          const lesson = {
            lesson_id: row.lesson_id,
            title: row.lesson_title,
            description: row.lesson_description,
            content: row.lesson_content,
            text_content: row.lesson_text_content,
            video_url: row.lesson_video_url,
            audio_url: row.lesson_audio_url,
            assessment_result: {
              id: row.lesson_result_id,
              assessment_url: row.lesson_result_assessment_url,
              assessment_score: row.lesson_result_assessment_score,
            },
          };
          currentSubject.lessons.push(lesson);
        }
      }
    );

    // subjectsArray now contains subjects with lessons and assessment results

    return response(res, 200, messages.fetched, {
      student,
      subjects: subjectsArray,
    });
  } catch (error: any) {
    return response(res, 400, error.message);
  }
};

export {
  createStudent,
  login,
  startForgetPassword,
  completeForgetPassword,
  getProfile,
  changePassword,
  uploadPicture,
  getStudentProfile,
};
