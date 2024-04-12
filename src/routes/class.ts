import express from "express";
const router = express.Router();
import validationMiddleware from "../middleware/validation";
import Authorization from "../middleware/authorization";
import authentication from "../middleware/authentication";
import checkAdmin from "../middleware/admin";
import { createClassSchema } from "../validations/class";
import { createClass } from "../controllers/class";

router.post(
  "/create-class",
  Authorization,
  checkAdmin,
  validationMiddleware(createClassSchema),
  createClass
);

export default router;
