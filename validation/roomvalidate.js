const Joi = require("joi");

const createRoomSchema = Joi.object({
  roomNumber: Joi.string().required(),
  roomType: Joi.string().valid("Single", "Double", "Triple", "Quad").required(),
  description: Joi.string().optional(),
  pricePerNight: Joi.number().positive().required(),
  status: Joi.string().valid("available", "booked", "maintenance").required(),
  amenities: Joi.array().items(Joi.string()).optional(),
  images: Joi.array().items(Joi.string().uri()).optional(),
});

module.exports = { createRoomSchema };
