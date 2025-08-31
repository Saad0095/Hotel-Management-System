import { Schema, model } from "mongoose";

const bookingSchema = new Schema(
  {
    rooms: [{ type: Schema.Types.ObjectId, ref: "Room" }],
    user: { type: Schema.Types.ObjectId, ref: "User" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "checked-in", "checked-out", "cancelled"],
      default: "confirmed",
    },
    extraServices: [{ type: Schema.Types.ObjectId, ref: "Service" }],
  },
  { timestamps: true }
);

export default model("Booking", bookingSchema);
