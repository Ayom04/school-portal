import Joi from "joi";

const validateCreateLessonSchema = Joi.object({
  topic: Joi.string().required().messages({
    "string.empty": "Topic is required",
    "any.required": "Topic is required",
  }),
  description: Joi.string().messages({
    "string.empty": "Description is required",
    "any.required": "Description is required",
  }),
  content: Joi.array().items(Joi.string()).required().messages({
    "array.empty": "Content is required",
    "any.required": "Content is required",
  }),
  text_content: Joi.string().required().messages({
    "string.empty": "Text content is required",
    "any.required": "Text content is required",
  }),
  video_url: Joi.string().required().messages({
    "string.empty": "Video URL is required",
    "any.required": "Video URL is required",
  }),
  audio_url: Joi.string().messages({
    "string.empty": "Audio URL is required",
    "any.required": "Audio URL is required",
  }),
  term: Joi.number().valid(1, 2, 3).required().messages({
    "string.empty": "Term is required",
    "any.required": "Term is required",
  }),
});
const validateUpdateLessonSchema = Joi.object({
  topic: Joi.string().messages({
    "string.empty": "Topic is required",
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
  term: Joi.number().valid(1, 2, 3).messages({
    "string.empty": "Term is required",
    "any.required": "Term is required",
  }),
});

export { validateCreateLessonSchema, validateUpdateLessonSchema };
