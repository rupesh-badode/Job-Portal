import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Landing() {
  const { user } = useAuth();

  if (user) {
    if (user.role === "ROLE_ADMIN") return <Navigate to="/dashboard/admin" replace />;
    if (user.role === "ROLE_HR") return <Navigate to="/dashboard/hr" replace />;
    if (user.role === "ROLE_JOBSEEKER") return <Navigate to="/dashboard/user" replace />;
  }

  // Public Landing Page (only for non-logged in users)
  return (
    <section className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center p-6">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">
        Welcome to JobPortal 🚀
      </h1>
      <p className="text-lg md:text-xl max-w-2xl mb-8">
        Find your dream job or hire top talent. Join us today and explore
        thousands of opportunities tailored just for you.
      </p>

      <div className="space-x-4">
        <a
          href="/login"
          className="bg-white text-blue-600 px-6 py-3 rounded-xl shadow-md hover:bg-gray-100 font-semibold transition"
        >
          Login
        </a>
        <a
          href="/register"
          className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl shadow-md hover:bg-yellow-500 font-semibold transition"
        >
          Register
        </a>
      </div>
    </section>
  );
}
