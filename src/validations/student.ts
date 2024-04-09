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
      "string.empty": "admission_status is required",
    }),
  studentClass: Joi.string().required().messages({
    "string.empty": "class is required",
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

const studentEmailSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required()
    .messages({
      "string.empty": `"Email" cannot be an empty`,
      "any.required": `"Email" is a required field`,
    }),
});

const passwordSchema = Joi.object({
  current_password: Joi.string().required().messages({
    "string.empty": `"Password" cannot be empty`,
    "any.required": `"Password" is a required field`,
  }),
  new_password: Joi.string().required().messages({
    "string.empty": `"confirm Password" cannot be an empty`,
    "any.required": `"confirm Password" is a required field`,
  }),
  confirmNew_password: Joi.string()
    .required()
    .valid(Joi.ref("new_password"))
    .messages({
      "string.empty": `"confirm Password" cannot be an empty`,
      "any.required": `"confirm Password" is a required field`,
    }),
});

export {
  createStudentSchema,
  updateStudent,
  validateLogin,
  validateEmail,
  validatePassword,
  studentEmailSchema,
  passwordSchema,
};
