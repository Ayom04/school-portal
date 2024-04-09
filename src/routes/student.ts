import express from "express";
const router = express.Router();
import validationMiddleware from "../middleware/validation";
import {
  createStudentSchema,
  updateStudent,
  validateStudentLogin,
  validateAdmissioNumberSchema,
  validatePassword,
  passwordSchema,
} from "../validations/student";
import Authorization from "../middleware/authorization";
import checkAdmin from "../middleware/admin";
import {
  changePassword,
  createStudent,
  login,
  startForgetPassword,
  completeForgetPassword,
  getProfile,
} from "../controllers/student";
import authentication from "../middleware/authentication";

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

router.post(
  "/forget-password",
  validationMiddleware(validateAdmissioNumberSchema),
  startForgetPassword
);

router.patch(
  "/reset-password",
  validationMiddleware(validatePassword),
  completeForgetPassword
);

router.get("/profile", Authorization, authentication, getProfile);
export default router;
