import React, { useState } from "react";
import { User, Brain } from "lucide-react";
import { useUser } from "../context/UserContext";
import { NavLink, useLocation } from "react-router-dom";

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const user = useUser();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const linkStyle = (path) => {
    return `${
      isActive(path) ? "text-blue-600 font-semibold" : "text-gray-600"
    } hover:text-blue-600 transition-colors`;
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("userId");
    localStorage.removeItem("jwtToken");
    // Redirect to login page
    window.location.href = "/login";
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">AI Study Hub</h1>
          </div>

          {/* Main Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/roadmap" className={linkStyle("/roadmap")}>
              RoadMap
            </NavLink>
            <NavLink to="/mentors" className={linkStyle("/mentors")}>
              Mentors
            </NavLink>
            <NavLink to="/learners" className={linkStyle("/learners")}>
              Learners
            </NavLink>
            <NavLink to="/add-skills" className={linkStyle("/add-skills")}>
              My Skills
            </NavLink>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => (window.location.href = "/")}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Start Learning
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <User className="w-6 h-6 text-gray-600" />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-100"
                  style={{ zIndex: 100 }}
                >
                  <NavLink
                    to={`/${user?.userId}`}
                    className={`block px-4 py-2 ${linkStyle(
                      `/${user?.userId}`
                    )}`}
                  >
                    Your Profile
                  </NavLink>
                  <NavLink
                    to="/skills"
                    className={`block px-4 py-2 ${linkStyle("/skills")}`}
                  >
                    Manage Skills
                  </NavLink>
                  <NavLink
                    to="/settings"
                    className={`block px-4 py-2 ${linkStyle("/settings")}`}
                  >
                    Settings
                  </NavLink>
                  <NavLink
                    to="/login"
                    className={`block px-4 py-2 ${linkStyle("/logout")}`}
                    onClick={handleLogout}
                  >
                    Logout
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <NavLink
            to="/roadmap"
            className={`block px-3 py-2 rounded-md ${linkStyle("/roadmap")}`}
          >
            RoadMap
          </NavLink>
          <NavLink
            to="/mentors"
            className={`block px-3 py-2 rounded-md ${linkStyle("/mentors")}`}
          >
            Mentors
          </NavLink>
          <NavLink
            to="/learners"
            className={`block px-3 py-2 rounded-md ${linkStyle("/learners")}`}
          >
            Learners
          </NavLink>
          <NavLink
            to="/skills"
            className={`block px-3 py-2 rounded-md ${linkStyle("/skills")}`}
          >
            My Skills
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Header;
