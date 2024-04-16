const models = require("../models");
import { Request, Response } from "express";
import messages from "../constants/messages";
import response from "../utils/response";
import path from "path";
import { v4 as uuidv4 } from "uuid";

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

    const unreviewedAssessment = await models.Results.findAll({
      where: { is_assessment_reviewed: false },
      attributes: [
        "result_id",
        "lesson_id",
        "student_id",
        "assessment_url",
        "createdAt",
      ],
    });

    return response(res, 200, messages.fetched, unreviewedAssessment);
  } catch (error: any) {
    return response(res, 400, error.message || messages.serverError);
  }
};
const gradeStudentAssessment = async (req: Request, res: Response) => {
  const { admin_id, student_id } = req.params;
  const { grade } = req.body;

  try {
    if (!admin_id) throw new Error(messages.unauthorisedAccess);

    const studentAssessment = await models.Results.findOne({
      where: { student_id },
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
