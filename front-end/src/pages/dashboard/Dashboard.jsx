import { useAuth } from "../../context/AuthContext";
import UserDashboard from "./UserDashboard";
import HrDashboard from "./HrDashboard";
import AdminDashboard from "./AdminDashboard";

export default function Dashboard() {
  const { user } = useAuth(); // yaha se role milega

  if (!user) {
    return <p className="text-center mt-10">Please login to continue...</p>;
  }

  switch (user.role) {
    case "ROLE_JOBSEEKER":
      return <UserDashboard />;
    case "ROLE_HR":
      return <HrDashboard />;
    case "ROLE_ADMIN":
      return <AdminDashboard />;
    default:
      return <p className="text-center mt-10">Invalid role</p>;
  }
}
