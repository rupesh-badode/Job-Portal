import { useEffect, useState } from "react";
import API from "../../api";

export default function Applications() {
  const [applications, setApplications] = useState([]);

  // ✅ Fetch applications
  useEffect(() => {
    API.get("/jobs/applications")
      .then((res) => {
        setApplications(res.data.applications || res.data || []);
      })
      .catch((err) => console.error(err));
  }, []);

  // ✅ Delete application notification
  const handleDelete = async (id) => {
    try {
      await API.delete(`jobs/applications/${id}`);
      setApplications((prev) => prev.filter((app) => app._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Only shortlisted or rejected
  const filteredApps = applications.filter(
    (app) => app.status === "shortlisted" || app.status === "rejected"
  );

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Notifications</h1>
      {filteredApps.length === 0 ? (
        <p>No new notifications</p>
      ) : (
        <ul className="space-y-3">
          {filteredApps.map((app) => (
            <li
              key={app._id}
              className="p-4 border rounded bg-gray-50 flex justify-between items-center"
            >
              <div>
                ✅ Your application for
                <span className="font-semibold"> {app.jobId?.title}</span> at
                <span className="font-semibold"> {app.jobId?.companyName}</span>
                has been{" "}
                <span
                  className={`font-semibold ${
                    app.status === "shortlisted"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {app.status}
                </span>.
              </div>
              <button
                onClick={() => handleDelete(app._id)}
                className="ml-4 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
