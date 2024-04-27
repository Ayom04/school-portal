import { Request, Response } from "express";
import { QueryTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import messages from "../constants/messages";
import response from "../utils/response";
const models = require("../models");
const { sequelize } = require("../models");
import path from "path";

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
const uploadLesson = async (req: Request, res: Response) => {
  const { admin_id } = req.params;
  const { files } = req;
  try {
    // console.log("here: ",files);
    if (!admin_id) throw new Error(messages.unauthorisedAccess);

    //check if lesson exist
    // const checkIfLessonExists = await models.Lessons.findOne({
    //   where: { lesson_id },
    // });

    // if (!checkIfLessonExists) throw new Error("Invalid Lesson identifier");

    if (!files || files.length === 0) throw new Error(messages.noFileUploaded);
    const filesArray = Array.isArray(files) ? files : [files];
    if (filesArray.length === 0) throw new Error(messages.noFileUploaded);

    let updateFields = {};
    // File uploaded successfully
    const mapSOmething = filesArray.map((file: any) => {
      const fileType = file.mimetype.split("/")[0]; // Extract file type (audio, text, video)
      const fileName = path.basename(file.path);
      switch (fileType) {
        case "audio":
          updateFields = { ...updateFields, audio_url: fileName };
          break;
        case "video":
          updateFields = { ...updateFields, video_url: fileName };
          break;
        case "application":
          updateFields = { ...updateFields, text_content: fileName };
          break;
        default:
          throw new Error(messages.fileTypeNotSupportedMessage);
      }
      return updateFields;
    });

    /** 
    const filePath = req.file.path;
    const fileUrl = `http://localhost:${process.env.PORT}/${filePath}`; // Assuming your server is running locally
    */
    // const fileType = file.mimetype.split("/")[0]; // Extract file type (audio, text, video)
    // const fileName = path.basename(file.path);

    // let updateFields = {};
    // switch (fileType) {
    //   case "audio":
    //     updateFields = { audio_url: fileName };
    //     break;
    //   case "video":
    //     updateFields = { video_url: fileName };
    //     break;
    //   case "application":
    //     updateFields = { text_content: fileName };
    //     break;
    //   default:
    //     throw new Error(messages.fileTypeNotSupportedMessage);
    // }
    // Save file details to database
    // await models.Lessons.update(updateFields, {
    //   where: { lesson_id },
    // });

    return response(res, 200, messages.fileUploaded, {
      files: mapSOmething[mapSOmething.length - 1],
    });
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
  uploadLesson,
};
