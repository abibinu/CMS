// Axios HTTP client configuration
// Handles API communication with Django backend, JWT authentication, and error handling

import axios from 'axios';

// Create an Axios instance with base URL pointing to Django backend
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Django backend API endpoint
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle authentication errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Redirect to login if token is invalid or expired (401 Unauthorized)
    if (error.response && error.response.status === 401) {
      // Clear stored auth data
      localStorage.removeItem('access_token');
      localStorage.removeItem('role');
      localStorage.removeItem('staff_id');
      
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
