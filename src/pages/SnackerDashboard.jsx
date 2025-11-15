import { useState, useEffect } from "react";
import { useUser, useAuth, SignOutButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function SnackerDashboard() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchCompanies = async () => {
      setIsLoading(true);
      try {
        const token = await getToken();
        if (!token) return;

        const response = await fetch("/api/startups", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCompanies(data);
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, [isLoaded, user, getToken]);

  const handleCompanyClick = async (company) => {
    setSelectedCompany(company);
    try {
      const token = await getToken();
      if (!token) return;

      const response = await fetch(`/api/products/${company.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  const filteredCompanies = companies.filter((company) =>
    company.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                {user.firstName} {user.lastName}
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {user.firstName || "Snacker"}!
          </h1>
          <p className="text-gray-600">
            Discover new and exciting snacks from amazing brands
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search snack brands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
          />
        </div>

        {/* Companies List or Product View */}
        {selectedCompany ? (
          <div className="bg-white rounded-lg shadow p-6">
            <button
              onClick={() => {
                setSelectedCompany(null);
                setProducts([]);
              }}
              className="mb-4 text-red-600 hover:text-red-700 flex items-center gap-2"
            >
              <i className="fas fa-arrow-left"></i>
              Back to Brands
            </button>
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                {selectedCompany.logo && (
                  <img
                    src={selectedCompany.logo}
                    alt={selectedCompany.companyName || selectedCompany.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedCompany.companyName || selectedCompany.name}
                  </h2>
                  {selectedCompany.description && (
                    <p className="text-gray-600 mt-2">{selectedCompany.description}</p>
                  )}
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Snacks</h3>
              {products.length === 0 ? (
                <div className="text-center py-12">
                  <i className="fas fa-box text-gray-300 text-5xl mb-4"></i>
                  <p className="text-gray-500">No snacks listed yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="border rounded-lg overflow-hidden hover:shadow-lg transition"
                    >
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <h4 className="font-bold text-lg mb-2">{product.name}</h4>
                        {product.price && (
                          <p className="text-red-600 font-semibold mb-2">{product.price}</p>
                        )}
                        {product.description && (
                          <p className="text-gray-600 text-sm line-clamp-3">
                            {product.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                <i className="fas fa-store mr-2 text-red-600"></i>
                Snack Brands
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Click on a brand to explore their snacks
              </p>
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="text-center py-12">
                  <i className="fas fa-spinner fa-spin text-gray-400 text-5xl mb-4"></i>
                  <p className="text-gray-500">Loading brands...</p>
                </div>
              ) : filteredCompanies.length === 0 ? (
                <div className="text-center py-12">
                  <i className="fas fa-store text-gray-300 text-5xl mb-4"></i>
                  <p className="text-gray-500">
                    {searchTerm
                      ? "No brands found matching your search"
                      : "No snack brands have joined the platform yet"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCompanies.map((company) => (
                    <div
                      key={company.id}
                      onClick={() => handleCompanyClick(company)}
                      className="border rounded-lg p-6 hover:shadow-lg transition cursor-pointer"
                    >
                      {company.logo && (
                        <img
                          src={company.logo}
                          alt={company.companyName}
                          className="w-full h-32 object-cover rounded-lg mb-4"
                        />
                      )}
                      <h3 className="font-bold text-xl mb-2">
                        {company.companyName || company.name}
                      </h3>
                      {company.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {company.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>
                          <i className="fas fa-box mr-1"></i>
                          View Snacks
                        </span>
                        <i className="fas fa-chevron-right"></i>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
