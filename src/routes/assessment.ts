import express from "express";
const router = express.Router();
import validationMiddleware from "../middleware/validation";
import Authorization from "../middleware/authorization";
import authentication from "../middleware/authentication";
import checkAdmin from "../middleware/admin";
import upload from "../middleware/upload";
import {
  submitAssessment,
  getUnreviewedAssessment,
  gradeStudentAssessment,
} from "../controllers/assessment";
import { validateGradeStudentSchema } from "../validations/validation";

router.post(
  "/submit-assessment/:lesson_id",
  Authorization,
  authentication,
  upload.single("file"),
  submitAssessment
);

router.get(
  "/get-unreviewed-assessment",
  Authorization,
  checkAdmin,
  getUnreviewedAssessment
);

router.patch(
  "/grade-assessment/:student_id/:lesson_id",
  Authorization,
  checkAdmin,
  validationMiddleware(validateGradeStudentSchema),
  gradeStudentAssessment
);

export default router;
