import { Request, Response } from "express";
import response from "../utils/response";
import messages from "../constants/messages";
const models = require("../models");
import path from "path";

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

export { uploadLesson };
