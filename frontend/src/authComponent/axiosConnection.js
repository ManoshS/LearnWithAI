import axios from "axios";

// Get the backend URL from environment variables
const BASE_URL = process.env.REACT_APP_BACKEND_URL || "";

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
      const token = localStorage.getItem("jwtToken");
      if (token) {
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
          window.location.href = "/login";
        } else if (error.response.status === 403) {
          // Forbidden - redirect to login
          window.location.href = "/login";
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// Export the Axios instance
export default createAxiosInstance();
