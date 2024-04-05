import express from "express";
const router = express.Router();
import validationMiddleware from "../middleware/validation";
import {
  registerStudent,
  updateRegistrationStatus,
} from "../controllers/registration";
import { registrationSchema } from "../validations/registration";
import Authorization from "../middleware/authorization";
import checkAdmin from "../middleware/admin";

router.post(
  "/register_student",
  validationMiddleware(registrationSchema),
  registerStudent
);

router.patch(
  "/update_student/:studentEmail/:admission_status",
  Authorization,
  checkAdmin,
  updateRegistrationStatus
);

export default router;
