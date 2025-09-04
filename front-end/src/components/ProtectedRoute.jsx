import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation(); // ✅ Correct hook use

  // If not logged in → go to login
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Prevent logged-in users from seeing login/register
  if (location.pathname === "/login" || location.pathname === "/register") {
    if (user.role === "ROLE_ADMIN") return <Navigate to="/dashboard/admin" replace />;
    if (user.role === "ROLE_HR") return <Navigate to="/dashboard/hr" replace />;
    return <Navigate to="/dashboard/user" replace />;
  }

  // Role check
  if (role && !role.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
