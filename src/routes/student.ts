import express from "express";
const router = express.Router();
import validationMiddleware from "../middleware/validation";
import { createStudentSchema } from "../validations/student";
import Authorization from "../middleware/authorization";
import checkAdmin from "../middleware/admin";
import { createStudent } from "../controllers/student";

router.post(
  "/create-student",
  Authorization,
  checkAdmin,
  validationMiddleware(createStudentSchema),
  createStudent
);

export default router;
