import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://nutriwise.azurewebsites.net/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm interceptor để xử lý token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token") || localStorage.getItem("tempToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;