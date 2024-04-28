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
  student_class: Joi.string()
    .required()
    .valid("JSS1", "JSS2", "JSS3", "SSS1", "SSS2", "SSS3")
    .messages({
      "any.required": "Class is required",
      "any.only":
        "Invalid class, please select from JSS1, JSS2, JSS3, SSS1, SSS2, SSS3",
    }),
  gender: Joi.string().valid("male", "female", "others").messages({
    "string.empty": "gender is required",
    "any.only": "Invalid Gender, please select from male, female , others",
  }),
  photo_url: Joi.string().required().messages({
    "string.empty": "Photo is required",
    "any.required": "Photo is required",
  }),
});

export { registrationSchema };
