import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import OfficeDashboard from "./OfficeDashboard";
import StartupDashboard from "./StartupDashboard";

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  // Get user metadata and route to appropriate dashboard
  const userType = user.publicMetadata?.userType || "office";

  // Route to the appropriate dashboard based on user type
  if (userType === "startup") {
    return <StartupDashboard />;
  } else {
    return <OfficeDashboard />;
  }
}


