const Joi = require("joi");

const registrationSchema = Joi.object({
  surname: Joi.string().required().messages({
    "string.empty": "First name is required",
  }),
  othernames: Joi.string().required().messages({
    "string.empty": "Last name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be a valid email",
  }),
  dob: Joi.date().required().messages({
    "date.empty": "date of birth is required",
  }),
  phone: Joi.string().required().messages({
    "string.empty": "Phone number is required",
  }),
  gender: Joi.string().valid("male", "female", "others").messages({
    "string.empty": "gender is required",
  }),
  photo_url: Joi.string(),
});

const createStudentSchema = Joi.object({
  studentEmail: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be a valid email",
  }),
  admissionStatus: Joi.string().valid("admitted", "rejected").messages({
    "string.empty": "admission_status is required",
  }),
  studentCLass: Joi.string().required().messages({
    "string.empty": "class is required",
  }),
});

export { registrationSchema, createStudentSchema };
