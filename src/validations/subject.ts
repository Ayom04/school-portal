const Joi = require("joi");

const createSubjectSchema = Joi.object({
  subject_name: Joi.string().required().messages({
    "string.empty": "subject name is required",
  }),
  class_name: Joi.string().required().messages({
    "string.empty": "class ID is required",
  }),
});

export { createSubjectSchema };
