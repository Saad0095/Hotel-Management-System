import { Schema, model } from "mongoose";

const bookingSchema = new Schema(
  {
    room: { type: Schema.Types.ObjectId, ref: "Room" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    extraServices: { type: Schema.Types.ObjectId, ref: "Service" },
  },
  { timestamps: true }
);

export default model("Booking", bookingSchema);
