import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { serviceService } from '../../services/serviceService';

const AdminServiceList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await serviceService.getServices();
      setServices(data);
    } catch (err) {
      setError('Failed to fetch services');
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await serviceService.deleteService(id, user.token);
        setServices(services.filter(service => service._id !== id));
      } catch (err) {
        setError('Failed to delete service');
        console.error('Error deleting service:', err);
      }
    }
  };

  const toggleServiceStatus = async (service) => {
    try {
      const updatedService = await serviceService.updateService(
        service._id,
        { isActive: !service.isActive },
        user.token
      );
      setServices(services.map(s => 
        s._id === service._id ? updatedService : s
      ));
    } catch (err) {
      setError('Failed to update service status');
      console.error('Error updating service:', err);
    }
  };

  if (loading) {
    return <div>Loading services...</div>;
  }

  return (
    <div>
      <div>
        <h1>Manage Services</h1>
        <Link to="/admin/services/new">
          <FaPlus /> Add New Service
        </Link>
      </div>

      {error && <div>{error}</div>}

      <div>
        <table>
          <thead>
            <tr>
              <th>Icon</th>
              <th>Name</th>
              <th>Description</th>
              <th>Features</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service._id}>
                <td>
                  <div>
                    {service.icon === 'solar' && <span>☀️</span>}
                    {service.icon === 'fabrication' && <span>⚙️</span>}
                    {service.icon === 'research' && <span>🧪</span>}
                    {!['solar', 'fabrication', 'research'].includes(service.icon) && <span>📋</span>}
                  </div>
                </td>
                <td>{service.name}</td>
                <td>
                  <div>
                    {service.description.length > 100 
                      ? `${service.description.substring(0, 100)}...` 
                      : service.description
                    }
                  </div>
                </td>
                <td>
                  <div>
                    {service.features?.length || 0} features
                  </div>
                </td>
                <td>
                  <button
                    onClick={() => toggleServiceStatus(service)}
                  >
                    {service.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td>
                  <div>
                    <Link 
                      to={`/admin/services/edit/${service._id}`}
                    >
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => handleDelete(service._id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {services.length === 0 && (
        <div>
          <p>No services found. Create your first service!</p>
          <Link to="/admin/services/new">
            <FaPlus /> Add New Service
          </Link>
        </div>
      )}
    </div>
  );
};

export default AdminServiceList; 