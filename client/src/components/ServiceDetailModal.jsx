import React from 'react';
import { FaTimes, FaCheck, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ServiceDetailModal = ({ isOpen, onClose, service }) => {
  const navigate = useNavigate();
  if (!isOpen || !service) return null;

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
        maxWidth: '800px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative',
        color: '#222',
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

        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '1rem' }}>{service.name}</h2>
          <p style={{ color: '#7f8c8d', lineHeight: '1.6', fontSize: '1.1rem' }}>
            {service.description}
          </p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: '#2c3e50', marginBottom: '1rem' }}>What We Offer</h3>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {service.features.map((feature, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaCheck style={{ color: '#27ae60', flexShrink: 0 }} />
                <span style={{color:'#222'}}>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Why Choose This Service?</h3>
          <div style={{ 
            background: '#f8f9fa', 
            padding: '1.5rem', 
            borderRadius: '8px',
            borderLeft: '4px solid #3498db'
          }}>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#222' }}>
              <li style={{ marginBottom: '0.5rem', color: '#222' }}>Expert team with specialized knowledge</li>
              <li style={{ marginBottom: '0.5rem', color: '#222' }}>Proven track record of successful projects</li>
              <li style={{ marginBottom: '0.5rem', color: '#222' }}>Customized solutions for your specific needs</li>
              <li style={{ marginBottom: '0.5rem', color: '#222' }}>Ongoing support and maintenance</li>
              <li style={{ color: '#222' }}>Competitive pricing and transparent quotes</li>
            </ul>
          </div>
        </div>

        <div style={{ 
          background: '#e8f4fd', 
          padding: '1.5rem', 
          borderRadius: '8px',
          border: '1px solid #b3d9ff'
        }}>
          <h4 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Ready to Get Started?</h4>
          <p style={{ color: '#7f8c8d', marginBottom: '1rem' }}>
            Contact our team to discuss your project requirements and get a customized solution.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => { onClose(); navigate('/contact'); }}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: 'bold'
              }}
            >
              Contact Us <FaArrowRight />
            </button>
            <button
              onClick={() => { onClose(); navigate('/quote'); }}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'transparent',
                color: '#3498db',
                border: '2px solid #3498db',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: 'bold'
              }}
            >
              Request Quote <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailModal; 