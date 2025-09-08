import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { Menu, X, User, Settings, LogOut, Bell, MessageSquare } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const dashboardLinks = {
    ROLE_ADMIN: { path: "/dashboard/admin", label: "Admin" },
    ROLE_HR: { path: "/dashboard/hr", label: "HR" },
    ROLE_JOBSEEKER: { path: "/dashboard/user", label: "Dashboard" },
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-shadow ${
        isScrolled ? "shadow-lg" : ""
      } bg-gradient-to-r from-blue-600 to-indigo-700 text-white`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold tracking-wide">
            JobPortal
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            {!user ? (
              <>
                <Link to="/login" className="hover:text-yellow-300 transition">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-yellow-400 text-gray-900 px-4 py-1 rounded-lg font-medium hover:bg-yellow-500 transition"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                {/* Jobseeker Menu */}
                {user.role === "ROLE_JOBSEEKER" && (
                  <>
                    <Link to="/user-home" className="hover:text-yellow-300 transition">
                      Home
                    </Link>
                    <Link to="/dashboard/user" className="hover:text-yellow-300 transition">
                      Dashboard
                    </Link>
                    <Link to="/jobs" className="hover:text-yellow-300 transition">
                      Browse Jobs
                    </Link>
                    <Link to="/applications" className="hover:text-yellow-300 transition">
                      Applications
                    </Link>
                  </>
                )}

                {/* HR Menu */}
                {user.role === "ROLE_HR" && (
                  <>
                    <Link to="/dashboard/hr" className="hover:text-yellow-300 transition">
                      HR Dashboard
                    </Link>
                    <Link to="/post-job" className="hover:text-yellow-300 transition">
                      Post Job
                    </Link>
                    <Link to="/manage-applications" className="hover:text-yellow-300 transition">
                      Manage Applications
                    </Link>
                  </>
                )}

                {/* Admin Menu */}
                {user.role === "ROLE_ADMIN" && (
                  <>
                    <Link to="/dashboard/admin" className="hover:text-yellow-300 transition">
                      Admin Panel
                    </Link>
                    <Link to="/manage-users" className="hover:text-yellow-300 transition">
                      Manage Users
                    </Link>
                    <Link to="/all-jobs" className="hover:text-yellow-300 transition">
                      All Jobs
                    </Link>
                  </>
                )}

                {/* Notification & Message Icons (only for jobseeker) */}
                {user.role === "ROLE_JOBSEEKER" && (
                  <div className="flex items-center space-x-4">
                    <Link to="/notifications" className="hover:text-yellow-300 transition">
                      <Bell size={22} />
                    </Link>
                    <Link to="/messages" className="hover:text-yellow-300 transition">
                      <MessageSquare size={22} />
                    </Link>
                  </div>
                )}

                {/* Avatar Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-10 h-10 rounded-full bg-yellow-400 text-gray-900 font-bold flex items-center justify-center hover:ring-2 hover:ring-yellow-300 transition"
                  >
                    {user?.name
                      ? user.name.charAt(0).toUpperCase()
                      : user?.email?.charAt(0).toUpperCase()}
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg overflow-hidden z-50">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <User size={16} className="mr-2" /> Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-2 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Settings size={16} className="mr-2" /> Settings
                      </Link>
                      {dashboardLinks[user.role] && (
                        <Link
                          to={dashboardLinks[user.role].path}
                          className="flex items-center px-4 py-2 hover:bg-gray-100"
                          onClick={() => setDropdownOpen(false)}
                        >
                          {dashboardLinks[user.role].label}
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-left hover:bg-red-100 text-red-600"
                      >
                        <LogOut size={16} className="mr-2" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-700 px-6 py-4 space-y-4">
          {!user ? (
            <>
              <Link to="/login" className="block hover:text-yellow-300">
                Login
              </Link>
              <Link
                to="/register"
                className="block bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-yellow-500"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              {user.role === "ROLE_JOBSEEKER" && (
                <>
                  <Link to="/" className="block hover:text-yellow-300">
                    Home
                  </Link>
                  <Link to="/dashboard/user" className="block hover:text-yellow-300">
                    Dashboard
                  </Link>
                  <Link to="/jobs" className="block hover:text-yellow-300">
                    Browse Jobs
                  </Link>
                  <Link to="/applied-jobs" className="block hover:text-yellow-300">
                    Applied Jobs
                  </Link>
                  <Link to="/notifications" className="block hover:text-yellow-300">
                    Notifications
                  </Link>
                  <Link to="/messages" className="block hover:text-yellow-300">
                    Messages
                  </Link>
                </>
              )}

              {user.role === "ROLE_HR" && (
                <>
                  <Link to="/dashboard/hr" className="block hover:text-yellow-300">
                    HR Dashboard
                  </Link>
                  <Link to="/post-job" className="block hover:text-yellow-300">
                    Post Job
                  </Link>
                  <Link to="/manage-applications" className="block hover:text-yellow-300">
                    Manage Applications
                  </Link>
                </>
              )}

              {user.role === "ROLE_ADMIN" && (
                <>
                  <Link to="/dashboard/admin" className="block hover:text-yellow-300">
                    Admin Panel
                  </Link>
                  <Link to="/manage-users" className="block hover:text-yellow-300">
                    Manage Users
                  </Link>
                  <Link to="/all-jobs" className="block hover:text-yellow-300">
                    All Jobs
                  </Link>
                </>
              )}

              <Link to="/profile" className="block hover:text-yellow-300">
                Profile
              </Link>
              <Link to="/settings" className="block hover:text-yellow-300">
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
