import React, { useState } from "react";
import axiosInstance from "./axiosConnection";
import { useNavigate } from "react-router-dom";
import { Select } from "antd";
import { motion } from "framer-motion";
import {
  UserPlus,
  User,
  Mail,
  Lock,
  GraduationCap,
  BookOpen,
  ArrowRight,
} from "lucide-react";

const Register = () => {
  const [username, setUsername] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [user_type, setUserType] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await axiosInstance.post("/api/auth/register", {
        username,
        first_name,
        last_name,
        user_type,
        bio,
        email,
        password,
      });

      const loginResponse = await axiosInstance.post("/api/auth/login", {
        email,
        password,
      });

      const token = loginResponse.data.token;
      if (token) {
        localStorage.setItem("jwtToken", token);
        localStorage.setItem("userId", loginResponse.data.userId);
        // navigate("/");
        window.location.reload();
      } else {
        setError("Failed to retrieve token");
      }
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${loginResponse.data.token}`;

      setMessage("Registration successful!");
      navigate("/add-skills");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  const handelUserType = (value) => {
    setUserType(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Animated background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{ marginTop: "68px" }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20px 20px, #60A5FA 2px, transparent 0),
              radial-gradient(circle at 60px 60px, #60A5FA 2px, transparent 0),
              radial-gradient(circle at 100px 40px, #60A5FA 2px, transparent 0)
            `,
            backgroundSize: "100px 100px",
          }}
        />
      </div>

      <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 shadow-xl border border-gray-700"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Create Account
              </h2>
              <p className="text-gray-400 mt-2">
                Join our learning community today
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm"
              >
                {message}
              </motion.div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="First Name"
                    value={first_name}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Last Name"
                    value={last_name}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <GraduationCap className="h-5 w-5 text-gray-400" />
                </div>
                <Select
                  style={{ width: "100%" }}
                  allowClear
                  options={[
                    { value: "student", label: "I am Student" },
                    { value: "teacher", label: "I am Teacher" },
                  ]}
                  placeholder="Select your role"
                  onChange={handelUserType}
                  className="custom-select"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BookOpen className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Education"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  required
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                Create Account
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-400">
              Already have an account?{" "}
              <motion.a
                href="/login"
                className="text-blue-400 hover:text-blue-300 font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign In
              </motion.a>
            </p>
          </motion.div>
        </motion.div>
      </div>

      <style jsx global>{`
        .custom-select .ant-select-selector {
          background-color: rgba(31, 41, 55, 0.5) !important;
          border-color: rgba(75, 85, 99, 1) !important;
          color: white !important;
          height: 48px !important;
          padding: 0 12px !important;
        }
        .custom-select .ant-select-selection-item {
          background-color: rgba(59, 130, 246, 0.2) !important;
          border-color: rgba(59, 130, 246, 0.3) !important;
          color: rgb(96, 165, 250) !important;
        }
        .ant-select-dropdown {
          background-color: rgb(31, 41, 55) !important;
        }
        .ant-select-item {
          color: white !important;
        }
        .ant-select-item-option-selected {
          background-color: rgba(59, 130, 246, 0.2) !important;
        }
        .ant-select-item-option-active {
          background-color: rgba(59, 130, 246, 0.1) !important;
        }
      `}</style>
    </div>
  );
};

export default Register;
