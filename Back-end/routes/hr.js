import express from "express";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";
import Notification from "../models/Notification.js";

const router = express.Router();

// ✅ Dashboard stats
router.get("/stats", authMiddleware, checkRole("ROLE_HR"), async (req, res) => {
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

// ✅ HR: List own jobs with applicant count
router.get("/jobs", authMiddleware, checkRole("ROLE_HR"), async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id });
    // For each job, count applicants
    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const applicantCount = await Application.countDocuments({ jobId: job._id });
        return {
          ...job.toObject(),
          applicantCount,
        };
      })
    );

    res.json(jobsWithCounts);
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

// ✅ Get applicants for a job
router.get("/jobs/:jobId/applicants", async (req, res) => {
  try {
    const { jobId } = req.params;
    const applicants = await Application.find({ jobId })
    .populate("applicantId", "name email"); // 👈 get applicant details
    res.json(applicants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch applicants" });
  }
});


// ✅ Update job status (use "status" field)
router.put("/jobs/:id/status", authMiddleware, checkRole("ROLE_HR"), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // validate
    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // ownership check (optional — keep if you want only creator to edit)
    if (job.postedBy && job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    job.status = status;
    await job.save();

    return res.json({ message: "Job status updated", job });
  } catch (err) {
    console.error("Error updating job status:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});


// routes/hrRoute.js

router.patch("/applications/:id", authMiddleware, checkRole("hr"), async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("applicantId");

    // ✅ Create notification
    let message = "";
    if (status === "shortlisted") {
      message = `Congratulations! You have been shortlisted for ${application.jobId.title}`;
    } else if (status === "rejected") {
      message = `We’re sorry! Your application for ${application.jobId.title} has been rejected.`;
    }

    await Notification.create({
      userId: application.applicantId._id,
      message,
    });

    res.json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// ✅ Update applicant status
router.patch("/applications/:appId", async (req, res) => {
  try {
    const { appId } = req.params;
    const { status } = req.body;

    const application = await Application.findByIdAndUpdate(
      appId,
      { status },
      { new: true }
    ).populate("applicantId", "name email");

    res.json(application);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update status" });
  }
});

export default router;
