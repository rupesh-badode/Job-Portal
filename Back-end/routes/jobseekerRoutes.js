import express from "express";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/jobs", authMiddleware, async (req, res) => {
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

// ✅ Apply to a Job
router.post("/apply/:jobId", authMiddleware, checkRole("jobseeker"), async (req, res) => {
  try {
    // check if already applied
    const existing = await Application.findOne({
      jobId: req.params.jobId,
      applicantId: req.user.id
    });

    if (existing) {
      return res.status(400).json({ error: "Already applied to this job" });
    }

    const application = await Application.create({
      jobId: req.params.jobId,
      applicantId: req.user.id
    });

    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Track Applications
router.get("/applications", authMiddleware, checkRole("jobseeker"), async (req, res) => {
  try {
    const apps = await Application.find({ applicantId: req.user.id })
      .populate("jobId", "title company location status");
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
