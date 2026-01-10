import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_URL_API,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Bypass-Tunnel-Reminder': 'true',
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // or from context/store
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized (token expired, etc.)
      // Optional: redirect to login or dispatch logout
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
