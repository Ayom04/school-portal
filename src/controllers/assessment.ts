const models = require("../models");
import { Request, Response } from "express";
import messages from "../constants/messages";
import response from "../utils/response";
import path from "path";
import { v4 as uuidv4 } from "uuid";
const { sequelize } = require("../models");

const submitAssessment = async (req: Request, res: Response) => {
  const { lesson_id, student_id } = req.params;
  const { file } = req;

  try {
    const lesson = await models.Lessons.findOne({
      where: { lesson_id },
    });

    if (!lesson) throw new Error(messages.lessonNotFound);

    const checkIfAssessmentTaken = await models.Results.findOne({
      where: {
        lesson_id,
        student_id,
      },
    });

    if (checkIfAssessmentTaken)
      throw new Error(messages.assessmentTakenMessage);

    if (!file) throw new Error(messages.noFileUploaded);

    if (file.mimetype.split("/")[0] !== "application")
      throw new Error(messages.fileTypeNotSupportedMessage);

    const fileName = path.basename(file.path);

    const assessment = await models.Results.create({
      result_id: uuidv4(),
      lesson_id,
      student_id,
      assessment_url: fileName,
      term: 3,
    });

    return response(res, 201, messages.assessmentSubmitted);
  } catch (error: any) {
    return response(res, 400, error.message);
  }
};

const getUnreviewedAssessment = async (req: Request, res: Response) => {
  const { admin_id } = req.params;
  try {
    if (!admin_id) throw new Error(messages.unauthorisedAccess);

    // const unreviewedAssessment = await models.Results.findAll({
    //   where: { is_assessment_reviewed: false },
    //   include: [
    //     {
    //       model: models.Lessons,
    //       attributes: ["lesson_id", "title"],
    //     },
    //     {
    //       model: models.Students,
    //       attributes: ["student_id", "surname", "othernames", "class"],
    //     },
    //   ],
    //   attributes: [
    //     "result_id",
    //     "lesson_id",
    //     "student_id",
    //     "assessment_url",
    //     "createdAt",
    //   ],
    // });
    const unreviewedAssessment = await sequelize.query(
      `SELECT 
        Results.id, 
        Results.result_id, 
        Results.lesson_id, 
        Results.student_id, 
        Results.assessment_url, 
        Results.createdAt, 
        Lesson.id AS Lesson_id, 
        Lesson.lesson_id AS Lesson_lesson_id, 
        Lesson.title AS Lesson_title, 
        Student.id AS Student_id, 
        Student.student_id AS Student_student_id, 
        Student.surname AS Student_surname, 
        Student.othernames AS Student_othernames, 
        Student.class AS Student_class 
      FROM 
        Results AS Results 
      LEFT OUTER JOIN 
        Lessons AS Lesson 
      ON 
        Results.lesson_id = Lesson.lesson_id 
      LEFT OUTER JOIN 
        Students AS Student 
      ON 
        Results.student_id = Student.student_id 
      WHERE 
        Results.is_assessment_reviewed = false;`
    );

    return response(res, 200, messages.fetched, unreviewedAssessment);
  } catch (error: any) {
    return response(res, 400, error.message || messages.serverError);
  }
};

const gradeStudentAssessment = async (req: Request, res: Response) => {
  const { admin_id, student_id, lesson_id } = req.params;
  const { grade } = req.body;

  try {
    if (!admin_id) throw new Error(messages.unauthorisedAccess);

    const studentAssessment = await models.Results.findOne({
      where: { student_id, lesson_id },
    });

    if (!studentAssessment) throw new Error(messages.notFound);

    if (studentAssessment.is_assessment_reviewed)
      throw new Error("Assessment already reviewed");

    await models.Results.update(
      { assessment_score: grade, is_assessment_reviewed: true },
      { where: { student_id } }
    );

    return response(res, 200, messages.updated);
  } catch (error: any) {
    console.log(error);
    return response(res, 400, error.message || messages.serverError);
  }
};

export { submitAssessment, getUnreviewedAssessment, gradeStudentAssessment };
