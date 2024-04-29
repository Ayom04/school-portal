import multer from "multer";
const path = require("path");
import fs from "fs";
import response from "../utils/response";
import { Request, Response } from "express";

// Check if the uploads directory exists, if not, create it
const uploadDir = path.join(__dirname, "../../uploads/images/");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Define allowed file types
const allowedTypes = ["video", "audio", "application", "images"];

const storageForFiles = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../uploads/images/"));
  },
  filename: function (req: Request, file: any, cb) {
    // console.log("file: " +file);
    const fileType = file.mimetype.split("/")[0];
    const timestamp = Date.now();
    const fileName = `${fileType}_${timestamp}_${file.originalname}`;
    // console.log("fileName: " + fileName);
    // if (!allowedTypes.includes(fileType)) {
    //   return response(res:Response, 400, "Invalid file type");
    // }
    cb(null, fileName);
  },
});
const storageForImages = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../uploads/images/"));
  },
  filename: function (req: Request, file, cb) {
    const fileType = file.mimetype.split("/")[0];
    const timestamp = Date.now();
    const fileName = `${fileType}_${timestamp}_${file.originalname}`;
    console.log("fileName: " + fileName);
    // if (!allowedTypes.includes(fileType)) {
    //   return response(res:Response, 400, "Invalid file type");
    // }
    cb(null, fileName);
  },
});

const uploadLessonContent = multer({ storage: storageForFiles });
const uploadImage = multer({ storage: storageForImages });

export { uploadLessonContent, uploadImage };
