const Joi = require("joi");

const validateGradeStudentSchema = Joi.object({
  grade: Joi.number().integer().min(0).max(100).required().messages({
    "number.base": "grade must be a number",
    "number.empty": "grade is required",
    "number.min": "grade must be greater than 0",
    "number.max": "grade must be less than 100",
  }),
});
export { validateGradeStudentSchema };
