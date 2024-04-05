const Joi = require("joi");

const registrationSchema = Joi.object({
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
  dob: Joi.date().required().messages({
    "date.empty": "date of birth is required",
  }),
  phone: Joi.string().required().messages({
    "string.empty": "Phone number is required",
  }),
  gender: Joi.string().valid("male", "female", "others").messages({
    "string.empty": "gender is required",
  }),
});

export { registrationSchema };
