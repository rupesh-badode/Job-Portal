import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  company: { type: String },
  location: { type: String },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["active", "inactive"], default: "active" }
}, { timestamps: true });

export default mongoose.model("Job", jobSchema);
