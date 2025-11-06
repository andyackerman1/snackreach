import { useUser, SignOutButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function StartupDashboard() {
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

  const companyName = user.publicMetadata?.companyName || "";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-red-600">
                <i className="fas fa-utensils mr-2"></i>
                SnackReach
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {companyName || user.firstName} {user.lastName}
              </span>
              <SignOutButton>
                <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
                  Sign Out
                </button>
              </SignOutButton>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {companyName || user.firstName}!
          </h1>
          <p className="text-gray-600">
            Build brand awareness through discounted office deals
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Office Connections</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <i className="fas fa-building text-blue-600 text-xl"></i>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Orders</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <i className="fas fa-shopping-cart text-green-600 text-xl"></i>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Products Listed</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <i className="fas fa-box text-purple-600 text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Products & Orders Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Products Section */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      <i className="fas fa-box mr-2 text-red-600"></i>
                      Your Products
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      Manage your snack products and offerings
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm">
                    <i className="fas fa-plus mr-2"></i>
                    Add Product
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="text-center py-12">
                  <i className="fas fa-box text-gray-300 text-5xl mb-4"></i>
                  <p className="text-gray-500 mb-4">No products listed yet</p>
                  <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
                    <i className="fas fa-plus mr-2"></i>
                    Add Your First Product
                  </button>
                </div>
              </div>
            </div>

            {/* Office Connections Section */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">
                  <i className="fas fa-building mr-2 text-red-600"></i>
                  Office Connections
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Offices interested in your products
                </p>
              </div>
              <div className="p-6">
                <div className="text-center py-12">
                  <i className="fas fa-building text-gray-300 text-5xl mb-4"></i>
                  <p className="text-gray-500 mb-4">No office connections yet</p>
                  <p className="text-sm text-gray-400">
                    Office managers will appear here as they discover your products
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Your Profile
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Email</p>
                  <p className="text-sm text-gray-900">
                    {user.emailAddresses[0]?.emailAddress}
                  </p>
                </div>
                {companyName && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">Company</p>
                    <p className="text-sm text-gray-900">{companyName}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Account Type</p>
                  <p className="text-sm text-gray-900">Food Startup</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition">
                  <i className="fas fa-plus mr-2 text-red-600"></i>
                  Add Product
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition">
                  <i className="fas fa-building mr-2 text-red-600"></i>
                  View Offices
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition">
                  <i className="fas fa-shopping-cart mr-2 text-red-600"></i>
                  Manage Orders
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition">
                  <i className="fas fa-cog mr-2 text-red-600"></i>
                  Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

