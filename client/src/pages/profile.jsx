import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { getMyOrders, cancelOrder } from '../services/orderService';

const styles = {
  bgGreen: {
    background: 'linear-gradient(180deg, #b2f0e6 0%, #d0f7c6 70%)',
    paddingTop: '12px',
    paddingBottom: '12px',
    fontFamily: 'Poppins, sans-serif',
    minHeight: '100vh',
    width: '100vw',
    boxSizing: 'border-box',
    overflowX: 'hidden',
  },
  sectionContainer: {
    width: '100%',
    maxWidth: 1400,
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: '16px',
    paddingRight: '16px',
    boxSizing: 'border-box',
  },
  profileCard: {
    background: '#fff',
    boxShadow: '0 6px 32px rgba(0,0,0,0.10)',
    borderRadius: '1.25rem',
    maxWidth: 800,
    margin: '0 auto',
    position: 'relative',
    overflow: 'visible',
  },
};

const Profile = () => {
  const { user, updateUserProfile, token, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Profile picture upload state
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [profilePic, setProfilePic] = useState(user?.profilePicture ? user.profilePicture + '?t=' + Date.now() : '/placeholder.png');

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);
  const [showOrders, setShowOrders] = useState(false);
  const [cancelingOrderId, setCancelingOrderId] = useState(null);

  useEffect(() => {
    if (user?.profilePicture) {
      setProfilePic(user.profilePicture + '?t=' + Date.now());
    } else {
      setProfilePic('/placeholder.png');
    }
  }, [user]);

  useEffect(() => {
    const fetchOrders = async () => {
      setOrdersLoading(true);
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch (err) {
        setOrdersError('Failed to load orders.');
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, []);

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
      setProfilePic(data.profilePicture + '?t=' + Date.now());
      console.log('Profile picture URL from upload response:', data.profilePicture);
      // Wait 1 second before refreshing user data
      setTimeout(async () => {
        await refreshUser();
        console.log('Profile picture URL from refreshed user:', user?.profilePicture);
      }, 1000);
      
    } catch (err) {
      console.error('Upload error:', err);
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

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelingOrderId(orderId);
    try {
      await cancelOrder(orderId);
      setOrders(orders => orders.map(o => o._id === orderId ? { ...o, status: 'cancelled' } : o));
    } catch (err) {
      alert('Failed to cancel order.');
    } finally {
      setCancelingOrderId(null);
    }
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
          font-family: 'Poppins', sans-serif;
        }
        html, body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          width: 100%;
        }
        #root {
          width: 100%;
        }
        .profile-header { 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          padding: 3rem 2rem 2rem 2rem; 
          border-radius: 1.25rem 1.25rem 0 0; 
          background: #fff; 
          position: relative; 
        }
        .profile-edit-btn { 
          position: absolute; 
          top: 1.5rem; 
          right: 2rem; 
          background: #fff; 
          color: #28a745; 
          border: 1.5px solid #28a745; 
          border-radius: 32px; 
          padding: 0.75rem 1.5rem; 
          font-size: 1rem; 
          font-weight: 600; 
          font-family: 'Poppins', sans-serif; 
          box-shadow: 0 4px 20px rgba(40,167,69,0.13); 
          cursor: pointer; 
          z-index: 3; 
          transition: all 0.3s ease; 
        }
        .profile-edit-btn:hover { 
          background: #28a745; 
          color: #fff; 
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(40,167,69,0.25);
        }
        .profile-pic-area { position: relative; margin-bottom: 1.5rem; }
        .profile-pic-circle { 
          width: 120px; 
          height: 120px; 
          border-radius: 50%; 
          background: linear-gradient(135deg, #e8fbe8 0%, #28a745 100%); 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          border: 3px solid #e5e7eb; 
          position: relative; 
          box-shadow: 0 4px 20px rgba(40,167,69,0.13);
        }
        .profile-pic-img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
        .profile-pic-placeholder { font-size: 48px; color: #28a745; }
        .profile-pic-add { 
          position: absolute; 
          right: -8px; 
          bottom: -8px; 
          background: #fff; 
          border-radius: 50%; 
          width: 36px; 
          height: 36px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          border: 2px solid #28a745; 
          box-shadow: 0 4px 20px rgba(40,167,69,0.13); 
          cursor: pointer; 
          z-index: 2; 
          transition: all 0.3s ease; 
        }
        .profile-pic-add span { color: #28a745; font-size: 1.5rem; font-weight: 700; line-height: 1; }
        .profile-pic-add:hover { 
          background: #e8fbe8; 
          border: 2px solid #28a745; 
          transform: scale(1.1);
        }
        .profile-info-name { 
          font-size: 1.5rem; 
          font-weight: 700; 
          color: #222; 
          margin-bottom: 0.5rem; 
          text-align: center; 
        }
        .profile-info-role { 
          font-size: 1.1rem; 
          color: #666; 
          font-weight: 500; 
          margin-bottom: 0.5rem; 
          text-align: center; 
        }
        .profile-info-address { 
          font-size: 1rem; 
          color: #888; 
          font-weight: 400; 
          margin-bottom: 0.5rem; 
          text-align: center; 
          line-height: 1.2; 
        }
        .profile-info-date { 
          font-size: 0.9rem; 
          color: #999; 
          font-weight: 400; 
          text-align: center; 
        }
        .profile-form-section { 
          background: #f8f9fa;
          border-radius: 0 0 1.25rem 1.25rem;
          padding: 2rem 2rem 0.5rem 2rem;
        }
        .profile-form-title { 
          font-size: 1.25rem; 
          font-weight: 600; 
          color: #222; 
          margin-bottom: 1.5rem; 
          letter-spacing: 0.01em; 
          border-bottom: 2px solid #28a745; 
          padding-bottom: 0.5rem; 
          text-align: center; 
        }
        .profile-form-grid {
          display: grid;
          grid-template-columns: 1fr;
          column-gap: 1rem;
          row-gap: 0.5rem;
          margin-bottom: 0;
          width: 100%;
        }
        @media (min-width: 768px) {
          .profile-form-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        .profile-form-row { 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          margin-bottom: 1rem; 
        }
        .profile-form-label { 
          font-weight: 500; 
          font-size: 1rem; 
          color: #222; 
          text-align: center; 
          margin-bottom: 0.5rem; 
        }
        .profile-form-input { 
          width: 70%; 
          max-width: 400px; 
          padding: 0.75rem 1rem; 
          border: 1.5px solid #ddd; 
          border-radius: 12px; 
          background: #fff; 
          font-size: 1rem; 
          margin-bottom: 0; 
          box-sizing: border-box; 
          box-shadow: 0 2px 12px rgba(40,167,69,0.06); 
          font-family: 'Poppins', sans-serif; 
          transition: border 0.2s, box-shadow 0.2s;
          color: #222;
        }
        .profile-form-input:focus {
          border: 1.5px solid #28a745;
          box-shadow: 0 4px 20px rgba(40,167,69,0.13);
          outline: none;
        }
        .profile-form-input:disabled {
          background: #f8f9fa;
          color: #888;
        }
        .address-field { 
          display: flex; 
          flex-direction: column; 
          width: 100%; 
          margin-bottom: 0;
          padding-bottom: 0;
        }
        .address-label { 
          font-weight: 500; 
          font-size: 1rem; 
          color: #222; 
          text-align: left; 
          margin-bottom: 0.5rem; 
          padding-left: 0.5rem; 
        }
        .address-input { 
          width: 90%; 
          max-width: none; 
          padding: 0.75rem 1rem; 
          border: 1.5px solid #ddd; 
          border-radius: 12px; 
          background: #fff; 
          font-size: 1rem; 
          margin-bottom: 0; 
          box-sizing: border-box; 
          box-shadow: 0 2px 12px rgba(40,167,69,0.06); 
          font-family: 'Poppins', sans-serif; 
          transition: border 0.2s, box-shadow 0.2s;
          color: #222;
        }
        .address-input:focus {
          border: 1.5px solid #28a745;
          box-shadow: 0 4px 20px rgba(40,167,69,0.13);
          outline: none;
        }
        .address-input:disabled {
          background: #f8f9fa;
          color: #888;
        }
        .profile-btn-row { 
          display: flex; 
          flex-direction: row; 
          gap: 1rem; 
          justify-content: center; 
          align-items: center; 
          margin-top: 1.5rem; 
        }
        .profile-btn-pill { 
          border-radius: 32px; 
          font-size: 1rem; 
          font-weight: 600; 
          font-family: 'Poppins', sans-serif; 
          box-shadow: 0 4px 20px rgba(40,167,69,0.13); 
          padding: 0.75rem 2rem; 
          border: none; 
          cursor: pointer; 
          transition: all 0.3s ease; 
        }
        .profile-btn-save { 
          background: #16a34a;
          color: #fff;
          border-radius: 0.5rem;
          padding: 0.5rem 1.25rem;
          font-weight: 600;
        }
        .profile-btn-save:hover { 
          background: #15803d;
        }
        .profile-btn-cancel { 
          background: #dc3545; 
          color: #fff; 
        }
        .profile-btn-cancel:hover { 
          background: #b91c1c; 
          transform: translateY(-2px);
        }
        .profile-feedback { 
          width: 100%; 
          margin-top: 1rem; 
        }
        .profile-feedback-error { 
          color: #b91c1c; 
          background: #ffe6e6; 
          text-align: center; 
          padding: 1rem; 
          border-radius: 12px; 
          font-size: 1rem; 
          font-weight: 500; 
          margin-bottom: 0.5rem; 
          border: 1px solid #fecaca;
        }
        .profile-feedback-success { 
          color: #065f46; 
          background: #d1fae5; 
          text-align: center; 
          padding: 1rem; 
          border-radius: 12px; 
          font-size: 1rem; 
          font-weight: 500; 
          margin-bottom: 0.5rem; 
          border: 1px solid #a7f3d0;
        }
        .profile-orders-card { 
          background: #fff;
          border-radius: 1rem;
          box-shadow: 0 2px 12px rgba(40,167,69,0.08);
          padding: 2rem;
          margin-top: 0.5rem;
          text-align: center;
        }
        .profile-orders-title { 
          font-size: 1.25rem; 
          font-weight: 700; 
          color: #222; 
          border-bottom: 2px solid #28a745; 
          padding-bottom: 0.5rem; 
          margin-bottom: 1rem; 
          display: inline-block; 
        }
        .profile-orders-desc { 
          font-size: 1rem; 
          color: #666; 
          margin-bottom: 1rem; 
        }
        .profile-orders-btn {
          background: #16a34a;
          color: #fff;
          border-radius: 0.5rem;
          padding: 0.5rem 1.25rem;
          font-size: 1rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
          text-decoration: none;
          display: inline-block;
        }
        .profile-orders-btn:hover {
          background: #15803d;
        }
        @media (max-width: 768px) {
          .profile-card {
            max-width: 95%;
            margin: 0 1rem;
          }
          .profile-header, .profile-form-section { 
            padding: 1.5rem 1rem; 
          }
          .profile-form-grid { 
            grid-template-columns: 1fr !important; 
            gap: 20px !important; 
          }
          .profile-form-row { 
            flex-direction: column !important; 
            align-items: center !important; 
          }
          .profile-form-label { 
            text-align: center !important; 
          }
          .profile-form-input { 
            width: 100% !important; 
            max-width: none !important; 
          }
          .address-field { 
            margin-bottom: 1rem !important; 
          }
          .address-input { 
            width: 100% !important; 
            max-width: none !important; 
          }
          .profile-btn-row { 
            flex-direction: column !important; 
            gap: 0.75rem !important; 
          }
        }
        .profile-form-input,
        .address-input {
          color: #222 !important;
          background: #fff !important;
        }
        .profile-form-input:disabled,
        .address-input:disabled {
          color: #888 !important;
          background: #f8f9fa !important;
        }
      `}</style>
      <div style={styles.bgGreen}>
        <div style={{ ...styles.sectionContainer, paddingTop: '2rem', paddingBottom: '2rem' }}>
          <div style={styles.profileCard}>
            {/* Edit button always in upper right */}
            <button
              type="button"
              className="profile-edit-btn"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <div className="profile-header">
              <div className="profile-pic-area">
                <div className="profile-pic-circle">
                  {previewUrl || profilePic ? (
                    <img
                      src={previewUrl || profilePic}
                      alt="Profile"
                      className="profile-pic-img"
                    />
                  ) : (
                    <span className="profile-pic-placeholder">👤</span>
                  )}
                  <label htmlFor="profile-pic-input" className="profile-pic-add">
                    <span>+</span>
                    <input
                      id="profile-pic-input"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>
              {/* Upload button below image if image is selected */}
              {selectedImage && (
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={uploading}
                  style={{
                    background: '#22c55e',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '32px',
                    padding: '0.75rem 1.5rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginBottom: '0.5rem',
                    marginTop: '-0.5rem',
                    boxShadow: '0 4px 20px rgba(40,167,69,0.13)',
                    transition: 'background 0.2s',
                  }}
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              )}
              <div className="profile-info-name">{formData.name || ''}</div>
              <div className="profile-info-role">{user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Customer'}</div>
              <div className="profile-info-address">{[
                formData.address.street,
                formData.address.city,
                formData.address.state
              ].filter(Boolean).join(', ') || 'Address'}</div>
              <div className="profile-info-date">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Join Date'}</div>
            </div>
            <form onSubmit={handleSubmit} className="profile-form-section">
              <div className="profile-form-title">Personal Information</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '1.5rem', width: '100%' }}>
                <div className="profile-form-row">
                  <label className="profile-form-label">Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} disabled={!isEditing} required className="profile-form-input" />
                </div>
                <div className="profile-form-row">
                  <label className="profile-form-label">Phone</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} disabled={!isEditing} className="profile-form-input" />
                </div>
                <div className="profile-form-row">
                  <label className="profile-form-label">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} disabled={!isEditing} required className="profile-form-input" />
                </div>
              </div>
              <div className="profile-form-title" style={{ marginTop: '1.5rem' }}>Address</div>
              <div className="profile-form-grid">
                <div className="address-field">
                  <label className="address-label">Street</label>
                  <input type="text" name="address.street" value={formData.address.street} onChange={handleInputChange} disabled={!isEditing} className="address-input" />
                </div>
                <div className="address-field">
                  <label className="address-label">City</label>
                  <input type="text" name="address.city" value={formData.address.city} onChange={handleInputChange} disabled={!isEditing} className="address-input" />
                </div>
                <div className="address-field">
                  <label className="address-label">State/Province</label>
                  <input type="text" name="address.state" value={formData.address.state} onChange={handleInputChange} disabled={!isEditing} className="address-input" />
                </div>
                <div className="address-field">
                  <label className="address-label">Zip Code</label>
                  <input type="text" name="address.zipCode" value={formData.address.zipCode} onChange={handleInputChange} disabled={!isEditing} className="address-input" />
                </div>
              </div>
              {isEditing && (
                <div className="profile-btn-row">
                  <button
                    type="submit"
                    disabled={loading}
                    className="profile-btn-pill profile-btn-save"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="profile-btn-pill profile-btn-cancel"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
            {(error || success) && (
              <div className="profile-feedback">
                {error && <p className="profile-feedback-error">{error}</p>}
                {success && <p className="profile-feedback-success">{success}</p>}
              </div>
            )}
            {/* My Orders Section at the bottom */}
            <div className="profile-orders-card">
              <div className="profile-orders-title">My Orders</div>
              <div className="profile-orders-desc">View and manage your order history.</div>
              <button
                className="profile-orders-btn"
                style={{ marginBottom: '1.5rem' }}
                onClick={() => setShowOrders(v => !v)}
              >
                {showOrders ? 'Hide Orders' : 'View Orders'}
              </button>
              {showOrders && (
                ordersLoading ? (
                  <div style={{ color: '#28a745', fontWeight: 500, margin: '1.5rem 0' }}>Loading orders...</div>
                ) : ordersError ? (
                  <div style={{ color: '#dc3545', fontWeight: 500, margin: '1.5rem 0' }}>{ordersError}</div>
                ) : orders.length === 0 ? (
                  <div style={{ color: '#888', fontWeight: 500, margin: '1.5rem 0' }}>You have not placed any orders yet.</div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                    gap: '1.5rem',
                    marginTop: '1rem',
                  }}>
                    {orders.map(order => (
                      <div key={order._id} style={{
                        background: '#fff',
                        borderRadius: '1rem',
                        boxShadow: '0 4px 20px rgba(40,167,69,0.08)',
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                          <div style={{ fontWeight: 700, color: '#222', fontSize: 18 }}>Order #{order._id.slice(-6)}</div>
                          <div style={{
                            background: order.status === 'pending' ? '#fffbe8' : order.status === 'completed' ? '#e8fbe8' : order.status === 'cancelled' ? '#ffe8e8' : '#e8f4fd',
                            color: order.status === 'pending' ? '#ffc107' : order.status === 'completed' ? '#28a745' : order.status === 'cancelled' ? '#dc3545' : '#17a2b8',
                            borderRadius: 16,
                            padding: '0.25rem 1rem',
                            fontWeight: 600,
                            fontSize: 14,
                            textTransform: 'capitalize',
                          }}>{order.status.replace('_', ' ')}</div>
                        </div>
                        <div style={{ color: '#666', fontSize: 14, marginBottom: 4 }}>
                          Placed on: {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                        <div style={{ color: '#222', fontWeight: 500, marginBottom: 4 }}>
                          Total: ₱{order.totalAmount?.toLocaleString()}
                        </div>
                        <div style={{ color: '#888', fontSize: 13, marginBottom: 8 }}>
                          {order.items?.slice(0, 3).map((item, idx) => (
                            <span key={idx}>{item.product?.name || 'Product'} x{item.quantity}{idx < order.items.length - 1 ? ', ' : ''}</span>
                          ))}
                          {order.items?.length > 3 && (
                            <span> +{order.items.length - 3} more</span>
                          )}
                        </div>
                        {order.status === 'pending' && (
                          <button
                            className="profile-orders-btn"
                            style={{ background: '#dc3545', marginTop: 8, fontSize: 14, padding: '0.4rem 1.2rem' }}
                            onClick={() => handleCancelOrder(order._id)}
                            disabled={cancelingOrderId === order._id}
                          >
                            {cancelingOrderId === order._id ? 'Cancelling...' : 'Cancel Order'}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile; 