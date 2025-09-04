import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  const token = localStorage.getItem("token");

  // Agar token hai toh /login or /register pe access nahi milega
  if (token) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.role === "ROLE_ADMIN") return <Navigate to="/dashboard/admin" replace />;
    if (user?.role === "ROLE_HR") return <Navigate to="/dashboard/hr" replace />;
    if (user?.role === "ROLE_JOBSEEKER") return <Navigate to="/dashboard/user" replace />;
  }

  return children;
}
