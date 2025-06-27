import axios from 'axios';

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    console.log('=== API INTERCEPTOR: REQUEST ===');
    console.log('URL:', config.url);
    console.log('Method:', config.method);
    console.log('Base URL:', config.baseURL);
    console.log('Full URL:', config.baseURL + config.url);
    
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token ? 'EXISTS' : 'NOT FOUND');
    console.log('Token value:', token);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token added to request headers:', config.headers.Authorization);
    } else {
      console.log('No token found in localStorage');
    }
    console.log('Final headers:', config.headers);
    return config;
  },
  (error) => {
    console.error('=== API INTERCEPTOR: REQUEST ERROR ===');
    console.error(error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to track responses
api.interceptors.response.use(
  (response) => {
    console.log('=== API INTERCEPTOR: RESPONSE SUCCESS ===');
    console.log('Status:', response.status);
    console.log('URL:', response.config.url);
    return response;
  },
  (error) => {
    console.error('=== API INTERCEPTOR: RESPONSE ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error response:', error.response);
    console.error('Request URL:', error.config?.url);
    console.error('Request headers:', error.config?.headers);
    return Promise.reject(error);
  }
);

export default api;
