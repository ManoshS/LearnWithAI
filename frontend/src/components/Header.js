import React, { useState, useEffect, useRef } from "react";
import { Brain } from "lucide-react";
import { useUser } from "../context/UserContext";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../authComponent/axiosConnection";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (userId) {
          const response = await axiosInstance.get(`/api/users/get/${userId}`);
          setUserDetails(response.data);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("jwtToken");
    navigate("/login");
  };

  const handleMenuItemClick = () => {
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { path: "/roadmap", label: "RoadMap" },
    { path: "/mentors", label: "Mentors" },
    { path: "/learners", label: "Learners" },
    { path: "/add-skills", label: "My Skills" },
  ];

  return (
    <nav className="bg-gray-900/50 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              AI Study Hub
            </h1>
          </motion.div>

          {/* Main Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <motion.button
                key={link.path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigation(link.path)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.path
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                    : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                }`}
              >
                {link.label}
              </motion.button>
            ))}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg"
            >
              Start Learning
            </motion.button>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="p-2 rounded-lg hover:bg-gray-800/50 transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-0.5">
                  <img
                    src={
                      userDetails
                        ? `https://ui-avatars.com/api/?name=${
                            userDetails.first_name + " " + userDetails.last_name
                          }&background=random`
                        : "https://ui-avatars.com/api/?name=User&background=random"
                    }
                    alt={
                      userDetails
                        ? `${userDetails.first_name} ${userDetails.last_name}`
                        : "User"
                    }
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </motion.button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-gray-800/90 backdrop-blur-lg rounded-lg shadow-xl py-1 border border-gray-700"
                    style={{ zIndex: 1000 }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        handleMenuItemClick();
                        navigate(`/${user?.userId}`);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-200"
                    >
                      Your Profile
                    </motion.button>
                    {console.log(user)}
                    {user?.user_type?.toLowerCase() == "teacher" && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          handleMenuItemClick();
                          navigate("/skills");
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-200"
                      >
                        Manage Skills
                      </motion.button>
                    )}
                    {/* <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        handleMenuItemClick();
                        navigate("/settings");
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-200"
                    >
                      Settings
                    </motion.button> */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
                    >
                      Logout
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-800/50 transition-all duration-200"
            >
              <svg
                className="w-6 h-6 text-gray-300"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gray-800/90 backdrop-blur-lg border-t border-gray-700"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <motion.button
                  key={link.path}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleNavigation(link.path)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                    location.pathname === link.path
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                      : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                  }`}
                >
                  {link.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Header;
