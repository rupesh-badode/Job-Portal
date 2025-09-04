import { useEffect, useState } from "react";

export default function JobseekerDashboard() {
  const [stats, setStats] = useState({
    totalApplied: 12,
    shortlisted: 5,
    rejected: 3,
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">My Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Applied */}
        <div className="rounded-2xl shadow-md bg-blue-50 p-6 text-center">
          <h2 className="text-xl font-semibold text-blue-700">Total Applied</h2>
          <p className="text-3xl font-bold mt-2">{stats.totalApplied}</p>
        </div>

        {/* Shortlisted */}
        <div className="rounded-2xl shadow-md bg-green-50 p-6 text-center">
          <h2 className="text-xl font-semibold text-green-700">Shortlisted</h2>
          <p className="text-3xl font-bold mt-2">{stats.shortlisted}</p>
        </div>

        {/* Rejected */}
        <div className="rounded-2xl shadow-md bg-red-50 p-6 text-center">
          <h2 className="text-xl font-semibold text-red-700">Rejected</h2>
          <p className="text-3xl font-bold mt-2">{stats.rejected}</p>
        </div>
      </div>
    </div>
  );
}
