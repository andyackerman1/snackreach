import { useState, useEffect } from "react";
import { useUser, useAuth, SignOutButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function OfficeDashboard() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("startups"); // startups, orders, messages
  const [orderFilter, setOrderFilter] = useState("active"); // active, past
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({
    email: "",
    companyName: "",
    phone: "",
    snackPreference: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for data
  const [startups, setStartups] = useState([]);
  const [orders] = useState([]);
  const [isLoadingStartups, setIsLoadingStartups] = useState(false);
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [startupProducts, setStartupProducts] = useState([]);

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

  // Initialize profile data and load messages
  useEffect(() => {
    setProfileData({
      email: user.emailAddresses[0]?.emailAddress || "",
      companyName: user.publicMetadata?.companyName || "",
      phone: user.privateMetadata?.phone || "",
      snackPreference: user.publicMetadata?.snackPreference || "",
    });
    // Load messages from Clerk metadata
    const savedMessages = user.publicMetadata?.messages || [];
    setMessages(savedMessages);
  }, [user]);

  // Fetch startups from API
  useEffect(() => {
    const fetchStartups = async () => {
      if (!user || !isLoaded) return;
      
      setIsLoadingStartups(true);
      try {
        // Get Clerk session token - getToken() returns the JWT directly
        const session = await getToken();
        console.log("🔑 Fetching startups with token:", session ? `Token received (${session.substring(0, 20)}...)` : "No token");
        
        const response = await fetch("/api/startups", {
          headers: {
            "Authorization": `Bearer ${session}`,
            "Content-Type": "application/json",
          },
        });

        console.log("📡 Response status:", response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log("✅ Received startups:", data.length, data);
          if (Array.isArray(data)) {
            setStartups(data);
          } else {
            console.error("❌ Data is not an array:", data);
            setStartups([]);
          }
        } else {
          const errorText = await response.text();
          console.error("❌ Failed to fetch startups:", response.status, errorText);
          try {
            const errorData = JSON.parse(errorText);
            console.error("❌ Error details:", errorData);
          } catch (e) {
            console.error("❌ Error response is not JSON:", errorText);
          }
        }
      } catch (error) {
        console.error("❌ Error fetching startups:", error);
      } finally {
        setIsLoadingStartups(false);
      }
    };

    fetchStartups();
  }, [user, isLoaded]);

  const handleOpenEditProfile = () => {
    setProfileData({
      email: user.emailAddresses[0]?.emailAddress || "",
      companyName: user.publicMetadata?.companyName || "",
      phone: user.privateMetadata?.phone || "",
      snackPreference: user.publicMetadata?.snackPreference || "",
    });
    setShowEditProfileModal(true);
  };

  const handleCloseEditProfile = () => {
    setShowEditProfileModal(false);
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
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
          snackPreference: profileData.snackPreference,
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

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const session = await getToken();
      
      // Determine recipient ID - for offices, recipient is the startup
      const recipientId = selectedChat.startupId;
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

  const handleMessageStartup = async (startup) => {
    // Find or create chat with this startup
    const existingChat = messages.find(m => 
      m.startupId === startup.id || 
      (m.startupId === startup.id && m.officeId === user.id)
    );
    if (existingChat) {
      setSelectedChat(existingChat);
      setActiveView("messages");
    } else {
      // Create new chat with proper structure
      const chatId = `chat_${user.id}_${startup.id}`;
      const newChat = {
        id: chatId,
        startupId: startup.id,
        officeId: user.id,
        startupName: startup.name || startup.companyName,
        officeName: companyName || user.firstName,
        startupEmail: startup.email,
        productId: startup.productId || null,
        productName: startup.productName || null,
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
  };

  const handleViewStartup = async (startup) => {
    setSelectedStartup(startup);
    
    // Fetch products for this startup
    try {
      const session = await getToken();
      const response = await fetch(`/api/products/${startup.id}`, {
        headers: {
          "Authorization": `Bearer ${session}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const products = await response.json();
        setStartupProducts(products);
      } else {
        console.error("Failed to fetch products:", response.statusText);
        setStartupProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setStartupProducts([]);
    }
  };

  const renderMainContent = () => {
    if (activeView === "startups") {
      return (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">
              <i className="fas fa-search mr-2 text-red-600"></i>
              Discover Food Startups
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Browse innovative snack companies offering office discounts
            </p>
          </div>
          <div className="p-6">
            {isLoadingStartups ? (
              <div className="text-center py-12">
                <i className="fas fa-spinner fa-spin text-gray-400 text-5xl mb-4"></i>
                <p className="text-gray-500 mb-4">Loading startups...</p>
              </div>
            ) : startups.length === 0 ? (
              <div className="text-center py-12">
                <i className="fas fa-store text-gray-300 text-5xl mb-4"></i>
                <p className="text-gray-500 mb-4">No startups available yet</p>
                <p className="text-sm text-gray-400 mb-4">
                  Food startups will appear here as they join the platform
                </p>
                <button
                  onClick={async () => {
                    try {
                      const session = await getToken();
                      const response = await fetch("/api/test-startups");
                      const data = await response.json();
                      console.log("🧪 Test endpoint result:", data);
                      alert(`Test Results:\nTotal Users: ${data.totalUsers}\nStartup Users: ${data.startupUsers}\nCheck console for details.`);
                    } catch (error) {
                      console.error("Test error:", error);
                      alert("Test failed - check console");
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  🧪 Test API Connection
                </button>
              </div>
            ) : selectedStartup ? (
              <div>
                <button
                  onClick={() => setSelectedStartup(null)}
                  className="mb-4 px-4 py-2 text-gray-600 hover:text-gray-900 transition"
                >
                  <i className="fas fa-arrow-left mr-2"></i>
                  Back to Startups
                </button>
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-start gap-6 mb-6">
                    {selectedStartup.logo && (
                      <img
                        src={selectedStartup.logo}
                        alt={selectedStartup.companyName || selectedStartup.name}
                        className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                      />
                    )}
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {selectedStartup.companyName || selectedStartup.name}
                      </h2>
                      {selectedStartup.description && (
                        <p className="text-gray-600 mb-4">{selectedStartup.description}</p>
                      )}
                      {selectedStartup.email && (
                        <p className="text-gray-600 text-sm">
                          <i className="fas fa-envelope mr-2 text-red-600"></i>
                          {selectedStartup.email}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleMessageStartup(selectedStartup)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      <i className="fas fa-comment mr-2"></i>
                      Message
                    </button>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Products</h3>
                    {startupProducts.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">
                        No products listed yet
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {startupProducts.map((product) => (
                          <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition">
                            {product.image && (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-48 object-cover rounded-lg mb-3"
                              />
                            )}
                            <h4 className="font-bold text-lg mb-2">{product.name}</h4>
                            {product.description && (
                              <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                            )}
                            {product.price && (
                              <p className="text-red-600 font-semibold">{product.price}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {startups.map((startup) => (
                  <div 
                    key={startup.id} 
                    className="border rounded-lg p-6 hover:shadow-lg transition cursor-pointer"
                    onClick={() => handleViewStartup(startup)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4 flex-1">
                        {startup.logo && (
                          <img
                            src={startup.logo}
                            alt={startup.companyName || startup.name}
                            className="w-20 h-20 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-bold text-xl text-gray-900 mb-2">
                            {startup.companyName || startup.name}
                          </h3>
                          {startup.companyName && startup.name && startup.name !== startup.companyName && (
                            <p className="text-sm text-gray-500 mb-2">{startup.name}</p>
                          )}
                          {startup.description && (
                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{startup.description}</p>
                          )}
                          {startup.email && (
                            <p className="text-gray-600 text-sm">
                              <i className="fas fa-envelope mr-2 text-red-600"></i>
                              {startup.email}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMessageStartup(startup);
                        }}
                        className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex-shrink-0"
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

    if (activeView === "orders") {
      const filteredOrders = orderFilter === "active" 
        ? orders.filter(order => order.status === "active")
        : orders.filter(order => order.status === "completed" || order.status === "cancelled" || order.status === "past");

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
                  View your order history
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
                        <p className="text-gray-600 text-sm mt-1">From: {order.startupName}</p>
                        <p className="text-gray-600 text-sm">Date: {order.date}</p>
                        <p className="text-gray-600 text-sm">Total: ${order.total}</p>
                        {order.status && (
                          <p className="text-sm mt-2">
                            <span className={`px-2 py-1 rounded ${
                              order.status === "active" 
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </p>
                        )}
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

    if (activeView === "messages") {
      return (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                <i className="fas fa-comments mr-2 text-red-600"></i>
                Messages
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Communicate with food startups
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
                              {chat.startupName}
                            </h4>
                            {chat.productName && (
                              <p className="text-xs text-red-600 mt-1">
                                {chat.productName}
                              </p>
                            )}
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
                    <h3 className="font-semibold text-gray-900">{selectedChat.startupName}</h3>
                    {selectedChat.productName && (
                      <p className="text-xs text-red-600 mt-1">
                        About: {selectedChat.productName}
                      </p>
                    )}
                    {selectedChat.startupEmail && (
                      <p className="text-xs text-gray-500 mt-1">{selectedChat.startupEmail}</p>
                    )}
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
                {user.firstName} {user.lastName}
                {companyName && ` • ${companyName}`}
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
            Welcome, {user.firstName}!
          </h1>
          <p className="text-gray-600">
            Discover discounted snacks from innovative food startups
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => setActiveView("startups")}
            className={`bg-white rounded-lg shadow p-6 text-left hover:shadow-lg transition ${
              activeView === "startups" ? "ring-2 ring-red-600" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Available Startups</p>
                <p className="text-2xl font-bold text-gray-900">{startups.length}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <i className="fas fa-store text-blue-600 text-xl"></i>
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
                <p className="text-sm text-gray-600 mb-1">Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.length}
                </p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <i className="fas fa-shopping-cart text-green-600 text-xl"></i>
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
                {user.publicMetadata?.snackPreference && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">Snack Preferences</p>
                    <p className="text-sm text-gray-900">{user.publicMetadata.snackPreference}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Account Type</p>
                  <p className="text-sm text-gray-900">Office Manager</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

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
              <div className="mb-6">
                <label htmlFor="profile-snack-preference" className="block text-sm font-medium text-gray-700 mb-2">
                  Snack Preferences
                </label>
                <input
                  type="text"
                  id="profile-snack-preference"
                  name="snackPreference"
                  value={profileData.snackPreference}
                  onChange={handleProfileInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  placeholder="e.g., Healthy, Organic, Gluten-free, Vegan, Protein-rich, etc."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Describe the types of snacks you're looking for. This helps food startups find you when searching.
                </p>
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
    </div>
  );
}
