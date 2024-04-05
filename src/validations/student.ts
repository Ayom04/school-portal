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
const validateLogin = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required()
    .messages({
      "string.empty": `"Email" cannot be an empty`,
      "any.required": `"Email" is a required field`,
    }),
  password: Joi.string().required().messages({
    "string.empty": `"Password" cannot be empty`,
    "any.required": `"Password" is a required field`,
  }),
});
const validateEmail = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
});
const validatePassword = Joi.object({
  password: Joi.string().required().messages({
    "string.empty": `"Password" cannot be empty`,
    "any.required": `"Password" is a required field`,
  }),
  confirmPassword: Joi.string().required().valid(Joi.ref("password")).messages({
    "string.empty": `"confirm Password" cannot be an empty`,
    "any.required": `"confirm Password" is a required field`,
  }),
});
export {
  createStudent,
  updateStudent,
  validateLogin,
  validateEmail,
  validatePassword,
};
