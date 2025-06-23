import api from './api';

const emailService = {
  // Send contact form email
  sendContactEmail: async (contactData) => {
    try {
      const response = await api.post('/emails/contact', contactData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to send contact email' };
    }
  },

  // Send quote request email
  sendQuoteEmail: async (quoteData) => {
    try {
      const response = await api.post('/emails/quote', quoteData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to send quote request' };
    }
  },

  // Send order confirmation email (admin only)
  sendOrderConfirmation: async (orderId, orderData) => {
    try {
      const response = await api.post(`/emails/order-confirmation/${orderId}`, orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to send order confirmation email' };
    }
  },

  // Send order status update email (admin only)
  sendOrderStatusUpdate: async (orderId, statusData) => {
    try {
      const response = await api.post(`/emails/order-status-update/${orderId}`, statusData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to send order status update email' };
    }
  }
};

export default emailService; 