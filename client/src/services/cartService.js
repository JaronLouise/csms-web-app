import api from './api';

const cartService = {
  // Get user's cart
  getCart: async () => {
    try {
      const response = await api.get('/cart');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get cart' };
    }
  },

  // Add item to cart
  addToCart: async (productId, quantity = 1) => {
    try {
      const response = await api.post('/cart/add', { productId, quantity });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add item to cart' };
    }
  },

  // Update cart item quantity
  updateCartItem: async (productId, quantity) => {
    try {
      const response = await api.put(`/cart/items/${productId}`, { quantity });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update cart item' };
    }
  },

  // Remove item from cart
  removeFromCart: async (productId) => {
    try {
      const response = await api.delete(`/cart/items/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to remove item from cart' };
    }
  },

  // Clear entire cart
  clearCart: async () => {
    try {
      const response = await api.delete('/cart/clear');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to clear cart' };
    }
  }
};

export default cartService; 