import { useEffect, useState } from "react";
import API from "../../api";

export default function HrDashboard() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    API.get("/hr/applications")
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err));
  }, []);

  

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Applications Summary</h1>
      <ul className="space-y-3">
        {stats.map((item) => (
          <li
            key={item._id._id}
            className="p-4 border rounded-lg flex justify-between items-center bg-white shadow"
          >
            <span>
              <strong>{item._id.title}</strong> @ {item._id.companyName}
            </span>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              {item.count} applied
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
