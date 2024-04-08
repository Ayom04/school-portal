const Joi = require("joi");

const createStudentSchema = Joi.object({
  studentEmail: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be a valid email",
  }),
  admissionStatus: Joi.string()
    .required()
    .valid("admitted", "rejected")
    .messages({
      "string.empty": "admission status is required",
    }),
  studentClass: Joi.string().required().messages({
    "string.empty": "class is required",
  }),
});

const updateStudent = Joi.object({});
const validateStudentLogin = Joi.object({
  admissionNumber: Joi.string().required().messages({
    "string.empty": `"Admission Number" cannot be empty`,
    "any.required": `"Admission Number" is a required field`,
  }),
  password: Joi.string()
    .min(6)
    .regex(/^(?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z]{8,}$/)
    .required()
    .label("Password")
    .messages({
      "string.empty": `"Password" cannot be an empty`,
      "string.min": `"Password" should have a minimum length of {#limit}`,
      "any.required": `"Password" is a required field`,
      "object.regex": `Must have at least 8 characters`,
      "string.pattern.base": `Password must contain at least a number and  letters `,
    }),
});

const validateEmail = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
});

const validatePassword = Joi.object({
  password: Joi.string()
    .min(6)
    .regex(
      /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[0-9a-zA-Z!@#$%^&*(),.?":{}|<>]{8,}$/
    )
    .required()
    .label("Password")
    .messages({
      "string.empty": `"Password" cannot be an empty`,
      "string.min": `"Password" should have a minimum length of {#limit}`,
      "any.required": `"Password" is a required field`,
      "object.regex": `Must have at least 8 characters`,
      "string.pattern.base": `Password must contain at least a number, letter and special characters`,
    }),
  confirmPassword: Joi.string()
    .min(6)
    .regex(
      /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[0-9a-zA-Z!@#$%^&*(),.?":{}|<>]{8,}$/
    )
    .required()
    .label("Password")
    .messages({
      "string.empty": `"confirm Password" cannot be an empty`,
      "string.min": `"confirm Password" should have a minimum length of {#limit}`,
      "any.required": `"confirm Password" is a required field`,
      "object.regex": `confirm Password Must have at least 8 characters`,
      "string.pattern.base": `confirm Password must contain at least a number, letter and special characters`,
    }),
});
export {
  createStudentSchema,
  updateStudent,
  validateStudentLogin,
  validateEmail,
  validatePassword,
};
