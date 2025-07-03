import axios from 'axios';

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Simple cache for GET requests
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

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
  async (error) => {
    console.error('=== API INTERCEPTOR: RESPONSE ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error response:', error.response);
    console.error('Request URL:', error.config?.url);
    console.error('Request headers:', error.config?.headers);
    
    // Handle rate limiting with retry logic
    if (error.response?.status === 429) {
      console.log('=== RATE LIMIT DETECTED, RETRYING ===');
      const retryAfter = error.response.headers['retry-after'] || 5; // Default 5 seconds
      const delay = parseInt(retryAfter) * 1000;
      
      console.log(`Waiting ${delay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Retry the request once
      try {
        console.log('=== RETRYING REQUEST ===');
        return await api.request(error.config);
      } catch (retryError) {
        console.error('=== RETRY FAILED ===');
        return Promise.reject(retryError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Enhanced API with caching for GET requests
const enhancedApi = {
  ...api,
  get: async (url, config = {}) => {
    // Only cache GET requests
    const cacheKey = `${url}-${JSON.stringify(config.params || {})}`;
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('=== CACHE HIT ===', url);
      return cached.data;
    }
    
    try {
      const response = await api.get(url, config);
      cache.set(cacheKey, {
        data: response,
        timestamp: Date.now()
      });
      console.log('=== CACHE MISS ===', url);
      return response;
    } catch (error) {
      // If request fails, try to return cached data if available
      if (cached) {
        console.log('=== USING STALE CACHE ===', url);
        return cached.data;
      }
      throw error;
    }
  },
  
  // Clear cache for specific URL or all cache
  clearCache: (url = null) => {
    if (url) {
      // Clear specific URL cache
      for (const [key] of cache) {
        if (key.startsWith(url)) {
          cache.delete(key);
        }
      }
    } else {
      // Clear all cache
      cache.clear();
    }
    console.log('=== CACHE CLEARED ===', url || 'all');
  }
};

export default enhancedApi;
