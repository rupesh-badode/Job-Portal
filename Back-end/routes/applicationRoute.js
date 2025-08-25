import express from "express";
import Application from "../models/Application.js";

const router = express.Router();

// ✅ Apply to job
router.post("/", async (req, res) => {
  try {
    const application = await Application.create(req.body);
    res.status(201).json(application);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Get my applications
router.get("/my/:userId", async (req, res) => {
  try {
    const apps = await Application.find({ applicantId: req.params.userId })
      .populate("jobId");
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
