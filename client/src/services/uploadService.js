import api from './api';

const uploadService = {
  // Upload image to Firebase Storage
  uploadImage: async (file, folder = 'products') => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await api.post(`/upload/image?folder=${folder}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to upload image' };
    }
  },

  // Delete image from Firebase Storage
  deleteImage: async (public_id) => {
    try {
      const response = await api.delete('/upload/image', {
        data: { public_id }
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete image' };
    }
  },

  // Get image URL (Supabase returns the full URL directly)
  getOptimizedUrl: (public_id) => {
    // For Supabase, the public_id is the full URL
    return public_id;
  }
};

export default uploadService; 