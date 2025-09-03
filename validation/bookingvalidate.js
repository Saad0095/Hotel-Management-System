const Joi = require("joi");

const createBookingSchema = Joi.object({
  userId: Joi.string().required(),
  roomId: Joi.string().required(),
  checkInDate: Joi.date().required(),
  checkOutDate: Joi.date().required(),
  guests: Joi.number().min(1).required()
});

module.exports = { createBookingSchema };
