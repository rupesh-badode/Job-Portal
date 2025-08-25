import express from "express";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ✅ HR Dashboard Stats
router.get("/stats", authMiddleware, checkRole("hr"), async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments({ postedBy: req.user.id });
    const activeJobs = await Job.countDocuments({ postedBy: req.user.id, status: "active" });
    const totalApplications = await Application.countDocuments({ jobId: { $in: await Job.find({ postedBy: req.user.id }).distinct("_id") } });
    const shortlisted = await Application.countDocuments({ jobId: { $in: await Job.find({ postedBy: req.user.id }).distinct("_id") }, status: "shortlisted" });
    const rejected = await Application.countDocuments({ jobId: { $in: await Job.find({ postedBy: req.user.id }).distinct("_id") }, status: "rejected" });

    res.json({ totalJobs, activeJobs, totalApplications, shortlisted, rejected });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ HR’s Jobs List
router.get("/jobs", authMiddleware, checkRole("hr"), async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get Applicants for a Job
router.get("/jobs/:jobId/applicants", authMiddleware, checkRole("hr"), async (req, res) => {
  try {
    const applications = await Application.find({ jobId: req.params.jobId })
      .populate("applicantId", "name email");
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update Applicant Status (shortlist/reject)
router.patch("/applications/:id", authMiddleware, checkRole("hr"), async (req, res) => {
  try {
    const app = await Application.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(app);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
