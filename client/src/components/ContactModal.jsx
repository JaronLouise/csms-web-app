import React, { useState } from 'react';
import { FaTimes, FaEnvelope, FaPhone, FaUser, FaComments } from 'react-icons/fa';
import emailService from '../services/emailService';

const ContactModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Submitting contact form with data:', formData);
      const result = await emailService.sendContactEmail(formData);
      
      console.log('Contact form submitted successfully:', result);
      
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
      
    } catch (err) {
      console.error('Error sending contact form:', err);
      console.error('Error response:', err.response);
      console.error('Error data:', err.response?.data);
      
      // Handle validation errors specifically
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        const errorMessages = err.response.data.errors.map(error => `${error.field}: ${error.message}`).join(', ');
        setError(`Validation errors: ${errorMessages}`);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || 'Failed to send message. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#666'
          }}
        >
          <FaTimes />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <FaEnvelope style={{ fontSize: '2rem', color: '#3498db', marginBottom: '1rem' }} />
          <h2>Contact Us</h2>
          <p>Get in touch with us. We'd love to hear from you!</p>
        </div>

        {success && (
          <div style={{
            background: '#d4edda',
            color: '#155724',
            padding: '1rem',
            borderRadius: '4px',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            Thank you! Your message has been sent successfully. We'll get back to you soon.
          </div>
        )}

        {error && (
          <div style={{
            background: '#f8d7da',
            color: '#721c24',
            padding: '1rem',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              <FaUser style={{ marginRight: '0.5rem' }} />
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'border-color 0.3s ease'
              }}
              placeholder="Your full name"
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              <FaEnvelope style={{ marginRight: '0.5rem' }} />
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'border-color 0.3s ease'
              }}
              placeholder="your.email@example.com"
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              <FaPhone style={{ marginRight: '0.5rem' }} />
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'border-color 0.3s ease'
              }}
              placeholder="Your phone number"
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Subject
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'border-color 0.3s ease'
              }}
              placeholder="What is this about?"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              <FaComments style={{ marginRight: '0.5rem' }} />
              Message *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              rows="4"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '1rem',
                resize: 'vertical',
                transition: 'border-color 0.3s ease'
              }}
              placeholder="Tell us about your inquiry..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              background: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactModal; 