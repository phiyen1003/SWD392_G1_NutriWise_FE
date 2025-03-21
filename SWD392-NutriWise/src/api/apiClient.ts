import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://swd392nutriwisewebapp-acgge4e8a2cubkh8.centralus-01.azurewebsites.net/api",
  headers: {
    "Content-Type": "application/json",
  },
});

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

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("tempToken");
      localStorage.removeItem("email");
      localStorage.removeItem("tempEmail");
      localStorage.removeItem("userId");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;