import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    companyName: { type: String },   // match your frontend
    companyLink: { type: String },   // optional
    requiredSkills: { type: String },
    city: { type: String },
    state: { type: String },
    jobType: { type: String },
    salary: { type: String },
    location: { type: String },      // optional, if you still use it
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    hrId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // 👈 FIXED
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
