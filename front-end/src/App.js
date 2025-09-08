  import { BrowserRouter, Routes, Route } from "react-router-dom";
  import { AuthProvider } from "./context/AuthContext";
  import Navbar from "./components/Navbar";
  import Footer from "./components/Footer";
  import Landing from "./pages/Landing";
  import Login from "./pages/Login";
  import Register from "./pages/Register";
  import JobPage from "./pages/JobPage";
  import JobDetails from "./pages/JobDetails";
  import AdminDashboard from "./pages/dashboard/AdminDashboard";
  import HrDashboard from "./pages/dashboard/HrDashboard";
  import UserDashboard from "./pages/dashboard/UserDashboard";
  import ProtectedRoute from "./components/ProtectedRoute";
  import JobseekerLanding from "./pages/job-seeker/Home-user";
  import Dashboard from "./pages/dashboard/Dashboard";
import Applications from "./pages/job-seeker/Applications";

  function App() {
    return (
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
           
            {/* Protected route */}
            <Route path="/jobs" element={<ProtectedRoute> <JobPage/> </ProtectedRoute>} />
            <Route path="/job/:id" element={<ProtectedRoute><JobDetails /></ProtectedRoute>  } />
            <Route path="*" element={<ProtectedRoute><JobPage /></ProtectedRoute>} />
            <Route path="/applications" element={<ProtectedRoute><Applications/></ProtectedRoute>} />
            <Route path="/user-home" element={<ProtectedRoute> <JobseekerLanding/>  </ProtectedRoute>} />
            <Route path="/dashboard" element={ <ProtectedRoute> <Dashboard/> </ProtectedRoute> } />

            {/* Role Protected */}
            <Route
              path="/dashboard/admin"
              element={<ProtectedRoute role={["ROLE_ADMIN"]}><AdminDashboard /></ProtectedRoute>}
            />
            <Route
              path="/dashboard/hr"
              element={<ProtectedRoute role={["ROLE_HR"]}><HrDashboard /></ProtectedRoute>}
            />
            <Route
              path="/dashboard/user"
              element={<ProtectedRoute role={["ROLE_JOBSEEKER"]}><UserDashboard /></ProtectedRoute>}
            />
          </Routes>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    );
  }

  export default App;
