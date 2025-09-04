import Joi from "joi";
import mongoose from "mongoose";

const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

export const bookingSchema = Joi.object({
  rooms: Joi.array()
    .items(
      Joi.alternatives().try(
        Joi.string().custom(objectId),
        Joi.object({ _id: Joi.string().custom(objectId).required() })
      )
    )
    .min(1)
    .required(),

  customerId: Joi.string().custom(objectId).optional(),

  extraServices: Joi.array().items(
    Joi.alternatives().try(
      Joi.string().custom(objectId),
      Joi.object({ _id: Joi.string().custom(objectId).required() })
    )
  ),

  checkInDate: Joi.date().min('now').required(),
  checkOutDate: Joi.date().greater(Joi.ref("checkInDate")).required(),

  status: Joi.string()
    .valid("pending", "confirmed", "checked-in", "checked-out", "cancelled")
    .default("confirmed"),
});
