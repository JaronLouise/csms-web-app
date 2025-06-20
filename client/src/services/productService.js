import api from './api';

export const getProducts = async () => {
  const res = await api.get('/products');
  return res.data;
};
