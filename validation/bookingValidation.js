import Joi from "joi";

export const createBookingSchema = Joi.object({
  checkInDate: Joi.date().greater("now").required(),
  checkOutDate: Joi.date().greater(Joi.ref("checkInDate")).required(),
  totalPrice: Joi.number().positive().required(),
  status: Joi.string()
    .valid("pending", "confirmed", "checked-in", "checked-out", "cancelled")
    .default("confirmed"),
});
