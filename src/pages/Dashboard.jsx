import { useUser, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import OfficeDashboard from "./OfficeDashboard";
import StartupDashboard from "./StartupDashboard";

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [resolvedUserType, setResolvedUserType] = useState(null);
  const [isDeterminingType, setIsDeterminingType] = useState(true);

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

  useEffect(() => {
    let cancelled = false;

    const determineUserType = async () => {
      if (!isLoaded || !user) {
        return;
      }

      setIsDeterminingType(true);

      try {
        let type = user.publicMetadata?.userType;

        if (!type && typeof user.reload === "function") {
          await user.reload();
          type = user.publicMetadata?.userType;
        }

        if (!type) {
          try {
            const token = await getToken();
            if (token) {
              const response = await fetch("/api/profile", {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              });

              if (response.ok) {
                const data = await response.json();
                type = data?.user?.publicMetadata?.userType || null;
              } else {
                console.warn("Unable to resolve user type via /api/profile:", response.status);
              }
            }
          } catch (apiError) {
            console.error("Error fetching user type from backend:", apiError);
          }
        }

        if (!cancelled) {
          setResolvedUserType(type);
        }
      } catch (error) {
        console.error("Error determining user type:", error);
        if (!cancelled) {
          setResolvedUserType(null);
        }
      } finally {
        if (!cancelled) {
          setIsDeterminingType(false);
        }
      }
    };

    determineUserType();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, user, getToken]);

  if (isDeterminingType) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div>Loading your dashboard...</div>
      </div>
    );
  }

  if (!resolvedUserType) {
    console.warn("User type could not be determined; defaulting to office dashboard");
  }

  const userType = resolvedUserType || "office";

  if (userType === "startup") {
    return <StartupDashboard />;
  }

  return <OfficeDashboard />;
}


