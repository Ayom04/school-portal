import Joi from "joi";

const validateResigterAdmin = Joi.object({
  email: Joi.string().required().email().messages({
    "string.empty": `"Email" cannot be empty`,
    "any.required": `"Email" is a required field`,
    "string.email": `"Email" must be a valid email`,
  }),
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
});

const validateAdminLogin = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required()
    .messages({
      "string.empty": `"Email" cannot be an empty`,
      "any.required": `"Email" is a required field`,
    }),
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
});
const validateEmail = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
});

export { validateResigterAdmin, validateAdminLogin, validateEmail };
