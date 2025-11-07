import { useState } from "react";
import { useUser, SignOutButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function OfficeDashboard() {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("startups"); // startups, orders, messages
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  // Mock data - replace with API calls
  const [startups] = useState([]);
  const [orders] = useState([]);

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

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message = {
      id: Date.now(),
      text: newMessage,
      senderId: user.id,
      senderName: companyName || user.firstName,
      timestamp: new Date().toISOString(),
      isSent: true,
    };

    const updatedChat = {
      ...selectedChat,
      messages: [...selectedChat.messages, message],
    };

    setMessages(messages.map(m => m.id === selectedChat.id ? updatedChat : m));
    setSelectedChat(updatedChat);
    setNewMessage("");
  };

  const handleDeleteChat = (chatId) => {
    if (window.confirm("Are you sure you want to delete this conversation?")) {
      setMessages(messages.filter(m => m.id !== chatId));
      if (selectedChat?.id === chatId) {
        setSelectedChat(null);
      }
    }
  };

  const handleMessageStartup = (startup) => {
    // Find or create chat with this startup
    const existingChat = messages.find(m => m.startupId === startup.id);
    if (existingChat) {
      setSelectedChat(existingChat);
      setActiveView("messages");
    } else {
      // Create new chat
      const newChat = {
        id: Date.now(),
        startupId: startup.id,
        startupName: startup.name || startup.companyName,
        startupEmail: startup.email,
        productId: startup.productId || null,
        productName: startup.productName || null,
        messages: [],
      };
      setMessages([...messages, newChat]);
      setSelectedChat(newChat);
      setActiveView("messages");
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
            {startups.length === 0 ? (
              <div className="text-center py-12">
                <i className="fas fa-store text-gray-300 text-5xl mb-4"></i>
                <p className="text-gray-500 mb-4">No startups available yet</p>
                <p className="text-sm text-gray-400">
                  Food startups will appear here as they join the platform
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {startups.map((startup) => (
                  <div key={startup.id} className="border rounded-lg p-6 hover:shadow-lg transition">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-gray-900 mb-2">
                          {startup.name || startup.companyName}
                        </h3>
                        {startup.productName && (
                          <p className="text-red-600 font-semibold mb-2">
                            Product: {startup.productName}
                            {startup.productPrice && ` - ${startup.productPrice}`}
                          </p>
                        )}
                        <p className="text-gray-600 text-sm mb-2">{startup.description}</p>
                        {startup.email && (
                          <p className="text-gray-600 text-sm">
                            <i className="fas fa-envelope mr-2 text-red-600"></i>
                            {startup.email}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleMessageStartup(startup)}
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

    if (activeView === "orders") {
      return (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">
              <i className="fas fa-shopping-cart mr-2 text-red-600"></i>
              Orders
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              View your order history
            </p>
          </div>
          <div className="p-6">
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <i className="fas fa-shopping-cart text-gray-300 text-5xl mb-4"></i>
                <p className="text-gray-500 mb-4">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition">
                    <h3 className="font-bold text-lg">Order #{order.id}</h3>
                    <p className="text-gray-600 text-sm mt-1">From: {order.startupName}</p>
                    <p className="text-gray-600 text-sm">Date: {order.date}</p>
                    <p className="text-gray-600 text-sm">Total: ${order.total}</p>
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
                  <p className="text-sm text-gray-900">Office Manager</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
