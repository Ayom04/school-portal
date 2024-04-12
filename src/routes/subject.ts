import express from "express";
const router = express.Router();
import validationMiddleware from "../middleware/validation";
import Authorization from "../middleware/authorization";
import authentication from "../middleware/authentication";
import checkAdmin from "../middleware/admin";
import { createSubjectSchema } from "../validations/subject";
import {
  createSubject,
  getStudentSubjects,
  getSubjects,
  deleteSubject,
} from "../controllers/subject";

router.post(
  "/create_subject",
  Authorization,
  checkAdmin,
  validationMiddleware(createSubjectSchema),
  createSubject
);

router.get(
  "/student_subjects",
  Authorization,
  authentication,
  getStudentSubjects
);

router.get("/subjects/:class_name", Authorization, checkAdmin, getSubjects);

router.delete(
  "/delete_subject/:subject_name/:class_name",
  Authorization,
  checkAdmin,
  deleteSubject
);

export default router;
