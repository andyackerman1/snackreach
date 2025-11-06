import { useState } from "react";
import { useUser, SignOutButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function StartupDashboard() {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    image: null,
    imagePreview: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleOpenAddProduct = () => {
    setShowAddProductModal(true);
  };

  const handleCloseAddProduct = () => {
    setShowAddProductModal(false);
    setProductData({
      name: "",
      description: "",
      image: null,
      imagePreview: null,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductData({
        ...productData,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implement API call to save product
      // For now, just log the data
      console.log("Product data:", productData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message (you can add toast notifications here)
      alert("Product added successfully!");
      
      // Reset form and close modal
      handleCloseAddProduct();
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
                  <button 
                    onClick={handleOpenAddProduct}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
                  >
                    <i className="fas fa-plus mr-2"></i>
                    Add Product
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="text-center py-12">
                  <i className="fas fa-box text-gray-300 text-5xl mb-4"></i>
                  <p className="text-gray-500 mb-4">No products listed yet</p>
                  <button 
                    onClick={handleOpenAddProduct}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  >
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
                <button 
                  onClick={handleOpenAddProduct}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition"
                >
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

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleCloseAddProduct}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                Add New Product
              </h2>
              <button
                onClick={handleCloseAddProduct}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmitProduct} className="p-6">
              {/* Product Name */}
              <div className="mb-6">
                <label htmlFor="product-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="product-name"
                  name="name"
                  value={productData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  placeholder="Enter product name"
                />
              </div>

              {/* Product Image */}
              <div className="mb-6">
                <label htmlFor="product-image" className="block text-sm font-medium text-gray-700 mb-2">
                  Product Image <span className="text-red-600">*</span>
                </label>
                <div className="space-y-4">
                  {productData.imagePreview && (
                    <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={productData.imagePreview}
                        alt="Product preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 5MB)</p>
                    </div>
                    <input
                      type="file"
                      id="product-image"
                      accept="image/*"
                      onChange={handleImageChange}
                      required
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Product Description */}
              <div className="mb-6">
                <label htmlFor="product-description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-600">*</span>
                </label>
                <textarea
                  id="product-description"
                  name="description"
                  value={productData.description}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  placeholder="Describe your product, ingredients, flavors, etc."
                />
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleCloseAddProduct}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Adding...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check mr-2"></i>
                      Add Product
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

