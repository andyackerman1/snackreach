import { useUser, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SnackerDashboard from "./SnackerDashboard";
import StartupDashboard from "./StartupDashboard";

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [resolvedUserType, setResolvedUserType] = useState(null);
  const [isDeterminingType, setIsDeterminingType] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const determineUserType = async () => {
      if (!isLoaded || !user) {
        if (!cancelled) {
          setIsDeterminingType(false);
        }
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

  // Handle navigation after hooks
  useEffect(() => {
    if (isLoaded && !user) {
      navigate("/login");
    }
  }, [isLoaded, user, navigate]);

  // Loading state
  if (!isLoaded || isDeterminingType) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  // Redirect if no user (handled by useEffect above, but show loading while redirecting)
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div>Redirecting to login...</div>
      </div>
    );
  }

  // Determine which dashboard to show
  if (!resolvedUserType) {
    console.warn("User type could not be determined; defaulting to snacker dashboard");
  }

  const userType = resolvedUserType || "snacker";

  if (userType === "startup") {
    return <StartupDashboard />;
  }

  return <SnackerDashboard />;
}


