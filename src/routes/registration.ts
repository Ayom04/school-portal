import express from "express";
const router = express.Router();
import validationMiddleware from "../middleware/validation";
import {
  registerStudent,
  getRegisteredStudents,
  deletePendingRegistrations,
  uploadPicture,
} from "../controllers/registration";
import { registrationSchema } from "../validations/registration";
import Authorization from "../middleware/authorization";
import checkAdmin from "../middleware/admin";
import authentication from "../middleware/authentication";
import { uploadImage } from "../middleware/upload";

router.post(
  "/register-student",
  validationMiddleware(registrationSchema),
  registerStudent
);

router.get(
  "/get-registered-students",
  Authorization,
  checkAdmin,
  getRegisteredStudents
);

router.delete(
  "/delete-pending-registrations",
  Authorization,
  checkAdmin,
  deletePendingRegistrations
);
router.post("/upload-picture", uploadImage.single("image"), uploadPicture);

export default router;
