import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSave, FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { serviceService } from '../../services/serviceService';

const AdminServiceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    features: [''],
    icon: 'default-icon',
    isActive: true
  });

  useEffect(() => {
    if (id) {
      fetchService();
    }
  }, [id]);

  const fetchService = async () => {
    try {
      setLoading(true);
      const service = await serviceService.getServiceById(id);
      setFormData({
        name: service.name || '',
        description: service.description || '',
        features: service.features && service.features.length > 0 ? service.features : [''],
        icon: service.icon || 'default-icon',
        isActive: service.isActive !== undefined ? service.isActive : true
      });
    } catch (err) {
      setError('Failed to fetch service');
      console.error('Error fetching service:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index) => {
    if (formData.features.length > 1) {
      const newFeatures = formData.features.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        features: newFeatures
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name.trim()) {
      setError('Service name is required');
      return;
    }
    if (!formData.description.trim()) {
      setError('Service description is required');
      return;
    }

    // Filter out empty features
    const filteredFeatures = formData.features.filter(feature => feature.trim() !== '');

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const serviceData = {
        ...formData,
        features: filteredFeatures
      };

      if (id) {
        await serviceService.updateService(id, serviceData, user.token);
        setSuccess('Service updated successfully!');
      } else {
        await serviceService.createService(serviceData, user.token);
        setSuccess('Service created successfully!');
      }

      setTimeout(() => {
        navigate('/admin/services');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to save service');
      console.error('Error saving service:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) {
    return <div>Loading service...</div>;
  }

  return (
    <div>
      <div>
        <h1>{id ? 'Edit Service' : 'Create New Service'}</h1>
        <button 
          onClick={() => navigate('/admin/services')}
        >
          <FaTimes /> Cancel
        </button>
      </div>

      {error && <div>{error}</div>}
      {success && <div>{success}</div>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Service Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter service name"
            required
          />
        </div>

        <div>
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter service description"
            rows="4"
            required
          />
        </div>

        <div>
          <label htmlFor="icon">Icon</label>
          <select
            id="icon"
            name="icon"
            value={formData.icon}
            onChange={handleInputChange}
          >
            <option value="default-icon">Default Icon</option>
            <option value="solar">Solar Panel</option>
            <option value="fabrication">Fabrication</option>
            <option value="research">Research</option>
          </select>
        </div>

        <div>
          <label>Features</label>
          <div>
            {formData.features.map((feature, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  placeholder={`Feature ${index + 1}`}
                />
                {formData.features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addFeature}
            >
              <FaPlus /> Add Feature
            </button>
          </div>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
            />
            Active Service
          </label>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
          >
            <FaSave />
            {loading ? 'Saving...' : (id ? 'Update Service' : 'Create Service')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminServiceForm; 