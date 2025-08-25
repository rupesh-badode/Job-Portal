import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
  applicantId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["pending", "shortlisted", "rejected"], default: "pending" }
}, { timestamps: true });

export default mongoose.model("Application", applicationSchema);
