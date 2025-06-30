import React, { useState } from 'react';
import { FaTimes, FaEnvelope, FaPhone, FaUser, FaBuilding, FaDollarSign, FaCalendar, FaComments } from 'react-icons/fa';
import { FaPesoSign } from 'react-icons/fa6';
import emailService from '../services/emailService';

const QuoteModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    serviceType: '',
    projectDescription: '',
    budgetRange: '',
    timeline: '',
    additionalInfo: ''
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
    if (!formData.name.trim() || !formData.email.trim() || !formData.serviceType || !formData.projectDescription.trim()) {
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
      const result = await emailService.sendQuoteEmail(formData);
      
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        serviceType: '',
        projectDescription: '',
        budgetRange: '',
        timeline: '',
        additionalInfo: ''
      });
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
      
    } catch (err) {
      setError(err.message || 'Failed to send quote request. Please check your connection and try again.');
      console.error('Error sending quote form:', err);
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
        maxWidth: '600px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative',
        boxShadow: '0 4px 32px rgba(52,152,219,0.08)'
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
          <span style={{ fontSize: '2rem', color: '#27ae60', marginBottom: '1rem', display: 'inline-block' }}>₱</span>
          <h2 style={{ color: '#222', fontWeight: 700, fontSize: '2rem', marginBottom: '0.5rem' }}>Request a Quote</h2>
          <p style={{ color: '#3498db', fontSize: '1.05rem', marginBottom: '1.5rem' }}>
            Tell us about your project and we'll provide you with a customized quote.
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
            Thank you! Your quote request has been submitted. Our team will review your project and get back to you within 24-48 hours.
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label htmlFor="quote-name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#222' }}>
                <FaUser style={{ marginRight: '0.5rem' }} />
                Name *
              </label>
              <input
                id="quote-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '0.85rem',
                  border: '2px solid #b3d9ff',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  background: '#f5f7fa',
                  color: '#222',
                  transition: 'border-color 0.3s',
                  outline: 'none',
                  marginBottom: 0,
                }}
                placeholder="Your full name"
                onFocus={e => e.target.style.borderColor = '#3498db'}
                onBlur={e => e.target.style.borderColor = '#b3d9ff'}
              />
            </div>

            <div>
              <label htmlFor="quote-email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#222' }}>
                <FaEnvelope style={{ marginRight: '0.5rem' }} />
                Email *
              </label>
              <input
                id="quote-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '0.85rem',
                  border: '2px solid #b3d9ff',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  background: '#f5f7fa',
                  color: '#222',
                  transition: 'border-color 0.3s',
                  outline: 'none',
                  marginBottom: 0,
                }}
                placeholder="your.email@example.com"
                onFocus={e => e.target.style.borderColor = '#3498db'}
                onBlur={e => e.target.style.borderColor = '#b3d9ff'}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label htmlFor="quote-phone" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#222' }}>
                <FaPhone style={{ marginRight: '0.5rem' }} />
                Phone
              </label>
              <input
                id="quote-phone"
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '0.85rem',
                  border: '2px solid #b3d9ff',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  background: '#f5f7fa',
                  color: '#222',
                  transition: 'border-color 0.3s',
                  outline: 'none',
                  marginBottom: 0,
                }}
                placeholder="Your phone number"
                onFocus={e => e.target.style.borderColor = '#3498db'}
                onBlur={e => e.target.style.borderColor = '#b3d9ff'}
              />
            </div>

            <div>
              <label htmlFor="quote-company" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#222' }}>
                <FaBuilding style={{ marginRight: '0.5rem' }} />
                Company
              </label>
              <input
                id="quote-company"
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '0.85rem',
                  border: '2px solid #b3d9ff',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  background: '#f5f7fa',
                  color: '#222',
                  transition: 'border-color 0.3s',
                  outline: 'none',
                  marginBottom: 0,
                }}
                placeholder="Your company name"
                onFocus={e => e.target.style.borderColor = '#3498db'}
                onBlur={e => e.target.style.borderColor = '#b3d9ff'}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="quote-serviceType" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#222' }}>
              Service
            </label>
            <select
              id="quote-serviceType"
              name="serviceType"
              value={formData.serviceType}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '0.85rem',
                border: '2px solid #b3d9ff',
                borderRadius: '12px',
                fontSize: '1rem',
                background: '#f5f7fa',
                color: '#222',
                transition: 'border-color 0.3s',
                outline: 'none',
                marginBottom: 0,
              }}
              onFocus={e => e.target.style.borderColor = '#3498db'}
              onBlur={e => e.target.style.borderColor = '#b3d9ff'}
            >
              <option value="">Select a service</option>
              <option value="sustainable-energy">Sustainable Energy Solutions</option>
              <option value="fabrication-installation">Fabrication and Installation</option>
              <option value="research">Research</option>
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="quote-projectDescription" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#222' }}>
              Project Description *
            </label>
            <textarea
              id="quote-projectDescription"
              name="projectDescription"
              value={formData.projectDescription}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '0.85rem',
                border: '2px solid #b3d9ff',
                borderRadius: '12px',
                fontSize: '1rem',
                background: '#f5f7fa',
                color: '#222',
                minHeight: '100px',
                resize: 'vertical',
                transition: 'border-color 0.3s',
                outline: 'none',
              }}
              placeholder="Describe your project requirements, goals, and any specific needs..."
              onFocus={e => e.target.style.borderColor = '#3498db'}
              onBlur={e => e.target.style.borderColor = '#b3d9ff'}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label htmlFor="quote-budgetRange" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#222' }}>
                Budget Range
              </label>
              <select
                id="quote-budgetRange"
                name="budgetRange"
                value={formData.budgetRange}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '0.85rem',
                  border: '2px solid #b3d9ff',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  background: '#f5f7fa',
                  color: '#222',
                  transition: 'border-color 0.3s',
                  outline: 'none',
                  marginBottom: 0,
                }}
                onFocus={e => e.target.style.borderColor = '#3498db'}
                onBlur={e => e.target.style.borderColor = '#b3d9ff'}
              >
                <option value="">Select budget range</option>
                <option value="under-10k">Under ₱10,000</option>
                <option value="10k-50k">₱10,000 - ₱50,000</option>
                <option value="50k-100k">₱50,000 - ₱100,000</option>
                <option value="100k-500k">₱100,000 - ₱500,000</option>
                <option value="over-500k">Over ₱500,000</option>
                <option value="to-be-discussed">To be discussed</option>
              </select>
            </div>

            <div>
              <label htmlFor="quote-timeline" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#222' }}>
                Timeline
              </label>
              <select
                id="quote-timeline"
                name="timeline"
                value={formData.timeline}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '0.85rem',
                  border: '2px solid #b3d9ff',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  background: '#f5f7fa',
                  color: '#222',
                  transition: 'border-color 0.3s',
                  outline: 'none',
                  marginBottom: 0,
                }}
                onFocus={e => e.target.style.borderColor = '#3498db'}
                onBlur={e => e.target.style.borderColor = '#b3d9ff'}
              >
                <option value="">ASAP</option>
                <option value="1-3-months">1-3 months</option>
                <option value="3-6-months">3-6 months</option>
                <option value="6-12-months">6-12 months</option>
                <option value="over-12-months">Over 12 months</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="quote-additionalInfo" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#222' }}>
              Additional Details
            </label>
            <textarea
              id="quote-additionalInfo"
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleInputChange}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '0.85rem',
                border: '2px solid #b3d9ff',
                borderRadius: '12px',
                fontSize: '1rem',
                background: '#f5f7fa',
                color: '#222',
                minHeight: '100px',
                resize: 'vertical',
                transition: 'border-color 0.3s',
                outline: 'none',
              }}
              placeholder="Any additional details, requirements, or questions..."
              onFocus={e => e.target.style.borderColor = '#3498db'}
              onBlur={e => e.target.style.borderColor = '#b3d9ff'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: '#3498db',
              color: '#fff',
              border: 'none',
              borderRadius: '24px',
              padding: '1rem 0',
              fontWeight: 500,
              fontSize: '1.1rem',
              marginTop: '0.5rem',
              boxShadow: '0 2px 8px rgba(52,152,219,0.08)',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.background = '#217dbb'}
            onMouseOut={e => e.currentTarget.style.background = '#3498db'}
          >
            {loading ? 'Sending...' : 'Send Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuoteModal; 