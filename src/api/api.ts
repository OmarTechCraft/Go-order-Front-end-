import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://go-order.koyeb.app", // replace with your actual base URL
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 100000, // optional: timeout after 10 seconds
  allowAbsoluteUrls: true, // Ensuring URLs with query params work correctly
});

// Add an interceptor to include the token in all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
