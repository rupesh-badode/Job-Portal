import { useEffect, useState } from "react";
import API from "../../api";
import { motion } from "framer-motion";
import {
  Briefcase,
  CheckCircle,
  XCircle,
  ClipboardList,
  CircleDot,
  CircleOff,
} from "lucide-react";

export default function HRDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/hr/stats"); // ✅ backend should return all counts
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <p className="text-center mt-20">Loading dashboard...</p>;
  if (!stats) return <p className="text-center mt-20">No stats available</p>;

  const cards = [
    {
      title: "Total Jobs",
      value: stats.totalJobs,
      icon: Briefcase,
      color: "bg-blue-500",
    },
    {
      title: "Active Jobs",
      value: stats.activeJobs,
      icon: CircleDot,
      color: "bg-green-500",
    },
    {
      title: "Inactive Jobs",
      value: stats.inactiveJobs,
      icon: CircleOff,
      color: "bg-gray-500",
    },
    {
      title: "Total Applications",
      value: stats.totalApplications,
      icon: ClipboardList,
      color: "bg-purple-500",
    },
    {
      title: "Shortlisted",
      value: stats.shortlisted,
      icon: CheckCircle,
      color: "bg-yellow-500",
    },
    {
      title: "Rejected",
      value: stats.rejected,
      icon: XCircle,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8 pt-20">
      <h1 className="text-3xl font-bold mb-8">HR Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ title, value, icon: Icon, color }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white shadow rounded-2xl p-6 flex items-center gap-4"
          >
            <div
              className={`p-4 rounded-xl text-white ${color} flex items-center justify-center`}
            >
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">{title}</p>
              <h2 className="text-2xl font-bold">{value}</h2>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
