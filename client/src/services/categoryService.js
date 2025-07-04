import api from './api';

export const getCategories = async () => {
  const res = await api.get('/categories?t=' + Date.now());
  return res.data;
};

export const createCategory = async (categoryData) => {
  const res = await api.post('/categories', categoryData);
  return res.data;
}; 