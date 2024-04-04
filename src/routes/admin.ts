import express from "express";
import Authorization from "../middleware/authorization";
import authentication from "../middleware/admin";
import { validateResigterAdmin } from "../validations/admin";
import { validateLogin } from "../validations/student";
import validationMiddleware from "../middleware/validation";
const router = express.Router();
import {
  registerAdmin,
  logIn,
  startForgetPassword,
  completeForgetPassword,
  changePassword,
  login,
  createStudent,
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
router.post("/login", validationMiddleware(validateLogin), logIn);

export default router;
