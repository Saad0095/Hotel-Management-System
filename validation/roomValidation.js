import Joi from "joi";

export const roomSchema = Joi.object({
  roomNumber: Joi.string().trim().required(),
  roomType: Joi.string().valid("Single", "Double", "Triple", "Quad").required(),
  description: Joi.string().allow("", null),
  pricePerNight: Joi.number().positive().required(),
  status: Joi.string().valid("available", "booked", "maintenance").default("available"),
  amenities: Joi.array().items(Joi.string()),
  images: Joi.array().items(Joi.string().uri()),
});
