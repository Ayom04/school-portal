const Joi = require("joi");

const createStudent = Joi.object({
  firstName: Joi.string().required().messages({
    "string.empty": "First name is required",
  }),
  lastName: Joi.string().required().messages({
    "string.empty": "Last name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be a valid email",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
  phone: Joi.string().required().messages({
    "string.empty": "Phone number is required",
  }),
});
const updateStudent = Joi.object({});
export { createStudent, updateStudent };
