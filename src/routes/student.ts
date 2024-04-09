import express from "express";
const router = express.Router();
import validationMiddleware from "../middleware/validation";
import {
  createStudentSchema,
  passwordSchema,
  validatePassword,
  validateEmail,
} from "../validations/student";
import Authorization from "../middleware/authorization";
import checkAdmin from "../middleware/admin";
import authentication from "../middleware/authentication";
import {
  createStudent,
  changeStudentPassword,
  studentForgetPassword,
  studentCompleteForgetPassword,
} from "../controllers/student";

router.post(
  "/create-student",
  Authorization,
  checkAdmin,
  validationMiddleware(createStudentSchema),
  createStudent
);

router.patch(
  "/change_password",
  Authorization,
  authentication,
  validationMiddleware(passwordSchema),
  changeStudentPassword
);

router.post(
  "/forget_password",
  validationMiddleware(validateEmail),
  studentForgetPassword
);

router.patch(
  "/reset_password",
  validationMiddleware(validatePassword),
  studentCompleteForgetPassword
);

export default router;
