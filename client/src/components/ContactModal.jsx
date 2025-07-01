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
        borderRadius: '16px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative',
        boxShadow: '0 4px 32px rgba(52,152,219,0.08)',
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
          <h2 style={{ color: '#222', fontWeight: 700, fontSize: '2rem', marginBottom: '0.5rem' }}>Contact Us</h2>
          <p style={{ color: '#3498db', fontSize: '1.05rem', marginBottom: '1.5rem' }}>
            Get in touch with us. We'd love to hear from you!
          </p>
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
            <label htmlFor="contact-name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#222' }}>
              <FaUser style={{ marginRight: '0.5rem' }} />
              Name *
            </label>
            <input
              id="contact-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '0.85rem',
                border: '2px solid #b7eac7',
                borderRadius: '12px',
                fontSize: '1rem',
                background: '#f5f7fa',
                color: '#222',
                transition: 'border-color 0.3s',
                outline: 'none',
                marginBottom: 0,
              }}
              placeholder="Your full name"
              onFocus={e => e.target.style.borderColor = '#28a745'}
              onBlur={e => e.target.style.borderColor = '#b7eac7'}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="contact-email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#222' }}>
              <FaEnvelope style={{ marginRight: '0.5rem' }} />
              Email *
            </label>
            <input
              id="contact-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '0.85rem',
                border: '2px solid #b7eac7',
                borderRadius: '12px',
                fontSize: '1rem',
                background: '#f5f7fa',
                color: '#222',
                transition: 'border-color 0.3s',
                outline: 'none',
                marginBottom: 0,
              }}
              placeholder="your.email@example.com"
              onFocus={e => e.target.style.borderColor = '#28a745'}
              onBlur={e => e.target.style.borderColor = '#b7eac7'}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="contact-phone" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#222' }}>
              <FaPhone style={{ marginRight: '0.5rem' }} />
              Phone
            </label>
            <input
              id="contact-phone"
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '0.85rem',
                border: '2px solid #b7eac7',
                borderRadius: '12px',
                fontSize: '1rem',
                background: '#f5f7fa',
                color: '#222',
                transition: 'border-color 0.3s',
                outline: 'none',
                marginBottom: 0,
              }}
              placeholder="Your phone number"
              onFocus={e => e.target.style.borderColor = '#28a745'}
              onBlur={e => e.target.style.borderColor = '#b7eac7'}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="contact-subject" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#222' }}>
              <FaComments style={{ marginRight: '0.5rem' }} />
              Subject
            </label>
            <input
              id="contact-subject"
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '0.85rem',
                border: '2px solid #b7eac7',
                borderRadius: '12px',
                fontSize: '1rem',
                background: '#f5f7fa',
                color: '#222',
                transition: 'border-color 0.3s',
                outline: 'none',
                marginBottom: 0,
              }}
              placeholder="What is this about?"
              onFocus={e => e.target.style.borderColor = '#28a745'}
              onBlur={e => e.target.style.borderColor = '#b7eac7'}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="contact-message" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#222' }}>
               Message *
            </label>
            <textarea
              id="contact-message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '0.85rem',
                border: '2px solid #b7eac7',
                borderRadius: '12px',
                fontSize: '1rem',
                background: '#f5f7fa',
                color: '#222',
                minHeight: '100px',
                resize: 'vertical',
                transition: 'border-color 0.3s',
                outline: 'none',
              }}
              placeholder="Tell us about your inquiry..."
              onFocus={e => e.target.style.borderColor = '#28a745'}
              onBlur={e => e.target.style.borderColor = '#b7eac7'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '24px',
              padding: '1rem 0',
              fontWeight: 500,
              fontSize: '1.1rem',
              marginTop: '0.5rem',
              boxShadow: '0 2px 8px rgba(40,167,69,0.08)',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.background = '#218838'}
            onMouseOut={e => e.currentTarget.style.background = '#28a745'}
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactModal; 