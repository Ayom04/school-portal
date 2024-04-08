import express from "express";
const router = express.Router();
import validationMiddleware from "../middleware/validation";
import {
  createStudentSchema,
  validatePassword,
  validateStudentLogin,
} from "../validations/student";
import Authorization from "../middleware/authorization";
import checkAdmin from "../middleware/admin";
import { changePassword, createStudent, login } from "../controllers/student";

router.post(
  "/create-student",
  Authorization,
  checkAdmin,
  validationMiddleware(createStudentSchema),
  createStudent
);

router.post("/login", validationMiddleware(validateStudentLogin), login);

router.patch(
  "/change-password",
  validationMiddleware(validatePassword),
  changePassword
);
export default router;
