import { useState, useEffect, useCallback } from "react";
import { useUser, useAuth, SignOutButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function StartupDashboard() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("products"); // products only
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
  
  // Mock data - replace with API calls
  const [products, setProducts] = useState([]);

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

  // Helper function to compress/resize image and bring it under ~420KB before saving
  const compressImage = (file) => {
    const TARGET_BYTES = 420000; // Keep well under Clerk limit (~500KB)

    const ATTEMPTS = [
      { maxWidth: 2000, maxHeight: 2000, quality: 0.86 },
      { maxWidth: 1800, maxHeight: 1800, quality: 0.82 },
      { maxWidth: 1600, maxHeight: 1600, quality: 0.78 },
      { maxWidth: 1400, maxHeight: 1400, quality: 0.74 },
      { maxWidth: 1200, maxHeight: 1200, quality: 0.7 },
      { maxWidth: 1000, maxHeight: 1000, quality: 0.64 },
      { maxWidth: 850, maxHeight: 850, quality: 0.58 },
      { maxWidth: 720, maxHeight: 720, quality: 0.52 },
      { maxWidth: 580, maxHeight: 580, quality: 0.48 },
      { maxWidth: 460, maxHeight: 460, quality: 0.44 },
      { maxWidth: 360, maxHeight: 360, quality: 0.38 },
      { maxWidth: 280, maxHeight: 280, quality: 0.32 },
      { maxWidth: 220, maxHeight: 220, quality: 0.28 },
      { maxWidth: 180, maxHeight: 180, quality: 0.24 },
      { maxWidth: 140, maxHeight: 140, quality: 0.2 },
      { maxWidth: 110, maxHeight: 110, quality: 0.18 },
      { maxWidth: 90, maxHeight: 90, quality: 0.16 },
    ];

    const getScaledDimensions = (width, height, maxWidth, maxHeight) => {
      const aspectRatio = width / height;
      let newWidth = width;
      let newHeight = height;

      if (width > maxWidth || height > maxHeight) {
        if (aspectRatio > 1) {
          newWidth = maxWidth;
          newHeight = Math.max(1, Math.round(maxWidth / aspectRatio));
          if (newHeight > maxHeight) {
            newHeight = maxHeight;
            newWidth = Math.max(1, Math.round(maxHeight * aspectRatio));
          }
        } else {
          newHeight = maxHeight;
          newWidth = Math.max(1, Math.round(maxHeight * aspectRatio));
          if (newWidth > maxWidth) {
            newWidth = maxWidth;
            newHeight = Math.max(1, Math.round(maxWidth / aspectRatio));
          }
        }
      }

      return { width: Math.max(1, newWidth), height: Math.max(1, newHeight) };
    };

    const ensureCanvasContext = (canvas) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Unable to access canvas context for image compression.");
      }
      return ctx;
    };

    return new Promise((resolve, reject) => {
      if (!file || !file.type || !file.type.startsWith("image/")) {
        reject(new Error("Please select a valid image file (PNG, JPG, or GIF)"));
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const tryAttempt = (index) => {
            if (index >= ATTEMPTS.length) {
              // Final hard fallback - force very small JPEG
              const finalCanvas = document.createElement("canvas");
              finalCanvas.width = 120;
              finalCanvas.height = 120;
              const finalCtx = ensureCanvasContext(finalCanvas);
              finalCtx.fillStyle = "#ffffff";
              finalCtx.fillRect(0, 0, 120, 120);
              finalCtx.drawImage(img, 0, 0, 120, 120);
              const finalDataUrl = finalCanvas.toDataURL("image/jpeg", 0.12);
              const finalPayload = finalDataUrl.split(",")[1] || "";
              const finalSize = Math.ceil((finalPayload.length * 3) / 4);
              if (finalSize <= TARGET_BYTES) {
                console.log(`Compression final fallback: 120x120, quality 0.12, size ${finalSize} bytes (limit ${TARGET_BYTES})`);
                resolve(finalDataUrl);
              } else {
                reject(
                  new Error(
                    "Unable to compress image below 420KB. Please choose an image with smaller dimensions or less detail."
                  )
                );
              }
              return;
            }

            const { maxWidth, maxHeight, quality } = ATTEMPTS[index];
            const { width, height } = getScaledDimensions(
              img.width,
              img.height,
              maxWidth,
              maxHeight
            );

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;

            const ctx = ensureCanvasContext(canvas);

            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, width, height);

            ctx.drawImage(img, 0, 0, width, height);

            let dataUrl;
            try {
              const supportsTransparency = file.type && file.type !== "image/jpeg" && file.type !== "image/jpg";
              if (supportsTransparency && quality >= 0.4) {
                dataUrl = canvas.toDataURL("image/png");
              } else {
                dataUrl = canvas.toDataURL("image/jpeg", quality);
              }
            } catch (canvasError) {
              reject(new Error("Failed to process image. Please try a different file."));
              return;
            }

            const base64Payload = dataUrl.split(",")[1] || "";
            const base64Size = Math.ceil((base64Payload.length * 3) / 4);

            console.log(
              `Compression attempt ${index + 1}: ${width}x${height}, quality ${quality}, size ${base64Size} bytes (target ${TARGET_BYTES})`
            );

            if (base64Size <= TARGET_BYTES) {
              resolve(dataUrl);
            } else {
              tryAttempt(index + 1);
            }
          };

          tryAttempt(0);
        };
        img.onerror = () => reject(new Error("Failed to load image. Please ensure the file is a valid image."));
        img.src = event.target.result;
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
        // Compress and convert to base64
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
          throw new Error("The logo image is too large or invalid. Please keep it under ~420KB after compression or try a different image.");
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

        {/* Stats Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 text-left">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Products Listed</p>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <i className="fas fa-box text-purple-600 text-xl"></i>
              </div>
            </div>
          </div>
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
                      <p className="text-xs text-gray-500">PNG, JPG, GIF (aim for ~420KB or smaller after compression)</p>
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
                      <p className="text-xs text-gray-500">PNG, JPG, GIF (aim for ~420KB or smaller after compression)</p>
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
                      <p className="text-xs text-gray-500">PNG, JPG, GIF (aim for ~420KB or smaller after compression)</p>
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
