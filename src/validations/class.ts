const Joi = require("joi");

const createClassSchema = Joi.object({
  class_name: Joi.string()
    .required()
    .valid("JSS1", "JSS2", "JSS3", "SSS1", "SSS2", "SSS3")
    .messages({
      "any.required": "Class is required",
      "any.only":
        "Invalid class, please select from JSS1, JSS2, JSS3, SSS1, SSS2, SSS3",
    }),
});

export { createClassSchema };
