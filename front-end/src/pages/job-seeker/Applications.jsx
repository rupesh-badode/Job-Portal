import { useEffect, useState } from "react";
import API from "../../api";

export default function Applications() {
  const [applications, setApplications] = useState([]);
  useEffect(() => {
    API.get("/applications") // <-- your backend route
      .then((res) => setApplications(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Job Applications</h1>
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
          {applications.map((app) => (
            <tr key={app._id}>
              <td className="border p-2">{app.jobId?.title}</td>
              <td className="border p-2">{app.jobId?.companyName}</td>
              <td className="border p-2">{app.userId?.name}</td>
              <td className="border p-2">{app.userId?.email}</td>
              <td className="border p-2">{app.status}</td>
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
