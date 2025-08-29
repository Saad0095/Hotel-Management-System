import { Schema, model } from "mongoose";

const serviceSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
});

export default model("Service", serviceSchema);
