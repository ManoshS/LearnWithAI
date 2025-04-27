import React, { useState } from "react";
import axiosInstance from "./axiosConnection";
import { useNavigate } from "react-router-dom";
import { Select } from "antd"; // Import Select from antd
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
      // Register the user
      await axiosInstance.post("/api/auth/register", {
        username,
        first_name,
        last_name,
        user_type,
        bio,
        email,
        password,
      });

      // Automatically login after successful registration
      const loginResponse = await axiosInstance.post("/api/auth/login", {
        email,
        password,
      });

      const token = loginResponse.data.token;
      if (token) {
        // Store the JWT token in local storage
        localStorage.setItem("jwtToken", token);
        localStorage.setItem("userId", loginResponse.data.userId); // Adjust according to your login response structure
        console.log("Login successful:", loginResponse.data);
        navigate("/");
        // Redirect or update UI as needed
      } else {
        setError("Failed to retrieve token");
      }
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${loginResponse.data.token}`;

      // Redirect to skills page
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
      <div className="w-full max-w-md p-8 space-y-4   bg-white shadow-xl rounded-lg">
        <h2 className="text-2xl font-bold text-center">Register</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {message && <p className="text-green-500 text-sm">{message}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="User Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Fist Name"
            value={first_name}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Last Name"
            value={last_name}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <Select
            style={{ width: 150 }}
            allowClear
            options={[
              { value: "student", label: "I am Student" },
              { value: "teacher", label: "I am Teacher" },
            ]}
            placeholder="select it"
            onChange={handelUserType}
          />
          {/* <InputLabel id="demo-simple-select-label">
            Select Type of user
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={user_type}
            label="user_type"
            onChange={(e) => setUserType(e.target.value)}
          >
            <MenuItem value={"student"}>Student</MenuItem>
            <MenuItem value={"teacher"}>Teacher</MenuItem>
          </Select> */}

          {/* <input
            type="select"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="User Type"
            value={user_type}
            onChange={(e) => setUserType(e.target.value)}
            required

          /> */}

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
          <input
            type="password"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Education"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Register
          </button>
        </form>
        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
