
import { useEffect, useState } from "react";
import API from "../../api";
import { Switch } from "@headlessui/react";
import { User, CheckCircle } from "lucide-react";



export default function ApplicationManage() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  // ✅ Fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await API.get("/hr/jobs"); // Your HR jobs endpoint
        setJobs(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchJobs();
  }, []);

  // ✅ Toggle job status
  const toggleStatus = async (jobId, currentStatus) => {
    try {
      await API.put(`/hr/jobs/${jobId}/status`, { active: !currentStatus });
      setJobs((prev) =>
        prev.map((job) =>
          job._id === jobId ? { ...job, active: !currentStatus } : job
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Shortlist candidate
  const handleShortlist = async (jobId, applicantId) => {
    try {
      await API.post(`/hr/jobs/${jobId}/shortlist`, { applicantId });
      alert("Applicant shortlisted!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-6 p-6 pt-20">
      {/* Left Panel */}
      <div className="col-span-1 bg-white shadow rounded-2xl p-4">
        <h2 className="text-xl font-bold mb-4">Jobs Posted</h2>
        <ul className="space-y-3">
          {jobs.map((job) => (
            <li
              key={job._id}
              className={`p-3 rounded-xl cursor-pointer border ${
                selectedJob?._id === job._id
                  ? "bg-blue-50 border-blue-400"
                  : "bg-gray-50 border-gray-200"
              }`}
              onClick={() => setSelectedJob(job)}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{job.title}</span>
                <Switch
                  checked={job.active}
                  onChange={() => toggleStatus(job._id, job.active)}
                  className={`${
                    job.active ? "bg-green-500" : "bg-gray-400"
                  } relative inline-flex h-6 w-11 items-center rounded-full`}
                >
                  <span
                    className={`${
                      job.active ? "translate-x-6" : "translate-x-1"
                    } inline-block h-4 w-4 transform rounded-full bg-white`}
                  />
                </Switch>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Panel */}
      <div className="col-span-2 bg-white shadow rounded-2xl p-4">
        {selectedJob ? (
          <>
            <h2 className="text-xl font-bold mb-4">
              Applicants for: {selectedJob.title}
            </h2>
            {selectedJob.applicants?.length > 0 ? (
              <ul className="space-y-3">
                {selectedJob.applicants.map((app) => (
                  <li
                    key={app._id}
                    className="flex items-center justify-between p-3 border rounded-xl"
                  >
                    <div className="flex items-center space-x-3">
                      <User className="w-6 h-6 text-gray-600" />
                      <span>{app.name}</span>
                    </div>
                    <button
                      onClick={() => handleShortlist(selectedJob._id, app._id)}
                      className="flex items-center px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" /> Shortlist
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No applicants yet.</p>
            )}
          </>
        ) : (
          <p className="text-gray-500">Select a job to view applicants.</p>
        )}
      </div>
    </div>
  );
}