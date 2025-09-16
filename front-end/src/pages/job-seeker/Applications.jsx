import { useEffect, useState } from "react";
import API from "../../api";

export default function Applications() {
  const [applications, setApplications] = useState([]);
  console.log(applications);

  useEffect(() => {
    API.get("/applications") // <-- backend must return jobId, userId populated
      .then((res) => setApplications(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Only shortlisted or rejected
  const filteredApps = applications.filter(
    (app) => app.status === "shortlisted" || app.status === "rejected"
  );

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Reviewed Applications</h1>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Job Title</th>
            <th className="border p-2">Company</th>
            <th className="border p-2">Applicant</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Applied At</th>
          </tr>
        </thead>
        <tbody>
          {filteredApps.map((app) => (
            <tr key={app._id}>
              <td className="border p-2">{app.jobId?.title}</td>
              <td className="border p-2">{app.jobId?.companyName}</td>
              <td className="border p-2">{app.applicantId?.name}</td>
              <td className="border p-2">{app.applicantId?.email}</td>
              <td
                className={`border p-2 font-semibold ${
                  app.status === "shortlisted"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {app.status}
              </td>
              <td className="border p-2">
                {new Date(app.appliedAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
