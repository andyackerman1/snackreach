import { useState, useEffect } from "react";
import { useUser, useAuth, SignOutButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function SnackerDashboard() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedNutritionTags, setSelectedNutritionTags] = useState([]);

  const categories = ["chips", "cookies", "bars", "drinks", "candy", "nuts", "jerky", "other"];
  const nutritionTags = ["lower calorie", "lower carb", "high protein", "vegan", "gluten-free", "low sugar"];

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchProducts = async () => {
      setIsLoading(true);
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

        const url = `/api/products${params.toString() ? `?${params.toString()}` : ""}`;
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [isLoaded, user, getToken, selectedCategories, selectedNutritionTags]);

  const filteredProducts = products.filter((product) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      product.name?.toLowerCase().includes(searchLower) ||
      product.description?.toLowerCase().includes(searchLower) ||
      product.startupName?.toLowerCase().includes(searchLower)
    );
  });

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleNutritionTag = (tag) => {
    setSelectedNutritionTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedNutritionTags([]);
    setSearchTerm("");
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

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search snacks by name, description, or brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
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

        {/* Products List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">
              <i className="fas fa-box mr-2 text-red-600"></i>
              All Snacks
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {filteredProducts.length} {filteredProducts.length === 1 ? "snack" : "snacks"} found
            </p>
          </div>
          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-12">
                <i className="fas fa-spinner fa-spin text-gray-400 text-5xl mb-4"></i>
                <p className="text-gray-500">Loading snacks...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <i className="fas fa-box text-gray-300 text-5xl mb-4"></i>
                <p className="text-gray-500">
                  {searchTerm || selectedCategories.length > 0 || selectedNutritionTags.length > 0
                    ? "No snacks found matching your filters"
                    : "No snacks have been uploaded yet"}
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
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-lg">{product.name}</h4>
                        {product.startupLogo && (
                          <img
                            src={product.startupLogo}
                            alt={product.startupName}
                            className="w-8 h-8 rounded-full object-cover ml-2"
                          />
                        )}
                      </div>
                      {product.startupName && (
                        <p className="text-xs text-gray-500 mb-2">By {product.startupName}</p>
                      )}
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
                        <p className="text-gray-600 text-sm line-clamp-2">
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
      </main>
    </div>
  );
}
