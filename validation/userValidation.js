import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("customer", "receptionist", "admin").default("customer"),
  status: Joi.string().valid("active", "inactive", "suspended").default("active"),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).required(), 
  address: Joi.string().allow("", null),
  profileImage: Joi.string().uri().optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().required(),
});
