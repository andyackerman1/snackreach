import { useUser, SignOutButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

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

  // Get user metadata
  const userType = user.publicMetadata?.userType || "office";
  const companyName = user.publicMetadata?.companyName || "";

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">SnackReach</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {user.firstName} {user.lastName}
              </span>
              <SignOutButton>
                <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                  Sign Out
                </button>
              </SignOutButton>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Welcome to your Dashboard</h2>
          <div className="space-y-2">
            <p><strong>Email:</strong> {user.emailAddresses[0]?.emailAddress}</p>
            <p><strong>User Type:</strong> {userType}</p>
            {companyName && <p><strong>Company:</strong> {companyName}</p>}
          </div>
        </div>
      </main>
    </div>
  );
}

