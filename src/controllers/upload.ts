import { Request, Response } from "express";
import response from "../utils/response";
import messages from "../constants/messages";
const models = require("../models");
import path from "path";

const uploadLesson = async (req: Request, res: Response) => {
  const { lesson_id, admin_id } = req.params;
  const { file } = req;
  try {
    if (!admin_id) throw new Error(messages.unauthorisedAccess);

    //check if lesson exist
    const checkIfLessonExists = await models.Lessons.findOne({
      where: { lesson_id },
    });

    if (!checkIfLessonExists) throw new Error(messages.lessonExists);

    // Check if file exists in request
    if (!file) throw new Error(messages.noFileUploaded);

    // File uploaded successfully
    /** 
    const filePath = req.file.path;
    const fileUrl = `http://localhost:${process.env.PORT}/${filePath}`; // Assuming your server is running locally
    */
    const fileType = file.mimetype.split("/")[0]; // Extract file type (audio, text, video)
    const fileName = path.basename(file.path);

    let updateFields = {};
    switch (fileType) {
      case "audio":
        updateFields = { audio_url: fileName };
        break;
      case "video":
        updateFields = { video_url: fileName };
        break;
      case "application":
        updateFields = { text_content: fileName };
        break;
      default:
        throw new Error(messages.fileTypeNotSupportedMessage);
    }
    // Save file details to database
    await models.Lessons.update(updateFields, {
      where: { lesson_id },
    });

    return response(res, 200, messages.fileUploaded);
  } catch (error: any) {
    return response(res, 400, error.message);
  }
};

export { uploadLesson };
