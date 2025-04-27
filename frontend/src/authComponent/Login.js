import React, { useState } from "react";
import axiosInstance from "./axiosConnection";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/api/auth/login", {
        email,
        password,
      });

      // Assuming the token is in `response.data.token`
      const token = response.data.token;
      if (token) {
        // Store the JWT token in local storage
        localStorage.setItem("jwtToken", token);
        localStorage.setItem("userId", response.data.userId); // Adjust according to your login response structure
        console.log("Login successful:", response.data);
        navigate("/");
        // Redirect or update UI as needed
      } else {
        setError("Failed to retrieve token");
      }
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-100"
      style={{
        backgroundImage: `
              radial-gradient(circle at 20px 20px, #8b4513 2px, transparent 0),
              radial-gradient(circle at 60px 60px, #8b4513 2px, transparent 0),
              radial-gradient(circle at 100px 40px, #8b4513 2px, transparent 0)
            `,
        backgroundSize: "100px 100px",
      }}
    >
      <div className="w-full max-w-md p-8 space-y-4 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Login
          </button>
        </form>
        <p className="text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
