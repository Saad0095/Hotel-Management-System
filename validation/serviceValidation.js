import Joi from "joi";

export const serviceSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  price: Joi.number().positive().required(),
  description: Joi.string().allow("", null),
});
