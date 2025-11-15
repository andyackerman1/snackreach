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
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedNutritionTags, setSelectedNutritionTags] = useState([]);

  const categories = ["chips", "cookies", "bars", "drinks", "candy", "nuts", "jerky", "other"];
  const nutritionTags = ["lower calorie", "lower carb", "high protein", "vegan", "gluten-free", "low sugar"];

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

      // Build query parameters for filtering
      const params = new URLSearchParams();
      if (selectedCategories.length > 0) {
        params.append("categories", selectedCategories.join(","));
      }
      if (selectedNutritionTags.length > 0) {
        params.append("nutritionTags", selectedNutritionTags.join(","));
      }

      const url = `/api/products/${company.id}${params.toString() ? `?${params.toString()}` : ""}`;
      const response = await fetch(url, {
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

  const filteredProducts = products.filter((product) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      product.name?.toLowerCase().includes(searchLower) ||
      product.description?.toLowerCase().includes(searchLower)
    );
  });

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
    // If a company is selected, refetch products with new filters
    if (selectedCompany) {
      setTimeout(() => handleCompanyClick(selectedCompany), 100);
    }
  };

  const toggleNutritionTag = (tag) => {
    setSelectedNutritionTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
    // If a company is selected, refetch products with new filters
    if (selectedCompany) {
      setTimeout(() => handleCompanyClick(selectedCompany), 100);
    }
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedNutritionTags([]);
    setSearchTerm("");
    // If a company is selected, refetch products without filters
    if (selectedCompany) {
      setTimeout(() => handleCompanyClick(selectedCompany), 100);
    }
  };

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

        {/* Companies List or Product View */}
        {selectedCompany ? (
          <div className="bg-white rounded-lg shadow p-6">
            <button
              onClick={() => {
                setSelectedCompany(null);
                setProducts([]);
                setSelectedCategories([]);
                setSelectedNutritionTags([]);
                setSearchTerm("");
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

            {/* Filters */}
            <div className="mb-6 bg-gray-50 rounded-lg p-4">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search snacks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>

              {/* Category Filters */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-filter mr-1 text-red-600"></i>
                  Categories
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => toggleCategory(category)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                        selectedCategories.includes(category)
                          ? "bg-red-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nutrition Tag Filters */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-tags mr-1 text-red-600"></i>
                  Nutrition Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {nutritionTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleNutritionTag(tag)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition capitalize ${
                        selectedNutritionTags.includes(tag)
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {(selectedCategories.length > 0 || selectedNutritionTags.length > 0 || searchTerm) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  <i className="fas fa-times mr-1"></i>
                  Clear All Filters
                </button>
              )}
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Snacks</h3>
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <i className="fas fa-box text-gray-300 text-5xl mb-4"></i>
                  <p className="text-gray-500">
                    {searchTerm || selectedCategories.length > 0 || selectedNutritionTags.length > 0
                      ? "No snacks found matching your filters"
                      : "No snacks listed yet"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
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
                        {product.category && (
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded mb-2">
                            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                          </span>
                        )}
                        {product.nutritionTags && product.nutritionTags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {product.nutritionTags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded capitalize"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
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
              {/* Search Bar for Companies */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search snack brands..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>

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
