// JobPage.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, MapPin, User, Building2, Link, DollarSign } from "lucide-react";
import API from "../api";


function JobCard({ job, onApply }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow rounded-2xl p-5 flex flex-col gap-3 border"
    >
      <h2 className="text-lg font-bold flex items-center gap-2">
        <Briefcase className="w-5 h-5 text-blue-600" /> {job.title}
      </h2>

      <p className="text-gray-600 text-sm line-clamp-2">{job.description}</p>

      <div className="flex items-center gap-2 text-sm">
        <Building2 className="w-4 h-4 text-green-600" />
        <a
          href={job.companyLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {job.companyName}
        </a>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <MapPin className="w-4 h-4 text-red-600" />
        {job.city}, {job.state}
      </div>

      <div className="flex items-center gap-2 text-sm">
        <User className="w-4 h-4 text-purple-600" /> {job.jobType}
      </div>

      <div className="flex items-center gap-2 text-sm">
        <DollarSign className="w-4 h-4 text-yellow-600" /> {job.salary}
      </div>

      <p className="text-sm text-gray-500">
        <strong>Skills:</strong> {job.requiredSkills}
      </p>

      <p className="text-xs text-gray-400">
        Posted on: {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "N/A"}
      </p>

      {/* ✅ Apply Button inside job card */}
      <button
        onClick={() => onApply(job._id)}
        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Apply
      </button>
    </motion.div>
  );
}

// --- Main Page ---
export default function JobPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;

  // Filters & search
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedTech, setSelectedTech] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    API.get(`/jobs`)
      .then((res) => setJobs(res.data.jobs || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // ✅ Apply handler
  const handleApply = async (jobId) => {
    try {
      const res = await API.post(`/jobs/apply/${jobId}`);
      alert(res.data.message || "Applied successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to apply");
    }
  };

  // ✅ Filters
  const filteredJobs = jobs.filter((job) => {
    return (
      job.status === "active" &&
      (selectedCity ? job.city === selectedCity : true) &&
      (selectedTech
        ? job.requiredSkills.toLowerCase().includes(selectedTech.toLowerCase())
        : true) &&
      (searchTerm
        ? job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase())
        : true)
    );
  });

  const indexOfLast = currentPage * jobsPerPage;
  const indexOfFirst = indexOfLast - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  if (loading) return <p className="text-center mt-20">Loading jobs...</p>;

  return (
    <div className="flex min-h-screen bg-gray-50 mt-20">
      {/* --- Left Panel Filters --- */}
      <aside className="w-64 bg-white p-6 border-r hidden md:block">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>

        {/* City Filter */}
        <div className="mb-6">
          <label className="block font-medium mb-2">City</label>
          <select
            className="w-full border rounded p-2"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="">All</option>
            <option value="Indore">Indore</option>
            <option value="Bhopal">Bhopal</option>
            <option value="Mumbai">Mumbai</option>
            <option value="khandwa">Khandwa</option>
          </select>
        </div>

        {/* Technology Filter */}
        <div>
          <label className="block font-medium mb-2">Skills</label>
          <select
            className="w-full border rounded p-2"
            value={selectedTech}
            onChange={(e) => setSelectedTech(e.target.value)}
          >
            <option value="">All</option>
            <option value="React">React</option>
            <option value="Node.js">Node.js</option>
            <option value="Java">Java</option>
            <option value="Python">Python</option>
            <option value="Spring Boot">Spring Boot</option>
          </select>
        </div>
      </aside>

      {/* --- Job Cards Grid --- */}
      <main className="flex-1 p-6">
        {/* 🔍 Search Bar */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Job Listings</h1>
          <input
            type="text"
            placeholder="Search jobs..."
            className="border p-2 rounded w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {currentJobs.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {currentJobs.map((job) => (
              <JobCard key={job._id} job={job} onApply={handleApply} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No jobs found.</p>
        )}

        {/* --- Pagination --- */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
