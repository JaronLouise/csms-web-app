import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Profile = () => {
  const { user, updateUserProfile, token } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Profile picture upload state
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [profilePic, setProfilePic] = useState(user?.profilePicture || '/placeholder.png');

  useEffect(() => {
    setProfilePic(user?.profilePicture || '/placeholder.png');
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) return;
    setUploading(true);
    setError(null);
    setSuccess(null);
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);
      
      const response = await api.post('/profile/picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const data = response.data;
      setSuccess('Profile picture updated!');
      setSelectedImage(null);
      setPreviewUrl(null);
      setProfilePic(data.profilePicture); // Update the displayed image immediately
      
      // Update the user context with the new profile picture
      if (data.user) {
        // Force a re-render by updating the user state
        window.location.reload(); // Simple approach to refresh user data
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.profile?.phone || '',
        address: {
          street: user.profile?.address?.street || '',
          city: user.profile?.address?.city || '',
          state: user.profile?.address?.state || '',
          zipCode: user.profile?.address?.zipCode || ''
        }
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Form validation
    if (!formData.name.trim()) {
      setError('Name is required');
      setLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setError('Email is required');
      setLoading(false);
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      await updateUserProfile(formData);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to current user data
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.profile?.phone || '',
      address: {
        street: user.profile?.address?.street || '',
        city: user.profile?.address?.city || '',
        state: user.profile?.address?.state || '',
        zipCode: user.profile?.address?.zipCode || ''
      }
    });
    setIsEditing(false);
    setError(null);
    setSuccess(null);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Profile Management</h2>

      {/* Profile Picture Upload UI */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
        <img
          src={previewUrl || profilePic}
          alt="Profile"
          style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', border: '2px solid #eee', marginBottom: 12 }}
        />
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          id="profile-pic-input"
          onChange={handleImageChange}
        />
        <label htmlFor="profile-pic-input" style={{ cursor: 'pointer', color: '#007bff', marginBottom: 8 }}>
          {selectedImage ? 'Change' : 'Choose'} Profile Picture
        </label>
        {selectedImage && (
          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading}
            style={{ background: '#28a745', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 600, cursor: 'pointer', marginBottom: 8 }}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        )}
      </div>

      {error && <p style={{ color: 'red', textAlign: 'center', padding: '10px', backgroundColor: '#ffe6e6', borderRadius: '5px' }}>{error}</p>}
      {success && <p style={{ color: 'green', textAlign: 'center', padding: '10px', backgroundColor: '#e6ffe6', borderRadius: '5px' }}>{success}</p>}

      <form onSubmit={handleSubmit} style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            disabled={!isEditing}
            required
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={!isEditing}
            required
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Phone:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            disabled={!isEditing}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <h3 style={{ borderBottom: '2px solid #007bff', paddingBottom: '5px' }}>Address</h3>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Street:</label>
            <input
              type="text"
              name="address.street"
              value={formData.address.street}
              onChange={handleInputChange}
              disabled={!isEditing}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>City:</label>
            <input
              type="text"
              name="address.city"
              value={formData.address.city}
              onChange={handleInputChange}
              disabled={!isEditing}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>State/Province:</label>
            <input
              type="text"
              name="address.state"
              value={formData.address.state}
              onChange={handleInputChange}
              disabled={!isEditing}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>ZIP Code:</label>
            <input
              type="text"
              name="address.zipCode"
              value={formData.address.zipCode}
              onChange={handleInputChange}
              disabled={!isEditing}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          {!isEditing ? (
            <button 
              type="button" 
              onClick={() => setIsEditing(true)}
              style={{ 
                backgroundColor: '#007bff', 
                color: 'white', 
                padding: '10px 20px', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Edit Profile
            </button>
          ) : (
            <div>
              <button 
                type="submit" 
                disabled={loading}
                style={{ 
                  backgroundColor: '#28a745', 
                  color: 'white', 
                  padding: '10px 20px', 
                  border: 'none', 
                  borderRadius: '4px', 
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  marginRight: '10px'
                }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                type="button" 
                onClick={handleCancel}
                style={{ 
                  backgroundColor: '#6c757d', 
                  color: 'white', 
                  padding: '10px 20px', 
                  border: 'none', 
                  borderRadius: '4px', 
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </form>

      <div style={{ marginTop: '30px', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
        <h3 style={{ borderBottom: '2px solid #007bff', paddingBottom: '5px' }}>Account Information</h3>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Member since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
      </div>

      {/* Orders section for non-admin users */}
      {user.role !== 'admin' && (
        <div style={{ marginTop: '30px', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
          <h3 style={{ borderBottom: '2px solid #007bff', paddingBottom: '5px' }}>My Orders</h3>
          <p style={{ marginBottom: '15px' }}>View and manage your order history.</p>
          <Link 
            to="/orders"
            style={{
              backgroundColor: '#17a2b8',
              color: 'white',
              padding: '10px 20px',
              textDecoration: 'none',
              borderRadius: '4px',
              display: 'inline-block',
              fontSize: '16px'
            }}
          >
            View Orders
          </Link>
        </div>
      )}
    </div>
  );
};

export default Profile; 