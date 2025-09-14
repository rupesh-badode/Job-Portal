// HrJobManagement.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit } from "lucide-react";
import API from "../../api"; // ✅ your axios instance

export default function JobManagement() {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [applicants, setApplicants] = useState({});
  const [expandedJobId, setExpandedJobId] = useState(null);
  // ✅ Update your formData to include all fields
  const [formData, setFormData] = useState({
  title: "",
  companyName: "",
  companyLink: "",
  description: "",
  requiredSkills: "",
  city: "",
  state: "",
  jobType: "",
  salary: "",
  });

  
  // ✅ Fetch jobs + stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, statsRes] = await Promise.all([
          API.get("/hr/jobs"),
          API.get("/hr/stats"),
        ]);
        setJobs(jobsRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // ✅ Fetch applicants for a specific job
  const fetchApplicants = async (jobId) => {
    try {
      const res = await API.get(`/hr/jobs/${jobId}/applicants`);
      setApplicants((prev) => ({ ...prev, [jobId]: res.data }));
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Update applicant status
  const handleStatusChange = async (appId, status, jobId) => {
    try {
      await API.patch(`/hr/applications/${appId}`, { status });
      fetchApplicants(jobId); // refresh list
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Handle form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Create / Update Job
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingJob) {
        const res = await API.patch(`/hr/jobs/${editingJob._id}`, formData);
        setJobs((prev) => prev.map((job) => (job._id === editingJob._id ? res.data : job)));
        alert("Job updated successfully!");
      } else {
        const res = await API.post("/hr/jobs", formData);
        setJobs((prev) => [...prev, res.data]);
        alert("Job posted successfully!");
      }
      setFormData({ title: "", description: "", location: "" });
      setEditingJob(null);
      setShowForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Delete Job
  const handleDelete = async (jobId) => {
    try {
      await API.delete(`/hr/jobs/${jobId}`);
      setJobs((prev) => prev.filter((job) => job._id !== jobId));
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Open Edit Modal
  const handleEdit = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      description: job.description,
      location: job.location,
      companyName: job.companyName || "",
      companyLink: job.companyLink || "", 
      requiredSkills: job.requiredSkills || "",
      city: job.city || "",
      state: job.state || "",
      jobType: job.jobType || "",
      salary: job.salary || "", 
    });
    setShowForm(true);
  };

  return (
    <div className="p-6 pt-20">
      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="bg-white shadow rounded-2xl p-4 text-center">
            <h2 className="font-bold text-xl">{value}</h2>
            <p className="text-gray-500 text-sm capitalize">{key}</p>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Jobs</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" /> Post Job
        </button>
      </div>

      {/* Job List */}
      <AnimatePresence>
        {jobs.length > 0 ? (
          <motion.ul layout className="space-y-4">
            {jobs.map((job) => (
              <motion.li
                key={job._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl p-6 shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto"
              >
                <h2 className="font-semibold text-lg">{job.title}</h2>
                <p className="text-sm text-gray-600">{job.description}</p>
                <p className="text-xs text-gray-500 mt-1">{job.location}</p>

                {/* Actions */}
                <div className="flex justify-end gap-2 mt-3">
                  <button
                    onClick={() => handleEdit(job)}
                    className="p-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(job._id)}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setExpandedJobId(job._id === expandedJobId ? null : job._id);
                      fetchApplicants(job._id);
                    }}
                    className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    View Applicants
                  </button>
                </div>

                {/* Applicants Section */}
                {expandedJobId === job._id && applicants[job._id] && (
                  <div className="mt-4 bg-gray-50 p-3 rounded-lg">
                    <h3 className="font-semibold mb-2">Applicants:</h3>
                    {applicants[job._id].length > 0 ? (
                      applicants[job._id].map((app) => (
                        <div
                          key={app._id}
                          className="flex justify-between items-center bg-white shadow-sm rounded-lg p-2 mb-2"
                        >
                          <div>
                            <p className="font-medium">{app.applicantId?.name}</p>
                            <p className="text-xs text-gray-500">{app.applicantId?.email}</p>
                            <p className="text-xs mt-1">Status: {app.status}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleStatusChange(app._id, "shortlisted", job._id)}
                              className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                              Shortlist
                            </button>
                            <button
                              onClick={() => handleStatusChange(app._id, "rejected", job._id)}
                              className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No applicants yet.</p>
                    )}
                  </div>
                )}
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <p className="text-gray-500">No jobs posted yet.</p>
        )}
      </AnimatePresence>

      {/* Modal Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg w-full max-w-md"
            >
              <h2 className="text-xl font-bold mb-4">
                {editingJob ? "Edit Job" : "Post New Job"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Job Title"
                className="w-full p-2 border rounded-lg"
                required
              />
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Company Name"
                className="w-full p-2 border rounded-lg"
                required
              />
              <input
                type="text"
                name="companyLink"
                value={formData.companyLink}
                onChange={handleChange}
                placeholder="Company Link"
                className="w-full p-2 border rounded-lg"
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Job Description"
                className="w-full p-2 border rounded-lg"
                required
              />
              <input
                type="text"
                name="requiredSkills"
                value={formData.requiredSkills}
                onChange={handleChange}
                placeholder="Required Skills"
                className="w-full p-2 border rounded-lg"
                required
              />
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className="w-full p-2 border rounded-lg"
                required
              />
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                className="w-full p-2 border rounded-lg"
                required
              />
              <input
                type="text"
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                placeholder="Job Type (Full-time, Part-time, Remote)"
                className="w-full p-2 border rounded-lg"
                required
              />
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="Salary"
                className="w-full p-2 border rounded-lg"
              />

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingJob(null);
                    setFormData({
                      title: "",
                      companyName: "",
                      companyLink: "",
                      description: "",
                      requiredSkills: "",
                      city: "",
                      state: "",
                      jobType: "",
                      salary: "",
                    });
                  }}
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingJob ? "Update" : "Create"}
                </button>
              </div>
            </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
