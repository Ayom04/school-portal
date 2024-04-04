import Joi from "joi";

const validateResigterAdmin = Joi.object({
  email: Joi.string().required().email().messages({
    "string.empty": `"Email" cannot be empty`,
    "any.required": `"Email" is a required field`,
    "string.email": `"Email" must be a valid email`,
  }),
  password: Joi.string().required().messages({
    "string.empty": `"Password" cannot be empty`,
    "any.required": `"Password" is a required field`,
  }),
});

export { validateResigterAdmin };
