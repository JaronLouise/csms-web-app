import api from './api';

export const getProducts = async () => {
  const res = await api.get('/products?t=' + Date.now());
  return res.data;
};

export const getProductById = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};
