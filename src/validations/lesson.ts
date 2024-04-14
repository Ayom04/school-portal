import Joi from "joi";

const validateCreateLessionSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.empty": "Title is required",
    "any.required": "Title is required",
  }),
  description: Joi.string().messages({
    "string.empty": "Description is required",
    "any.required": "Description is required",
  }),
  content: Joi.array().items(Joi.string()).required().messages({
    "array.empty": "Content is required",
    "any.required": "Content is required",
  }),
  text_content: Joi.string().messages({
    "string.empty": "Text content is required",
    "any.required": "Text content is required",
  }),
  video_url: Joi.string().messages({
    "string.empty": "Video URL is required",
    "any.required": "Video URL is required",
  }),
  audio_url: Joi.string().messages({
    "string.empty": "Audio URL is required",
    "any.required": "Audio URL is required",
  }),
  term: Joi.number().integer().valid(1, 2, 3).required().messages({
    "number.base": "Term must be a number",
    "number.integer": "Term must be an integer",
    "any.only": "Term must be 1, 2 or 3",
  }),
});
const validateUpdateLessionSchema = Joi.object({
  title: Joi.string().messages({
    "string.empty": "Title is required",
  }),
  description: Joi.string().messages({
    "string.empty": "Description is required",
    "any.required": "Description is required",
  }),
  content: Joi.array().items(Joi.string()).messages({
    "array.empty": "Content is required",
  }),
  text_content: Joi.string().messages({
    "string.empty": "Text content is required",
    "any.required": "Text content is required",
  }),
  video_url: Joi.string().messages({
    "string.empty": "Video URL is required",
    "any.required": "Video URL is required",
  }),
  audio_url: Joi.string().messages({
    "string.empty": "Audio URL is required",
    "any.required": "Audio URL is required",
  }),
});

export { validateCreateLessionSchema, validateUpdateLessionSchema };
