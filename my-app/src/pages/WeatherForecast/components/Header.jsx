import React, { useState, useEffect, useRef } from "react";
import { Leaf, Bell, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = ({ user }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const navigate = useNavigate();

  const profileRef = useRef(null);
  const messageRef = useRef(null);
  const notifRef = useRef(null);

  const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : "F";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileRef.current && !profileRef.current.contains(e.target) &&
        messageRef.current && !messageRef.current.contains(e.target) &&
        notifRef.current && !notifRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
        setMessageOpen(false);
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("agri-user");
    navigate("/Login");
  };

  return (
    <nav
      className="fixed top-0 left-0 w-full z-50"
      style={{
        backgroundColor: "white",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        transition: "box-shadow 0.3s ease",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 relative flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Leaf className="w-8 h-8 text-green-600" />
          <span className="text-2xl font-bold text-gray-800">AgriConnect</span>
        </div>

        {/* Center Slogan */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-green-600 via-black to-green-600 bg-clip-text text-transparent drop-shadow-md">
            Growing the Future
          </h1>
        </div>

        {/* Right Icons */}
        <div className="flex items-center space-x-4">
          {/* Messages */}
          <div ref={messageRef} className="relative flex items-center">
            <button
              onClick={() => {
                setMessageOpen(!messageOpen);
                setDropdownOpen(false);
                setNotificationOpen(false);
              }}
              className="relative"
            >
              <MessageCircle className="w-6 h-6 text-gray-700 hover:text-green-600 transition" />
              <span className="absolute -top-1 -right-1 bg-red-600 rounded-full w-2 h-2" />
            </button>
            {messageOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-md shadow-lg border z-50">
                <div className="p-4 text-sm text-gray-700">
                  <p><strong>New:</strong> Price updates available 📈</p>
                  <hr className="my-2" />
                  <p><strong>Support:</strong> We’ve received your issue ✅</p>
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div ref={notifRef} className="relative flex items-center">
            <button
              onClick={() => {
                setNotificationOpen(!notificationOpen);
                setDropdownOpen(false);
                setMessageOpen(false);
              }}
              className="relative"
            >
              <Bell className="w-6 h-6 text-gray-700 hover:text-green-600 transition" />
              <span className="absolute -top-1 -right-1 bg-red-600 rounded-full w-2 h-2" />
            </button>
            {notificationOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-md shadow-lg border z-50">
                <div className="p-4 text-sm text-gray-700">
                  <p><strong>Alert:</strong> Rain in your region 🌧️</p>
                  <hr className="my-2" />
                  <p><strong>Reminder:</strong> Fertilize today 🧪</p>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div ref={profileRef} className="relative flex items-center">
            <div
              className="bg-gray-800 text-white w-8 h-8 flex items-center justify-center rounded-full cursor-pointer hover:bg-green-600 transition"
              onClick={() => {
                setDropdownOpen(!dropdownOpen);
                setNotificationOpen(false);
                setMessageOpen(false);
              }}
            >
              {firstLetter}
            </div>
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-white border rounded-md shadow-md z-50">
                <ul className="py-2 text-sm text-gray-700">
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate("/profile")}
                  >
                    Profile
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate("/newfarmerdashboard")}
                  >
                    Dashboard
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={handleLogout}
                  >
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;