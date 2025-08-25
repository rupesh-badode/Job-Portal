import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import adminRoutes from "./routes/adminRoutes.js";
import hrRoutes from "./routes/hrRoute.js";
import jobseekerRoutes from "./routes/jobseekerRoutes.js";

    
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Job Portal API is running...");
});

// ✅ Import routes
import userRoutes from "./routes/userRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";

app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/jobseeker", jobseekerRoutes);
app.use("/api/hr", hrRoutes);
app.use("/api/admin",adminRoutes);


// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} || http://localhost:${PORT}`));
