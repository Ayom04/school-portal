import express from "express";
const router = express.Router();
import validationMiddleware from "../middleware/validation";
import { registerStudent, createStudent } from "../controllers/registration";
import { registrationSchema } from "../validations/registration";
import Authorization from "../middleware/authorization";
import checkAdmin from "../middleware/admin";

router.post(
  "/register-student",
  validationMiddleware(registrationSchema),
  registerStudent
);

router.patch(
  "/create-student/:studentEmail",
  Authorization,
  checkAdmin,
  createStudent
);

export default router;
