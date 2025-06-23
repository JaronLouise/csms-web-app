import React, { useState, useEffect } from 'react';
import { FaSolarPanel, FaCogs, FaFlask } from 'react-icons/fa';
import ContactModal from '../components/ContactModal';
import QuoteModal from '../components/QuoteModal';
import ServiceDetailModal from '../components/ServiceDetailModal';
import { useAuth } from '../context/AuthContext';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showServiceDetailModal, setShowServiceDetailModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/services');
      if (response.ok) {
        const data = await response.json();
        // If no services in database, use default services
        if (data.length === 0) {
          setServices(defaultServices);
        } else {
          setServices(data);
        }
      } else {
        // If API fails, use default services
        setServices(defaultServices);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      // Use default services if API fails
      setServices(defaultServices);
    } finally {
      setLoading(false);
    }
  };

  const defaultServices = [
    {
      _id: '1',
      name: 'Sustainable Energy Solutions',
      description: 'Comprehensive renewable energy solutions including solar panel installation, wind energy systems, and energy storage solutions. We help businesses and homeowners transition to clean, sustainable energy sources.',
      features: [
        'Solar Panel Installation & Maintenance',
        'Wind Energy Systems',
        'Energy Storage Solutions',
        'Energy Efficiency Audits',
        'Grid Integration Services',
        '24/7 Monitoring & Support'
      ],
      icon: 'solar'
    },
    {
      _id: '2',
      name: 'Fabrication and Installation',
      description: 'Professional fabrication and installation services for industrial equipment, custom machinery, and specialized components. Our expert team ensures precision engineering and reliable installation.',
      features: [
        'Custom Machinery Fabrication',
        'Industrial Equipment Installation',
        'Precision Engineering',
        'Quality Control & Testing',
        'On-site Installation Services',
        'Maintenance & Repair'
      ],
      icon: 'fabrication'
    },
    {
      _id: '3',
      name: 'Research',
      description: 'Cutting-edge research and development services in renewable energy technologies, sustainable materials, and innovative engineering solutions. We collaborate with academic institutions and industry partners.',
      features: [
        'Renewable Energy Research',
        'Sustainable Materials Development',
        'Technology Innovation',
        'Academic Collaboration',
        'Industry Partnerships',
        'Patent Development'
      ],
      icon: 'research'
    }
  ];

  const getIcon = (iconType) => {
    switch (iconType) {
      case 'solar':
        return <FaSolarPanel />;
      case 'fabrication':
        return <FaCogs />;
      case 'research':
        return <FaFlask />;
      default:
        return <FaSolarPanel />;
    }
  };

  const handleContactUs = () => {
    setShowContactModal(true);
  };

  const handleRequestQuote = () => {
    setShowQuoteModal(true);
  };

  const handleLearnMore = (service) => {
    setSelectedService(service);
    setShowServiceDetailModal(true);
  };

  const closeServiceDetailModal = () => {
    setShowServiceDetailModal(false);
    setSelectedService(null);
  };

  if (loading) {
    return (
      <div>
        <div>Loading services...</div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <h1>Our Services</h1>
        <p>Comprehensive solutions for sustainable energy and industrial excellence</p>
      </div>

      <div>
        {services.map((service) => (
          <div key={service._id}>
            <div>
              {getIcon(service.icon)}
            </div>
            <h3>{service.name}</h3>
            <p>{service.description}</p>
            <div>
              <h4>Key Features:</h4>
              <ul>
                {service.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            <button onClick={() => handleLearnMore(service)}>Learn More</button>
          </div>
        ))}
      </div>

      {/* Only show CTA section for non-admin users */}
      {(!user || user.role !== 'admin') && (
        <div>
          <h2>Ready to Get Started?</h2>
          <p>Contact us today to discuss your project requirements and get a customized solution.</p>
          <div>
            <button onClick={handleContactUs}>Contact Us</button>
            <button onClick={handleRequestQuote}>Request Quote</button>
          </div>
        </div>
      )}

      <ContactModal 
        isOpen={showContactModal} 
        onClose={() => setShowContactModal(false)} 
      />
      
      <QuoteModal 
        isOpen={showQuoteModal} 
        onClose={() => setShowQuoteModal(false)} 
      />

      <ServiceDetailModal
        isOpen={showServiceDetailModal}
        onClose={closeServiceDetailModal}
        service={selectedService}
      />
    </div>
  );
};

export default Services; 