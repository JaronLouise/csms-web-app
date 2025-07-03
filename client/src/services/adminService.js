import api from './api';

export const getAllProducts = async () => {
  const res = await api.get('/products');
  return res.data;
};

export const createProduct = async (productData) => {
  const res = await api.post('/products', productData);
  return res.data;
};

export const updateProduct = async (productId, productData) => {
  console.log('=== FRONTEND: SENDING UPDATE REQUEST ===');
  console.log('Product ID:', productId);
  console.log('Request URL:', `/products/${productId}`);
  console.log('Request method: PUT');
  console.log('Request data:', productData);
  
  try {
    const res = await api.put(`/products/${productId}`, productData);
    console.log('=== FRONTEND: REQUEST SUCCESSFUL ===');
    console.log('Response status:', res.status);
    console.log('Response data:', res.data);
    return res.data;
  } catch (error) {
    console.error('=== FRONTEND: REQUEST FAILED ===');
    console.error('Error:', error);
    console.error('Error message:', error.message);
    console.error('Error response:', error.response);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  const res = await api.delete(`/products/${productId}`);
  return res.data;
};

export const getProductById = async (productId) => {
  console.log('=== ADMIN SERVICE: GET PRODUCT BY ID ===');
  console.log('Product ID:', productId);
  console.log('Request URL:', `/products/${productId}`);
  
  try {
    const res = await api.get(`/products/${productId}`);
    console.log('=== ADMIN SERVICE: REQUEST SUCCESSFUL ===');
    console.log('Response status:', res.status);
    console.log('Product name:', res.data.name);
    return res.data;
  } catch (error) {
    console.error('=== ADMIN SERVICE: REQUEST FAILED ===');
    console.error('Error:', error);
    console.error('Error message:', error.message);
    console.error('Error response:', error.response);
    throw error;
  }
};

export const getAllOrders = async () => {
  const res = await api.get('/orders/admin/all');
  return res.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const res = await api.put(`/orders/${orderId}/status`, { status });
  return res.data;
};

// User Management
export const getAllUsers = async () => {
  const res = await api.get('/admin/users');
  return res.data;
};

export const getUserById = async (userId) => {
  const res = await api.get(`/admin/users/${userId}`);
  return res.data;
};

export const updateUser = async (userId, userData) => {
  const res = await api.put(`/admin/users/${userId}`, userData);
  return res.data;
};

export const deleteUser = async (userId) => {
  const res = await api.delete(`/admin/users/${userId}`);
  return res.data;
}; 