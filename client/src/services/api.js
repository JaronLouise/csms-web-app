import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // change if backend URL differs
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
    console.log('Headers:', config.headers);
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token added to request');
    } else {
      console.log('No token found in localStorage');
    }
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
    return Promise.reject(error);
  }
);

export default api;
