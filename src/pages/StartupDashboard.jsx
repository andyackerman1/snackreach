import { useState, useEffect } from "react";
import { useUser, useAuth, SignOutButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function StartupDashboard() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("products"); // products, orders, offices, explore, messages
  const [orderFilter, setOrderFilter] = useState("active"); // active, past
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    image: null,
    imagePreview: null,
  });
  const [profileData, setProfileData] = useState({
    email: "",
    companyName: "",
    phone: "",
  });
  const [showCompanyInfoModal, setShowCompanyInfoModal] = useState(false);
  const [companyInfo, setCompanyInfo] = useState({
    description: "",
    logo: null,
    logoPreview: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Explore search filters
  const [searchFilters, setSearchFilters] = useState({
    location: "",
    name: "",
    snackPreference: "",
  });

  // Mock data - replace with API calls
  const [products, setProducts] = useState([]);
  const [orders] = useState([]);
  const [offices] = useState([]);
  const [allOffices, setAllOffices] = useState([]);
  const [isLoadingOffices, setIsLoadingOffices] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");

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

  // Initialize profile data and load products
  useEffect(() => {
    setProfileData({
      email: user.emailAddresses[0]?.emailAddress || "",
      companyName: user.publicMetadata?.companyName || "",
      phone: user.publicMetadata?.phone || "",
    });
    setCompanyInfo({
      description: user.publicMetadata?.description || "",
      logo: null,
      logoPreview: user.publicMetadata?.logo || null,
    });
    // Load products from Clerk metadata
    const savedProducts = user.publicMetadata?.products || [];
    setProducts(savedProducts);
  }, [user]);

  // Fetch offices from API
  useEffect(() => {
    const fetchOffices = async () => {
      if (!user || !isLoaded) return;
      
      setIsLoadingOffices(true);
      try {
        // Get Clerk session token - getToken() returns the JWT directly
        const session = await getToken();
        console.log("🔑 Fetching offices with token:", session ? `Token received (${session.substring(0, 20)}...)` : "No token");
        
        const response = await fetch("/api/offices", {
          headers: {
            "Authorization": `Bearer ${session}`,
            "Content-Type": "application/json",
          },
        });

        console.log("📡 Response status:", response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log("✅ Received offices:", data.length, data);
          if (Array.isArray(data)) {
            setAllOffices(data);
          } else {
            console.error("❌ Data is not an array:", data);
            setAllOffices([]);
          }
        } else {
          const errorText = await response.text();
          console.error("❌ Failed to fetch offices:", response.status, errorText);
          try {
            const errorData = JSON.parse(errorText);
            console.error("❌ Error details:", errorData);
          } catch (e) {
            console.error("❌ Error response is not JSON:", errorText);
          }
        }
      } catch (error) {
        console.error("❌ Error fetching offices:", error);
      } finally {
        setIsLoadingOffices(false);
      }
    };

    fetchOffices();
  }, [user, isLoaded]);

  const handleOpenAddProduct = () => {
    setShowAddProductModal(true);
  };

  const handleCloseAddProduct = () => {
    setShowAddProductModal(false);
    setProductData({
      name: "",
      description: "",
      price: "",
      image: null,
      imagePreview: null,
    });
  };

  const handleOpenEditProduct = (product) => {
    setEditingProduct(product);
    setProductData({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      image: null,
      imagePreview: product.image || null,
    });
    setShowEditProductModal(true);
  };

  const handleCloseEditProduct = () => {
    setShowEditProductModal(false);
    setEditingProduct(null);
    setProductData({
      name: "",
      description: "",
      price: "",
      image: null,
      imagePreview: null,
    });
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        // Get Clerk session token
        const session = await getToken();
        
        // Remove product from local state first for immediate UI update
        const oldProducts = [...products];
        const updatedProducts = products.filter(product => product.id !== productId);
        setProducts(updatedProducts);

        // Save to backend/Clerk metadata
        const response = await fetch("/api/products", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${session}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ products: updatedProducts }),
        });

        if (!response.ok) {
          // Revert local state if save failed
          setProducts(oldProducts);
          const errorData = await response.json().catch(() => ({ error: response.statusText }));
          throw new Error(errorData.error || "Failed to delete product");
        }

        alert("Product deleted successfully!");
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product: " + error.message);
      }
    }
  };

  const handleOpenEditProfile = () => {
    setProfileData({
      email: user.emailAddresses[0]?.emailAddress || "",
      companyName: user.publicMetadata?.companyName || "",
      phone: user.publicMetadata?.phone || "",
    });
    setShowEditProfileModal(true);
  };

  const handleCloseEditProfile = () => {
    setShowEditProfileModal(false);
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

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handleCompanyInfoChange = (e) => {
    const { name, value } = e.target;
    setCompanyInfo({
      ...companyInfo,
      [name]: value,
    });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCompanyInfo({
        ...companyInfo,
        logo: file,
        logoPreview: URL.createObjectURL(file),
      });
    }
  };

  const handleOpenCompanyInfo = () => {
    setCompanyInfo({
      description: user.publicMetadata?.description || "",
      logo: null,
      logoPreview: user.publicMetadata?.logo || null,
    });
    setShowCompanyInfoModal(true);
  };

  const handleCloseCompanyInfo = () => {
    setShowCompanyInfoModal(false);
  };

  // Helper function to compress/resize image - works with any size photo
  const compressImage = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.85, attempt = 1) => {
    return new Promise((resolve, reject) => {
      // Validate file type
      if (!file || !file.type || !file.type.startsWith('image/')) {
        reject(new Error("Please select a valid image file (PNG, JPG, or GIF)"));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          try {
            console.log("Compressing image:", img.width, "x", img.height, "attempt", attempt);
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            // Calculate new dimensions to fit within max dimensions
            if (width > height) {
              if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width = (width * maxHeight) / height;
                height = maxHeight;
              }
            }

            // Ensure minimum dimensions
            width = Math.max(1, Math.round(width));
            height = Math.max(1, Math.round(height));

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            // Convert to base64 with compression
            const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
            
            // Check size (Clerk metadata limit is ~500KB, base64 is ~33% larger than binary)
            // So we want to keep base64 under ~450KB to be safe
            const base64Size = (compressedDataUrl.length * 3) / 4;
            
            if (base64Size > 450000 && attempt < 10) {
              // If still too large, compress more aggressively
              // Reduce dimensions and quality progressively
              const newMaxWidth = Math.max(400, maxWidth * 0.75);
              const newMaxHeight = Math.max(400, maxHeight * 0.75);
              const newQuality = Math.max(0.3, quality * 0.85);
              
              // Recursively compress with new settings, using the same image
              const compressRecursive = (imgElement, w, h, q, att) => {
                const newCanvas = document.createElement('canvas');
                let newWidth = imgElement.width;
                let newHeight = imgElement.height;

                if (newWidth > newHeight) {
                  if (newWidth > w) {
                    newHeight = (newHeight * w) / newWidth;
                    newWidth = w;
                  }
                } else {
                  if (newHeight > h) {
                    newWidth = (newWidth * h) / newHeight;
                    newHeight = h;
                  }
                }

                newWidth = Math.max(1, Math.round(newWidth));
                newHeight = Math.max(1, Math.round(newHeight));

                newCanvas.width = newWidth;
                newCanvas.height = newHeight;

                const newCtx = newCanvas.getContext('2d');
                newCtx.drawImage(imgElement, 0, 0, newWidth, newHeight);

                const newDataUrl = newCanvas.toDataURL('image/jpeg', q);
                const newSize = (newDataUrl.length * 3) / 4;

                if (newSize > 450000 && att < 10) {
                  return compressRecursive(imgElement, w * 0.75, h * 0.75, q * 0.85, att + 1);
                } else {
                  return newDataUrl;
                }
              };

              const finalDataUrl = compressRecursive(img, newMaxWidth, newMaxHeight, newQuality, attempt + 1);
              resolve(finalDataUrl);
            } else if (base64Size > 450000) {
              // Last resort - force to minimum size
              const finalCanvas = document.createElement('canvas');
              finalCanvas.width = 400;
              finalCanvas.height = 400;
              const finalCtx = finalCanvas.getContext('2d');
              finalCtx.drawImage(img, 0, 0, 400, 400);
              resolve(finalCanvas.toDataURL('image/jpeg', 0.3));
            } else {
              resolve(compressedDataUrl);
            }
          } catch (error) {
            reject(new Error("Failed to compress image: " + error.message));
          }
        };
        img.onerror = () => reject(new Error("Failed to load image. Please ensure the file is a valid image."));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error("Failed to read file. Please try a different image."));
      reader.readAsDataURL(file);
    });
  };

  const handleSubmitCompanyInfo = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const session = await getToken();
      
      // Prepare request body
      const requestBody = {
        description: companyInfo.description || "",
      };
      
      // Handle logo: only convert if a new file was selected
      if (companyInfo.logo) {
        console.log("Processing logo file:", companyInfo.logo.name, companyInfo.logo.size, "bytes");
        // Compress and convert to base64 - works with any size photo
        // The compression function will automatically resize and compress to fit Clerk's limits
        try {
          const logoData = await compressImage(companyInfo.logo);
          console.log("Logo compressed successfully, size:", logoData.length, "characters");
          if (!logoData || logoData.length === 0) {
            throw new Error("Compression resulted in empty data");
          }
          requestBody.logo = logoData;
        } catch (compressError) {
          console.error("Compression error:", compressError);
          throw new Error(compressError.message || "Failed to process image. Please try a different image.");
        }
      } else if (companyInfo.logoPreview && typeof companyInfo.logoPreview === 'string' && companyInfo.logoPreview.startsWith('data:')) {
        // No new file, but there's an existing base64 logo - keep it
        // Check if it's not too large
        const existingSize = (companyInfo.logoPreview.length * 3) / 4;
        if (existingSize > 500000) {
          console.warn("Existing logo is large, but keeping it");
        }
        requestBody.logo = companyInfo.logoPreview;
      }
      // If logoPreview is a blob URL or null/undefined, don't include logo in request
      // This preserves the existing logo in metadata

      console.log("Sending request to /api/profile with logo:", requestBody.logo ? "Yes (" + requestBody.logo.length + " chars)" : "No");
      
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${session}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: response.statusText }));
        const errorMessage = errorData.error || "Failed to update company info";
        console.error("API error:", response.status, errorMessage);
        
        // Provide more helpful error messages
        if (response.status === 422 || errorMessage.includes('Unprocessable Entity')) {
          throw new Error("The logo image is too large or invalid. Please try a different image.");
        }
        throw new Error(errorMessage);
      }

      alert("Company information updated successfully!");
      handleCloseCompanyInfo();
      // Reload user data to reflect changes
      window.location.reload();
    } catch (error) {
      console.error("Error updating company info:", error);
      alert("Failed to update company information: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearchFilterChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters({
      ...searchFilters,
      [name]: value,
    });
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get Clerk session token
      const session = await getToken();
      
      // Create product object with image URL (for now using preview, in production this would be from upload)
      const newProduct = {
        id: Date.now(), // Temporary ID
        name: productData.name,
        description: productData.description,
        price: productData.price,
        image: productData.imagePreview || null,
      };

      // Add product to local state first for immediate UI update
      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);

      // Save to backend/Clerk metadata
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ products: updatedProducts }),
      });

      if (!response.ok) {
        // Revert local state if save failed
        setProducts(products);
        const errorData = await response.json().catch(() => ({ error: response.statusText }));
        throw new Error(errorData.error || "Failed to save product");
      }

      alert("Product saved successfully!");
      handleCloseAddProduct();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get Clerk session token
      const session = await getToken();
      
      // Update product in local state first for immediate UI update
      const oldProducts = [...products];
      const updatedProducts = products.map(product =>
        product.id === editingProduct.id
          ? {
              ...product,
              name: productData.name,
              description: productData.description,
              price: productData.price,
              image: productData.imagePreview || product.image,
            }
          : product
      );
      setProducts(updatedProducts);

      // Save to backend/Clerk metadata
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ products: updatedProducts }),
      });

      if (!response.ok) {
        // Revert local state if save failed
        setProducts(oldProducts);
        const errorData = await response.json().catch(() => ({ error: response.statusText }));
        throw new Error(errorData.error || "Failed to update product");
      }

      alert("Product updated successfully!");
      handleCloseEditProduct();
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const session = await getToken();
      
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${session}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName: profileData.companyName,
          phone: profileData.phone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: response.statusText }));
        throw new Error(errorData.error || "Failed to update profile");
      }

      alert("Profile updated successfully!");
      handleCloseEditProfile();
      // Reload user data to reflect changes
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderMainContent = () => {
    if (activeView === "products") {
      return (
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
            {products.length === 0 ? (
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
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition">
                    {product.image && (
                      <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                    )}
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                      {product.price && (
                        <p className="text-red-600 font-semibold mb-2">{product.price}</p>
                      )}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenEditProduct(product)}
                          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                        >
                          <i className="fas fa-edit mr-1"></i>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
                        >
                          <i className="fas fa-trash mr-1"></i>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    if (activeView === "orders") {
      const filteredOrders = orderFilter === "active" 
        ? orders.filter(order => order.status === "active")
        : orders.filter(order => order.status === "completed" || order.status === "cancelled");

      return (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  <i className="fas fa-shopping-cart mr-2 text-red-600"></i>
                  Orders
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Manage incoming and past orders
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setOrderFilter("active")}
                  className={`px-4 py-2 rounded transition text-sm ${
                    orderFilter === "active"
                      ? "bg-red-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Active Orders
                </button>
                <button
                  onClick={() => setOrderFilter("past")}
                  className={`px-4 py-2 rounded transition text-sm ${
                    orderFilter === "past"
                      ? "bg-red-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Past Orders
                </button>
              </div>
            </div>
          </div>
          <div className="p-6">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <i className="fas fa-shopping-cart text-gray-300 text-5xl mb-4"></i>
                <p className="text-gray-500 mb-4">
                  No {orderFilter === "active" ? "active" : "past"} orders yet
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">Order #{order.id}</h3>
                        <p className="text-gray-600 text-sm mt-1">
                          From: {order.officeName}
                        </p>
                        <p className="text-gray-600 text-sm">
                          Date: {order.date}
                        </p>
                        <p className="text-gray-600 text-sm">
                          Total: ${order.total}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded text-sm ${
                        order.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    if (activeView === "offices") {
      return (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                <i className="fas fa-building mr-2 text-red-600"></i>
                Office Connections
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Offices you've done past orders with
              </p>
            </div>
          </div>
          <div className="p-6">
            {offices.length === 0 ? (
              <div className="text-center py-12">
                <i className="fas fa-building text-gray-300 text-5xl mb-4"></i>
                <p className="text-gray-500 mb-4">No office connections yet</p>
                <p className="text-sm text-gray-400">
                  Offices will appear here once you complete orders with them
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {offices.map((office) => (
                  <div key={office.id} className="border rounded-lg p-4 hover:shadow-md transition">
                    <h3 className="font-bold text-lg">{office.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Contact: {office.contactEmail}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Total Orders: {office.totalOrders}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Last Order: {office.lastOrderDate}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    if (activeView === "explore") {
      // Filter offices based on search criteria
      const filteredOffices = allOffices.filter((office) => {
        const matchesLocation = !searchFilters.location || 
          office.location.toLowerCase().includes(searchFilters.location.toLowerCase());
        const matchesName = !searchFilters.name || 
          office.name.toLowerCase().includes(searchFilters.name.toLowerCase());
        const matchesSnackPreference = !searchFilters.snackPreference || 
          office.snackPreference.toLowerCase().includes(searchFilters.snackPreference.toLowerCase());
        
        return matchesLocation && matchesName && matchesSnackPreference;
      });

      return (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                <i className="fas fa-search mr-2 text-red-600"></i>
                Explore Office Spaces
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Discover offices looking for snack partnerships
              </p>
            </div>
          </div>
          
          {/* Search Filters */}
          <div className="p-6 border-b bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="search-location" className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-map-marker-alt mr-1 text-red-600"></i>
                  Location
                </label>
                <input
                  type="text"
                  id="search-location"
                  name="location"
                  value={searchFilters.location}
                  onChange={handleSearchFilterChange}
                  placeholder="e.g., San Francisco, CA"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="search-name" className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-building mr-1 text-red-600"></i>
                  Office Name
                </label>
                <input
                  type="text"
                  id="search-name"
                  name="name"
                  value={searchFilters.name}
                  onChange={handleSearchFilterChange}
                  placeholder="e.g., Tech Startup Hub"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="search-snack" className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-utensils mr-1 text-red-600"></i>
                  Snack Preference
                </label>
                <input
                  type="text"
                  id="search-snack"
                  name="snackPreference"
                  value={searchFilters.snackPreference}
                  onChange={handleSearchFilterChange}
                  placeholder="e.g., healthy snacks, protein bars"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>
            </div>
            {(searchFilters.location || searchFilters.name || searchFilters.snackPreference) && (
              <button
                onClick={() => setSearchFilters({ location: "", name: "", snackPreference: "" })}
                className="mt-4 text-sm text-red-600 hover:text-red-700"
              >
                <i className="fas fa-times mr-1"></i>
                Clear Filters
              </button>
            )}
          </div>

          {/* Results */}
          <div className="p-6">
            {isLoadingOffices ? (
              <div className="text-center py-12">
                <i className="fas fa-spinner fa-spin text-gray-400 text-5xl mb-4"></i>
                <p className="text-gray-500 mb-4">Loading offices...</p>
              </div>
            ) : filteredOffices.length === 0 ? (
              <div className="text-center py-12">
                <i className="fas fa-search text-gray-300 text-5xl mb-4"></i>
                <p className="text-gray-500 mb-4">No offices found</p>
                <p className="text-sm text-gray-400">
                  {allOffices.length === 0 
                    ? "No offices have joined the platform yet"
                    : "Try adjusting your search filters"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">
                  Found {filteredOffices.length} office{filteredOffices.length !== 1 ? 's' : ''}
                </p>
                {filteredOffices.map((office) => (
                  <div key={office.id} className="border rounded-lg p-6 hover:shadow-lg transition">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-gray-900 mb-2">
                          {office.companyName || office.name}
                        </h3>
                        {office.companyName && office.name !== office.companyName && (
                          <p className="text-sm text-gray-500 mb-2">{office.name}</p>
                        )}
                        <div className="space-y-2">
                          {office.location && office.location !== 'Not specified' && (
                            <p className="text-gray-600">
                              <i className="fas fa-map-marker-alt mr-2 text-red-600"></i>
                              {office.location}
                            </p>
                          )}
                          {office.companySize && office.companySize !== 'Not specified' && (
                            <p className="text-gray-600">
                              <i className="fas fa-users mr-2 text-red-600"></i>
                              {office.companySize}
                            </p>
                          )}
                          {office.snackPreference && office.snackPreference !== 'Not specified' && (
                            <p className="text-gray-600">
                              <i className="fas fa-utensils mr-2 text-red-600"></i>
                              <span className="font-medium">Looking for:</span> {office.snackPreference}
                            </p>
                          )}
                          {office.contactEmail && (
                            <p className="text-gray-600">
                              <i className="fas fa-envelope mr-2 text-red-600"></i>
                              {office.contactEmail}
                            </p>
                          )}
                        </div>
                      </div>
                      <button 
                        onClick={async () => {
                          // Find or create chat with this office
                          const existingChat = messages.find(m => 
                            m.officeId === office.id || 
                            (m.officeId === office.id && m.startupId === user.id)
                          );
                          if (existingChat) {
                            setSelectedChat(existingChat);
                            setActiveView("messages");
                          } else {
                            // Create new chat with proper structure
                            const chatId = `chat_${user.id}_${office.id}`;
                            const newChat = {
                              id: chatId,
                              startupId: user.id,
                              officeId: office.id,
                              startupName: companyName || user.firstName,
                              officeName: office.name,
                              officeEmail: office.contactEmail,
                              messages: [],
                            };
                            const updatedMessages = [...messages, newChat];
                            setMessages(updatedMessages);
                            setSelectedChat(newChat);
                            setActiveView("messages");

                            // Save new chat to Clerk metadata
                            try {
                              const session = await getToken();
                              await fetch("/api/profile", {
                                method: "PUT",
                                headers: {
                                  "Authorization": `Bearer ${session}`,
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                  messages: updatedMessages,
                                }),
                              });
                            } catch (error) {
                              console.error("Error saving new chat:", error);
                            }
                          }
                        }}
                        className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      >
                        <i className="fas fa-comment mr-2"></i>
                        Message
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    if (activeView === "messages") {
      const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedChat) return;

        try {
          const session = await getToken();
          
          // Determine recipient ID - for startups, recipient is the office
          const recipientId = selectedChat.officeId;
          if (!recipientId || recipientId === user.id) {
            alert("Cannot determine recipient. Please try again.");
            return;
          }

          // Send message via API (stores in both users' metadata)
          const response = await fetch("/api/messages", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${session}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              toUserId: recipientId,
              message: newMessage,
              chatId: selectedChat.id,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: response.statusText }));
            throw new Error(errorData.error || "Failed to send message");
          }

          const data = await response.json();
          
          // Update local state with the returned chat
          if (data.chat) {
            const updatedMessages = messages.map(m => 
              m.id === selectedChat.id ? data.chat : m
            );
            setMessages(updatedMessages);
            setSelectedChat(data.chat);
          }
          
          setNewMessage("");
          
          // Refresh user data to get updated messages from Clerk
          // Instead of full reload, just refresh the user object
          await user.reload();
          const updatedUserMessages = user.publicMetadata?.messages || [];
          setMessages(updatedUserMessages);
          // Update selected chat if it still exists
          const updatedSelectedChat = updatedUserMessages.find(m => m.id === selectedChat.id);
          if (updatedSelectedChat) {
            setSelectedChat(updatedSelectedChat);
          }
        } catch (error) {
          console.error("Error sending message:", error);
          alert("Failed to send message: " + error.message);
        }
      };

      const handleDeleteChat = async (chatId) => {
        if (window.confirm("Are you sure you want to delete this conversation?")) {
          const updatedMessages = messages.filter(m => m.id !== chatId);
          setMessages(updatedMessages);
          if (selectedChat?.id === chatId) {
            setSelectedChat(null);
          }

          // Save messages to Clerk metadata
          try {
            const session = await getToken();
            await fetch("/api/profile", {
              method: "PUT",
              headers: {
                "Authorization": `Bearer ${session}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                messages: updatedMessages,
              }),
            });
          } catch (error) {
            console.error("Error saving messages:", error);
          }
        }
      };

      return (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                <i className="fas fa-comments mr-2 text-red-600"></i>
                Messages
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Communicate with office spaces
              </p>
            </div>
          </div>
          <div className="flex h-[600px]">
            {/* Conversations List */}
            <div className="w-1/3 border-r overflow-y-auto">
              <div className="p-4">
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <i className="fas fa-comments text-gray-300 text-3xl mb-2"></i>
                    <p className="text-sm text-gray-500">No conversations yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {messages.map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => setSelectedChat(chat)}
                        className={`p-3 rounded-lg cursor-pointer transition ${
                          selectedChat?.id === chat.id
                            ? "bg-red-50 border-2 border-red-600"
                            : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm text-gray-900">
                              {chat.officeName}
                            </h4>
                            {chat.messages.length > 0 && (
                              <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                                {chat.messages[chat.messages.length - 1].text}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteChat(chat.id);
                            }}
                            className="text-gray-400 hover:text-red-600 ml-2"
                          >
                            <i className="fas fa-trash text-xs"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Chat View */}
            <div className="flex-1 flex flex-col">
              {selectedChat ? (
                <>
                  <div className="p-4 border-b bg-gray-50">
                    <h3 className="font-semibold text-gray-900">{selectedChat.officeName}</h3>
                    <p className="text-xs text-gray-500">{selectedChat.officeEmail}</p>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {selectedChat.messages.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500 text-sm">No messages yet. Start the conversation!</p>
                      </div>
                    ) : (
                      selectedChat.messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.isSent ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              msg.isSent
                                ? "bg-red-600 text-white"
                                : "bg-gray-200 text-gray-900"
                            }`}
                          >
                            <p className="text-sm">{msg.text}</p>
                            <p className={`text-xs mt-1 ${
                              msg.isSent ? "text-red-100" : "text-gray-500"
                            }`}>
                              {new Date(msg.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleSendMessage();
                          }
                        }}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <i className="fas fa-paper-plane"></i>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <i className="fas fa-comments text-gray-300 text-5xl mb-4"></i>
                    <p className="text-gray-500">Select a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return null;
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <button
            onClick={() => setActiveView("offices")}
            className={`bg-white rounded-lg shadow p-6 text-left hover:shadow-lg transition ${
              activeView === "offices" ? "ring-2 ring-red-600" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Office Connections</p>
                <p className="text-2xl font-bold text-gray-900">{offices.length}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <i className="fas fa-building text-blue-600 text-xl"></i>
              </div>
            </div>
          </button>
          <button
            onClick={() => setActiveView("orders")}
            className={`bg-white rounded-lg shadow p-6 text-left hover:shadow-lg transition ${
              activeView === "orders" ? "ring-2 ring-red-600" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.status === "active").length}
                </p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <i className="fas fa-shopping-cart text-green-600 text-xl"></i>
              </div>
            </div>
          </button>
          <button
            onClick={() => setActiveView("products")}
            className={`bg-white rounded-lg shadow p-6 text-left hover:shadow-lg transition ${
              activeView === "products" ? "ring-2 ring-red-600" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Products Listed</p>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <i className="fas fa-box text-purple-600 text-xl"></i>
              </div>
            </div>
          </button>
          <button
            onClick={() => setActiveView("explore")}
            className={`bg-white rounded-lg shadow p-6 text-left hover:shadow-lg transition ${
              activeView === "explore" ? "ring-2 ring-red-600" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Explore</p>
                <p className="text-2xl font-bold text-gray-900">{allOffices.length}</p>
              </div>
              <div className="bg-orange-100 rounded-full p-3">
                <i className="fas fa-search text-orange-600 text-xl"></i>
              </div>
            </div>
          </button>
          <button
            onClick={() => setActiveView("messages")}
            className={`bg-white rounded-lg shadow p-6 text-left hover:shadow-lg transition ${
              activeView === "messages" ? "ring-2 ring-red-600" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Messages</p>
                <p className="text-2xl font-bold text-gray-900">{messages.length}</p>
              </div>
              <div className="bg-indigo-100 rounded-full p-3">
                <i className="fas fa-comments text-indigo-600 text-xl"></i>
              </div>
            </div>
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {renderMainContent()}
          </div>

          {/* Profile Sidebar */}
          <div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Your Profile
                </h3>
                <button
                  onClick={handleOpenEditProfile}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
                >
                  <i className="fas fa-edit mr-1"></i>
                  Edit
                </button>
              </div>
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
            
            {/* Company Info Section */}
            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Company Info
                </h3>
                <button
                  onClick={handleOpenCompanyInfo}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
                >
                  <i className="fas fa-edit mr-1"></i>
                  Edit
                </button>
              </div>
              <div className="space-y-3">
                {companyInfo.logoPreview && (
                  <div className="mb-4">
                    <img
                      src={companyInfo.logoPreview}
                      alt="Company logo"
                      className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}
                {companyInfo.description ? (
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">Description</p>
                    <p className="text-sm text-gray-900">{companyInfo.description}</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">No description added yet</p>
                )}
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
            <form onSubmit={handleSubmitProduct} className="p-6">
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
                      <p className="text-xs text-gray-500">PNG, JPG, GIF (any size - will be automatically compressed)</p>
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
              <div className="mb-6">
                <label htmlFor="product-price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price or Price Range per Unit
                </label>
                <input
                  type="text"
                  id="product-price"
                  name="price"
                  value={productData.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  placeholder="e.g., $10.99 or $5-$15"
                />
                <p className="text-xs text-gray-500 mt-1">Enter a single price or price range per unit</p>
              </div>
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

      {/* Edit Product Modal */}
      {showEditProductModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleCloseEditProduct}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                Edit Product
              </h2>
              <button
                onClick={handleCloseEditProduct}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleUpdateProduct} className="p-6">
              <div className="mb-6">
                <label htmlFor="edit-product-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="edit-product-name"
                  name="name"
                  value={productData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  placeholder="Enter product name"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="edit-product-image" className="block text-sm font-medium text-gray-700 mb-2">
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
                      <p className="text-xs text-gray-500">PNG, JPG, GIF (any size - will be automatically compressed)</p>
                    </div>
                    <input
                      type="file"
                      id="edit-product-image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="edit-product-description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-600">*</span>
                </label>
                <textarea
                  id="edit-product-description"
                  name="description"
                  value={productData.description}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  placeholder="Describe your product, ingredients, flavors, etc."
                />
              </div>
              <div className="mb-6">
                <label htmlFor="edit-product-price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price or Price Range per Unit
                </label>
                <input
                  type="text"
                  id="edit-product-price"
                  name="price"
                  value={productData.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  placeholder="e.g., $10.99 or $5-$15"
                />
                <p className="text-xs text-gray-500 mt-1">Enter a single price or price range per unit</p>
              </div>
              <div className="flex justify-end gap-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleCloseEditProduct}
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
                      Updating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check mr-2"></i>
                      Update Product
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleCloseEditProfile}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                Edit Profile
              </h2>
              <button
                onClick={handleCloseEditProfile}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmitProfile} className="p-6">
              <div className="mb-6">
                <label htmlFor="profile-company" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="profile-company"
                  name="companyName"
                  value={profileData.companyName}
                  onChange={handleProfileInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  placeholder="Enter company name"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="profile-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  id="profile-email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  placeholder="Enter email address"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="profile-phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="profile-phone"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  placeholder="Enter phone number"
                />
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleCloseEditProfile}
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
                      Updating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check mr-2"></i>
                      Update Profile
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Company Info Modal */}
      {showCompanyInfoModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleCloseCompanyInfo}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                Edit Company Info
              </h2>
              <button
                onClick={handleCloseCompanyInfo}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmitCompanyInfo} className="p-6">
              <div className="mb-6">
                <label htmlFor="company-logo" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Logo
                </label>
                <div className="space-y-4">
                  {companyInfo.logoPreview && (
                    <div className="relative w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={companyInfo.logoPreview}
                        alt="Logo preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <i className="fas fa-image text-3xl text-gray-400 mb-2"></i>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF (any size - will be automatically compressed)</p>
                    </div>
                    <input
                      type="file"
                      id="company-logo"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="company-description" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Description
                </label>
                <textarea
                  id="company-description"
                  name="description"
                  value={companyInfo.description}
                  onChange={handleCompanyInfoChange}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  placeholder="Tell offices about your company, your mission, and what makes you special..."
                />
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleCloseCompanyInfo}
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
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check mr-2"></i>
                      Save Company Info
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
