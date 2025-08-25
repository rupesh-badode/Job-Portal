import express from "express";
import Job from "../models/Job.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ✅ HR can post jobs
router.post("/", authMiddleware, checkRole("hr"), async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, postedBy: req.user.id });
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Everyone can view jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().populate("postedBy", "name email");
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ HR can update job
router.patch("/:id", authMiddleware, checkRole("hr"), async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
