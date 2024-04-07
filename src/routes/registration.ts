import express from "express";
const router = express.Router();
import validationMiddleware from "../middleware/validation";
import {
  registerStudent,
  createStudent,
  getRegisteredStudents,
  deletePendingRegistrations,
} from "../controllers/registration";
import {
  registrationSchema,
  createStudentSchema,
} from "../validations/registration";
import Authorization from "../middleware/authorization";
import checkAdmin from "../middleware/admin";

router.post(
  "/register-student",
  validationMiddleware(registrationSchema),
  registerStudent
);
router.get(
  "/register-students",
  Authorization,
  checkAdmin,
  getRegisteredStudents
);
router.patch(
  "/create-student",
  validationMiddleware(createStudentSchema),
  Authorization,
  checkAdmin,
  createStudent
);
router.delete(
  "/delete-pending-registrations",
  Authorization,
  checkAdmin,
  deletePendingRegistrations
);

export default router;
