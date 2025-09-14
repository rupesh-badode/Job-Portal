import express from "express";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ✅ Dashboard stats
router.get("/stats", authMiddleware, checkRole("hr"), async (req, res) => {
  try {
    const jobIds = await Job.find({ postedBy: req.user.id }).distinct("_id");

    const totalJobs = jobIds.length;
    const activeJobs = await Job.countDocuments({ postedBy: req.user.id, status: "active" });
    const totalApplications = await Application.countDocuments({ jobId: { $in: jobIds } });
    const shortlisted = await Application.countDocuments({ jobId: { $in: jobIds }, status: "shortlisted" });
    const rejected = await Application.countDocuments({ jobId: { $in: jobIds }, status: "rejected" });

    res.json({ totalJobs, activeJobs, totalApplications, shortlisted, rejected });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ HR: List own jobs
router.get("/jobs", authMiddleware, checkRole("ROLE_HR"), async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ HR: Post new job
router.post("/jobs", authMiddleware, checkRole("ROLE_HR"), async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, postedBy: req.user.id , hrId: req.user.id });
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ HR: Update job
router.patch("/jobs/:id", authMiddleware, checkRole("ROLE_HR"), async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ HR: Delete job
router.delete("/jobs/:id", authMiddleware, checkRole("ROLE_HR"), async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ HR: View applicants for a job
router.get("/jobs/:jobId/applicants", authMiddleware, checkRole("ROLE_HR"), async (req, res) => {
  try {
    const apps = await Application.find({ jobId: req.params.jobId })
      .populate("applicantId", "name email");
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ HR: Update applicant status
router.patch("/applications/:id", authMiddleware, checkRole("ROLE_HR"), async (req, res) => {
  try {
    const app = await Application.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(app);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
