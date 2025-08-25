import express from "express";
import Application from "../models/Application.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ✅ Jobseeker applies to job
router.post("/", authMiddleware, checkRole("jobseeker"), async (req, res) => {
  try {
    const application = await Application.create({
      jobId: req.body.jobId,
      applicantId: req.user.id
    });
    res.status(201).json(application);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Jobseeker views own applications
router.get("/my", authMiddleware, checkRole("jobseeker"), async (req, res) => {
  try {
    const apps = await Application.find({ applicantId: req.user.id })
      .populate("jobId");
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ HR sees applicants for their job
router.get("/job/:jobId", authMiddleware, checkRole("hr"), async (req, res) => {
  try {
    const apps = await Application.find({ jobId: req.params.jobId })
      .populate("applicantId", "name email");
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
