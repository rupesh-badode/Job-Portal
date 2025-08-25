import express from "express";
import Job from "../models/Job.js";

const router = express.Router();

// ✅ Create job (HR only)
router.post("/", async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Get all jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().populate("postedBy", "name email");
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
