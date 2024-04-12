const models = require("../models");
import messages from "../constants/messages";
import { Request, Response } from "express";
import response from "../utils/response";
import { v4 as uuidv4 } from "uuid";
import { studentClassEnum } from "../constants/enum";

const createSubject = async (req: Request, res: Response) => {
  const { admin_id } = req.params;
  const { subject_name, class_name } = req.body;
  try {
    if (!admin_id) throw new Error(messages.unauthorizedPermission);

    const checkIfSubjectExists = await models.Subjects.findOne({
      where: {
        [models.Sequelize.Op.and]: [
          { subject_name: subject_name },
          { class_name: class_name },
        ],
      },
    });
    if (checkIfSubjectExists) throw new Error(messages.subjectExists);

    await models.Subjects.create({
      subject_id: uuidv4(),
      subject_name,
      class_name: studentClassEnum[class_name as keyof typeof studentClassEnum],
    });
    return response(res, 201, messages.subjectCreated);
  } catch (error: any) {
    return response(res, 400, error.message);
  }
};

const getStudentSubjects = async (req: Request, res: Response) => {
  const { student_id } = req.params;
  try {
    if (!student_id) throw new Error(messages.unauthorisedAccess);
    const student = await models.Students.findOne({
      where: { student_id },
    });

    const studentSubjects = await models.Subjects.findAll({
      attributes: ["subject_name"],
      where: {
        class_name: student.dataValues.class,
      },
    });

    return response(res, 200, messages.subjects, studentSubjects);
  } catch (error: any) {
    return response(res, 400, error.message);
  }
};

const getSubjects = async (req: Request, res: Response) => {
  const { admin_id, class_name } = req.params;
  try {
    if (!admin_id) throw new Error(messages.unauthorizedPermission);

    const subjects = await models.Subjects.findAll({
      attributes: ["subject_name", "class_name"],
      where: { class_name },
    });

    return response(res, 200, messages.subjects, subjects);
  } catch (error: any) {
    return response(res, 400, error.message);
  }
};

const deleteSubject = async (req: Request, res: Response) => {
  const { admin_id, subject_name, class_name } = req.params;
  try {
    if (!admin_id) throw new Error(messages.unauthorizedPermission);

    await models.Subjects.destroy({
      where: {
        [models.Sequelize.Op.and]: [
          { subject_name: subject_name },
          { class_name: class_name },
        ],
      },
    });
    return response(res, 200, messages.deleteSubject);
  } catch (error: any) {
    return response(res, 400, error.message);
  }
};

export { createSubject, getStudentSubjects, getSubjects, deleteSubject };
