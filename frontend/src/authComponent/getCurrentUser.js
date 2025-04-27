import { jwtDecode } from "jwt-decode";

const getCurrentUser = () => {
  const token = localStorage.getItem("jwtToken");
  if (!token) return null;

  try {
    // Decode the JWT to get user information
    const user = jwtDecode(token);
    return user;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

export default getCurrentUser;
