import api from './api';

export const register = async (userData) => {
  const res = await api.post('/auth/register', userData);
  return res.data;
};

export const login = async (credentials) => {
  const res = await api.post('/auth/login', credentials);
  return res.data;
};

export const getProfile = async (token) => {
  const res = await api.get('/auth/profile', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
};

export const updateProfile = async (profileData) => {
  const res = await api.put('/auth/profile', profileData);
  return res.data;
};
