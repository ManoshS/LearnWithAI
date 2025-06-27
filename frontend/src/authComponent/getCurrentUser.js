import { jwtDecode } from "jwt-decode";

const getCurrentUser = () => {
  const token = localStorage.getItem("jwtToken");
  if (!token) return null;

  try {
    // Decode the JWT to get user information
    //check if the token is expired
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("userId");

      return null;
    }
    return decoded;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

export default getCurrentUser;
