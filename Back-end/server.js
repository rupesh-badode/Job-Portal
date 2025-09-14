import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import adminRoutes from "./routes/adminRoutes.js";
import hr from "./routes/hr.js";
import userRoutes from "./routes/userRoutes.js";
import job from "./routes/job.js";

    
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



app.use("/api/users", userRoutes);
app.use("/api/jobs", job);
app.use("/api/hr", hr);
app.use("/api/admin",adminRoutes);  


// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} || http://localhost:${PORT}`));
