import express from "express";
import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ✅ Approve HR
router.patch("/approve-hr/:id", authMiddleware, checkRole("admin"), async (req, res) => {
  try {
    const hr = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    res.json(hr);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all HRs
router.get("/hrs", authMiddleware, checkRole("admin"), async (req, res) => {
  try {
    const hrs = await User.find({ role: "hr" });
    res.json(hrs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all jobseekers
router.get("/jobseekers", authMiddleware, checkRole("admin"), async (req, res) => {
  try {
    const seekers = await User.find({ role: "jobseeker" });
    res.json(seekers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Analytics
router.get("/analytics", authMiddleware, checkRole("admin"), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalHRs = await User.countDocuments({ role: "hr" });
    const totalSeekers = await User.countDocuments({ role: "jobseeker" });
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: "active" });
    const totalApplications = await Application.countDocuments();

    res.json({
      totalUsers,
      totalHRs,
      totalSeekers,
      totalJobs,
      activeJobs,
      totalApplications
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Deactivate user
router.patch("/deactivate-user/:id", authMiddleware, checkRole("admin"), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: false },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
