import axios from "axios";
import { jwtDecode } from "jwt-decode";
// Get the backend URL from environment variables
const BASE_URL = process.env.REACT_APP_BACKEND_URL || "";
console.log(BASE_URL);
// Function to create an Axios instance with a JWT token
const createAxiosInstance = () => {
  // Create an Axios instance
  const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Add a request interceptor to add the token before each request
  instance.interceptors.request.use(
    (config) => {
      // Do not check token or set Authorization for register or login endpoints
      const isAuthRoute =
        config.url &&
        (config.url.includes("/api/auth/register") ||
          config.url.includes("/api/auth/login"));
      if (isAuthRoute) {
        return config;
      }
      const token = localStorage.getItem("jwtToken");
      if (token) {
        // check if the token is expired
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          localStorage.removeItem("jwtToken");
          localStorage.removeItem("currentRoadmap");
          localStorage.removeItem("usrId");

          if (
            window.location.pathname !== "/login" &&
            window.location.pathname !== "/register"
          ) {
            window.location.href = "/login";
          }
        }
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add a response interceptor to handle errors
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        if (error.response.status === 401) {
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem("jwtToken");
          if (
            window.location.pathname !== "/login" &&
            window.location.pathname !== "/register"
          ) {
            window.location.href = "/login";
          }
        } else if (error.response.status === 403) {
          // Forbidden - redirect to login
          if (
            window.location.pathname !== "/login" &&
            window.location.pathname !== "/register"
          ) {
            window.location.href = "/login";
          }
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// Export the Axios instance
export default createAxiosInstance();
