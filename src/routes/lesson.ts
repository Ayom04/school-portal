import express from "express";
const router = express.Router();
import validationMiddleware from "../middleware/validation";
import Authorization from "../middleware/authorization";
import authentication from "../middleware/authentication";
import checkAdmin from "../middleware/admin";
import {
  validateCreateLessionSchema,
  validateUpdateLessionSchema,
} from "../validations/lesson";
import {
  createLesson,
  deleteLesson,
  getLessons,
  getStudentLesson,
  updateLesson,
} from "../controllers/lesson";

router.post(
  "/create-lesson/:subject_id",
  Authorization,
  checkAdmin,
  validationMiddleware(validateCreateLessionSchema),
  createLesson
);

router.patch(
  "/update-lesson/:lesson_id",
  Authorization,
  checkAdmin,
  validationMiddleware(validateUpdateLessionSchema),
  updateLesson
);

router.get(
  "/get-student-lessons",
  Authorization,
  authentication,
  getStudentLesson
);

router.get("/get-all-lessons", Authorization, checkAdmin, getLessons);

router.delete(
  "/delete-lesson/:lesson_id",
  Authorization,
  checkAdmin,
  deleteLesson
);

export default router;
