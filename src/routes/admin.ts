import express from "express";
import Authorization from "../middleware/authorization";
import authentication from "../middleware/admin";
import { validateResigterAdmin } from "../validations/admin";
import { validateEmail, validatePassword } from "../validations/student";
import { validateAdminLogin } from "../validations/admin";

import validationMiddleware from "../middleware/validation";
const router = express.Router();
import {
  registerAdmin,
  login,
  startForgetPassword,
  completeForgetPassword,
  changePassword,
  updateStudent,
  deleteStudent,
  getStudent,
  getStudents,
  createSubject,
  updateSubject,
  deleteSubject,
  getSubject,
  getSubjects,
  getStudentSubjects,
  getTeacherSubjects,
  getTermCourses,
} from "../controllers/admin";

router.post(
  "/register",
  validationMiddleware(validateResigterAdmin),
  registerAdmin
);

router.post("/login", validationMiddleware(validateAdminLogin), login);

router.get(
  "/forget-password",
  validationMiddleware(validateEmail),
  startForgetPassword
);

router.patch(
  "/reset-password",
  validationMiddleware(validatePassword),
  completeForgetPassword
);

export default router;
