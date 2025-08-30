import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
      type: String, 
      enum: ["customer", "admin"], 
      default: "customer" 
    },
    status: { 
      type: String, 
      enum: ["active", "inactive", "suspended"], 
      default: "active" 
    },
    phone: { type: String },
    address: { type: String },
    profileImage: { type: String },
  },
  { timestamps: true }
);

export default model("User", userSchema);
