import axios from 'axios';

// Debugging: Cek apakah variabel terbaca
console.log("Base URL:", import.meta.env.VITE_API_BASE_URL);

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080', // Fallback aman
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menyertakan token secara otomatis
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;