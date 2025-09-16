import { useEffect, useState } from "react";
import API from "../../api";
import { Switch } from "@headlessui/react";
import { User, CheckCircle ,XCircle} from "lucide-react";

export default function ApplicationManage() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);

  // ✅ Fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await API.get("/hr/jobs");
        setJobs(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchJobs();
  }, []);

  // ✅ Fetch applicants for a job
  const fetchApplicants = async (jobId) => {
    try {
      const res = await API.get(`/hr/jobs/${jobId}/applicants`);
      setApplicants(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Handle job click
  const handleJobClick = (job) => {
    setSelectedJob(job);
    fetchApplicants(job._id);
  };

  // ✅ Toggle job status (fixed)
  const toggleStatus = async (jobId, currentStatus) => {
    try {
      // correct ternary — check the currentStatus string directly
      const newStatus = currentStatus === "active" ? "inactive" : "active";

      // call backend (expecting backend to accept { status: "active"|"inactive" })
      const res = await API.put(`/hr/jobs/${jobId}/status`, { status: newStatus });

      // prefer server's returned job.status if available, otherwise use newStatus
      const updatedStatus = res?.data?.job?.status ?? res?.data?.status ?? newStatus;

      // update jobs list
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job._id === jobId ? { ...job, status: updatedStatus } : job
        )
      );

      // also update selectedJob if it's the same job (so right panel reflects change)
      setSelectedJob((prev) =>
        prev && prev._id === jobId ? { ...prev, status: updatedStatus } : prev
      );
    } catch (error) {
      console.error("Error updating job status:", error);
      // optional: show toast/error UI instead of just console.error
    }
  };


  // ✅ Shortlist candidate
  const handleShortlist = async (appId) => {
    try {
      await API.patch(`/hr/applications/${appId}`, { status: "shortlisted" });
      setApplicants((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, status: "shortlisted" } : a))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Reject candidate
  const handleReject = async (appId) => {
    try {
      await API.patch(`/hr/applications/${appId}`, { status: "rejected" });
      setApplicants((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, status: "rejected" } : a))
      );
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
              onClick={() => handleJobClick(job)}
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-medium">{job.title}</span>
                  <span className="text-sm text-gray-500">
                    {job.applicantCount} applied
                  </span>
                </div>
                <Switch
                  checked={job.status === "active"}
                  onChange={() => toggleStatus(job._id, job.status)}
                  className={`${
                    job.status === "active" ? "bg-green-500" : "bg-gray-400"
                  } relative inline-flex h-6 w-11 items-center rounded-full`}
                >
                  <span
                    className={`${
                      job.status === "active" ? "translate-x-6" : "translate-x-1"
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
              Applicants for {selectedJob.title}
            </h2>
            {applicants.length > 0 ? (
              <ul className="space-y-3">
                {applicants.map((app) => (
                  <li
                    key={app._id}
                    className="flex items-center justify-between p-3 border rounded-xl"
                  >
                    <div className="flex items-center space-x-3">
                      <User className="w-6 h-6 text-gray-600" />
                      <div>
                        <p className="font-medium">{app.applicantId.name}</p>
                        <p className="text-sm text-gray-500">
                          {app.applicantId.email}
                        </p>
                        <p className="text-xs text-gray-400">
                          Status: {app.status}
                        </p>
                        <p className="text-xs text-gray-400">
                          Applied on:{" "}
                          {new Date(app.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
          

                    <button
                      disabled={app.status === "shortlisted"}
                      onClick={() => handleShortlist(app._id)}
                      className={`flex items-center px-3 py-1 rounded-lg ${
                        app.status === "shortlisted"
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "bg-green-500 text-white hover:bg-green-600"
                      }`}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" /> Shortlist
                    </button>
                    <button
                      disabled={app.status === "rejected"}
                      onClick={() => handleReject(app._id)}
                      className={`flex items-center px-3 py-1 rounded-lg ${
                        app.status === "rejected"
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "bg-red-500 text-white hover:bg-red-600"
                      }`}
                    >
                      <XCircle className="w-4 h-4 mr-1" /> Reject
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
