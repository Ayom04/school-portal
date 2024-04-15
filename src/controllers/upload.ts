import { Request, Response } from "express";
import response from "../utils/response";
import messages from "../constants/messages";
const models = require("../models");
import path from "path";

const uploadLesson = async (req: Request, res: Response) => {
  const { lesson_id, admin_id } = req.params;

  try {
    if (!admin_id) throw new Error(messages.unauthorisedAccess);

    //check if lesson exist
    const checkIfLessonExists = await models.Lessons.findOne({
      where: { lesson_id },
    });

    if (!checkIfLessonExists) throw new Error(messages.lessonExists);

    // Check if file exists in request
    if (!req.file) throw new Error("No file uploaded");

    // File uploaded successfully
    const filePath = req.file.path;
    const fileType = req.file.mimetype.split("/")[0]; // Extract file type (audio, text, video)
    const fileUrl = `http://localhost:${process.env.PORT}/${filePath}`; // Assuming your server is running locally
    const fileName = path.basename(req.file.path);

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

    return response(res, 200, messages.fileUploaded, { fileUrl, fileType });
  } catch (error: any) {
    console.error("Error uploading file:", error);
    return response(res, 400, error.message);
  }
};

export { uploadLesson };
