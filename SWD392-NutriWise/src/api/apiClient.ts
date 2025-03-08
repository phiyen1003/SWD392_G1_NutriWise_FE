// src/api/apiClient.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://nutriwise.azurewebsites.net/api', // Thay bằng URL thực tế của backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để xử lý token (nếu cần)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Lấy token từ localStorage (nếu có)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;