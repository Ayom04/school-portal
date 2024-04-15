import multer from "multer";
const path = require("path");
import fs from "fs";

// Check if the uploads directory exists, if not, create it
const uploadDir = path.join(__dirname, "../../uploads/");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../uploads/"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

export default upload;
