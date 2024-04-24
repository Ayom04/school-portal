import { Request, Response } from "express";
import { QueryTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import messages from "../constants/messages";
import response from "../utils/response";
const models = require("../models");
const { sequelize } = require("../models");

const createLesson = async (req: Request, res: Response) => {
  const { admin_id, subject_id } = req.params;

  const {
    topic,
    description,
    content,
    text_content,
    video_url,
    audio_url,
    term,
  } = req.body;

  if (!admin_id) throw new Error(messages.unauthorisedAccess);
  try {
    const checkIfTopicExists = await models.Lessons.findOne({
      where: { subject_id, title: topic },
    });

    if (checkIfTopicExists) throw new Error(messages.lessonExists);

    await models.Lessons.create({
      lesson_id: uuidv4(),
      title: topic,
      description,
      subject_id,
      content: JSON.stringify(content),
      text_content,
      video_url,
      audio_url,
      term,
    });
    return response(res, 201, messages.lessonCreated);
  } catch (error: any) {
    return response(res, 400, error.message);
  }
};

const updateLesson = async (req: Request, res: Response) => {
  const { admin_id, lesson_id } = req.params;

  const {
    topic,
    description,
    content,
    text_content,
    video_url,
    audio_url,
    term,
  } = req.body;

  if (!admin_id) throw new Error(messages.unauthorisedAccess);
  try {
    const checkIfTopicExists = await models.Lessons.findOne({
      where: { lesson_id },
    });

    if (!checkIfTopicExists) throw new Error(messages.lessonExists);

    await models.Lessons.update(
      {
        title: topic,
        description,
        content: JSON.stringify(content),
        text_content,
        video_url,
        audio_url,
        term,
      },
      {
        where: { lesson_id },
      }
    );
    return response(res, 201, messages.lessonUpdated);
  } catch (error: any) {
    return response(res, 400, error.message);
  }
};

const getStudentLesson = async (req: Request, res: Response) => {
  const { student_id } = req.params;
  try {
    const student = await models.Students.findOne({
      where: { student_id },
    });
    if (!student) throw new Error(messages.notFound);

    const lessons = await sequelize.query(
      `SELECT 
        title, 
        description, 
        content, 
        text_content, 
        video_url, 
        audio_url, 
        term, 
        subject_name, 
        class_name
      FROM 
        Lessons
      INNER JOIN 
        Subjects
      ON 
        Lessons.subject_id = Subjects.subject_id
      WHERE 
        Subjects.class_name = '${student.dataValues.class}';`,
      {
        type: QueryTypes.SELECT,
      }
    );

    return response(res, 200, messages.lessonFetch, lessons);
  } catch (error: any) {
    return response(res, 400, error.message);
  }
};

const getLessons = async (req: Request, res: Response) => {
  const { admin_id } = req.params;
  try {
    if (!admin_id) throw new Error(messages.unauthorisedAccess);

    const lessons = await sequelize.query(
      `SELECT
        lesson_id,
        title,
        description,
        content,
        text_content,
        video_url,
        audio_url,
        term,
        subject_name,
        class_name
      FROM
        Lessons
      INNER JOIN
        Subjects
      ON
        Lessons.subject_id = Subjects.subject_id`,
      {
        type: QueryTypes.SELECT,
      }
    );

    return response(res, 200, messages.lessonFetch, lessons);
  } catch (error: any) {
    console.log("error: ", error);
    return response(res, 400, error.message);
  }
};

const deleteLesson = async (req: Request, res: Response) => {
  const { admin_id, lesson_id } = req.params;
  try {
    if (!admin_id) throw new Error(messages.unauthorisedAccess);

    await models.Lessons.destroy({
      where: { lesson_id },
    });
    return response(res, 200, messages.lessonDeleted);
  } catch (error: any) {
    return response(res, 400, error.message);
  }
};
export {
  createLesson,
  getLessons,
  getStudentLesson,
  updateLesson,
  deleteLesson,
};
