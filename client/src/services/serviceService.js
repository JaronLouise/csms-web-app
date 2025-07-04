const API_URL = 'http://localhost:5000/api';

export const serviceService = {
  // Get all services
  getServices: async () => {
    try {
      const response = await fetch(`${API_URL}/services?t=${Date.now()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  },

  // Get single service by ID
  getServiceById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/services/${id}?t=${Date.now()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch service');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching service:', error);
      throw error;
    }
  },

  // Create new service (Admin only)
  createService: async (serviceData, token) => {
    try {
      const response = await fetch(`${API_URL}/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(serviceData)
      });
      if (!response.ok) {
        throw new Error('Failed to create service');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  },

  // Update service (Admin only)
  updateService: async (id, serviceData, token) => {
    try {
      const response = await fetch(`${API_URL}/services/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(serviceData)
      });
      if (!response.ok) {
        throw new Error('Failed to update service');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating service:', error);
      throw error;
    }
  },

  // Delete service (Admin only)
  deleteService: async (id, token) => {
    try {
      const response = await fetch(`${API_URL}/services/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to delete service');
      }
      return await response.json();
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  }
}; 