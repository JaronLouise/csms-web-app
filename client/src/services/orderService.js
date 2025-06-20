import api from './api';

export const createOrder = async (orderData) => {
  const res = await api.post('/orders', orderData);
  return res.data;
};

export const getMyOrders = async () => {
  const res = await api.get('/orders');
  return res.data;
};

export const getOrderById = async (orderId) => {
  const res = await api.get(`/orders/${orderId}`);
  return res.data;
};

export const cancelOrder = async (orderId) => {
  const res = await api.put(`/orders/${orderId}/cancel`);
  return res.data;
}; 