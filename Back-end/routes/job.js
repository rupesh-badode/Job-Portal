import express from "express";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ✅ Public: Browse jobs
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", location } = req.query;
    const query = {
      status: "active",
      title: { $regex: search, $options: "i" }
    };
    if (location) query.location = { $regex: location, $options: "i" };

    const jobs = await Job.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(query);

    res.json({
      jobs,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Jobseeker: Apply to a job
router.post("/apply/:jobId", authMiddleware, checkRole("ROLE_JOBSEEKER"), async (req, res) => {
  try {
    const existing = await Application.findOne({
      jobId: req.params.jobId,
      applicantId: req.user.id
    });

    if (existing) return res.status(400).json({ error: "Already applied" });

    const application = await Application.create({
      jobId: req.params.jobId,
      applicantId: req.user.id
    });

    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Jobseeker: View own applications
router.get("/applications", authMiddleware, checkRole("ROLE_JOBSEEKER"), async (req, res) => {
  try {
    const apps = await Application.find({ applicantId: req.user.id })
      .populate("jobId", "title companyName city state jobType status")
      .populate("applicantId", "name email");
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
