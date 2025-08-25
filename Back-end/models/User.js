import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "hr", "jobseeker"], default: "jobseeker" },
  isApproved: { type: Boolean, default: true } // HRs need admin approval
}, { timestamps: true });

export default mongoose.model("User", userSchema);
