import { Schema, model } from "mongoose";

const roomSchema = new Schema(
  {
    roomNumber: { type: String, required: true, unique: true },
    roomType: { type: String, enum: ["Single", "Double", "Triple", "Quad"] },
    description: { type: String },
    pricePerNight: { type: Number, required: true },
    status: {
      type: String,
      enum: ["available", "booked", "maintenance"],
      default: "available",
    },
    amenities: [{type: String}],
    images: [{type: String}],
  },
  { timestamps: true }
);

export default model("Room", roomSchema);
