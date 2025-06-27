import React, { useState } from 'react';
import ContactModal from '../components/ContactModal';
import QuoteModal from '../components/QuoteModal';
import ServiceDetailModal from '../components/ServiceDetailModal';

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
    icon: '🌞'
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
    icon: '⚙️'
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
    icon: '🔬'
  }
];

const Home = () => {
  const [showContact, setShowContact] = useState(false);
  const [showQuote, setShowQuote] = useState(false);
  const [showServiceDetail, setShowServiceDetail] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const handleLearnMore = (service) => {
    setSelectedService(service);
    setShowServiceDetail(true);
  };

  const closeServiceDetailModal = () => {
    setShowServiceDetail(false);
    setSelectedService(null);
  };

  return (
    <div className="homepage-root">
      <section id="home" className="homepage-section home-section">
        <h1>Main Homepage Section</h1>
      </section>
      <section id="featured" className="homepage-section featured-section">
        <h2>Featured Product Section</h2>
      </section>
      <section id="services" className="homepage-section services-section">
        <h2>Our Services</h2>
        <div className="services-flex">
          {defaultServices.map(service => (
            <div className="service-card" key={service._id}>
              <div className="service-icon">{service.icon}</div>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <ul>
                {service.features.map((feature, idx) => <li key={idx}>{feature}</li>)}
              </ul>
              <button className="learn-more-btn" onClick={() => handleLearnMore(service)}>Learn More</button>
            </div>
          ))}
        </div>
        <div className="services-cta">
          <button className="contact-btn" onClick={() => setShowContact(true)}>Contact Us</button>
          <button className="quote-btn" onClick={() => setShowQuote(true)}>Request a Quote</button>
        </div>
      </section>
      <section id="about" className="homepage-section about-section">
        <h2>About Us</h2>
        <p>We are a company dedicated to providing sustainable energy solutions, expert fabrication and installation, and innovative research in renewable technologies. Our mission is to empower businesses and communities with clean, efficient, and reliable energy and engineering services.</p>
      </section>
      <footer id="footer" className="homepage-section footer-section">
        <h3>Footer Section</h3>
      </footer>
      <ContactModal isOpen={showContact} onClose={() => setShowContact(false)} />
      <QuoteModal isOpen={showQuote} onClose={() => setShowQuote(false)} />
      <ServiceDetailModal isOpen={showServiceDetail} onClose={closeServiceDetailModal} service={selectedService} />
      <style>{`
        .homepage-root {
          width: 100vw;
          min-height: 100vh;
          margin: 0;
          padding: 0;
        }
        .homepage-section {
          width: 100vw;
          min-height: 40vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          box-sizing: border-box;
        }
        .home-section { background: #e0f7fa; min-height: 60vh; }
        .featured-section { background: #f1f8e9; }
        .services-section { background: #fffde7; }
        .about-section { background: #fce4ec; }
        .footer-section { background: #ececec; min-height: 20vh; }
        .homepage-section h1, .homepage-section h2, .homepage-section h3 {
          margin: 0.5em 0;
        }
        .services-flex {
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
          justify-content: center;
          width: 100%;
        }
        .service-card {
          background: #fff;
          border-radius: 1rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          padding: 2rem 1.5rem;
          min-width: 260px;
          max-width: 320px;
          flex: 1 1 260px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .service-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }
        .service-card ul {
          text-align: left;
          margin: 1rem 0;
          padding-left: 1.2rem;
        }
        .learn-more-btn {
          background: #007bff;
          color: #fff;
          border: none;
          border-radius: 1.2rem;
          padding: 0.5rem 1.5rem;
          font-weight: 500;
          cursor: pointer;
          margin-top: 1rem;
        }
        .services-cta {
          display: flex;
          gap: 1.5rem;
          margin-top: 2rem;
        }
        .contact-btn, .quote-btn {
          background: #222;
          color: #fff;
          border: none;
          border-radius: 1.5rem;
          padding: 0.7rem 2rem;
          font-weight: 500;
          font-size: 1.1rem;
          cursor: pointer;
        }
        .quote-btn {
          background: #007bff;
        }
        @media (max-width: 900px) {
          .services-flex {
            flex-direction: column;
            align-items: center;
          }
        }
        @media (min-width: 600px) {
          .homepage-section {
            padding: 4rem 2rem;
          }
          .home-section { min-height: 80vh; }
        }
        @media (min-width: 900px) {
          .homepage-section {
            padding: 6rem 4rem;
          }
          .home-section { min-height: 100vh; }
        }
        @media (max-width: 599px) {
          .homepage-section h1 { font-size: 2rem; }
          .homepage-section h2 { font-size: 1.3rem; }
          .homepage-section h3 { font-size: 1.1rem; }
        }
        @media (min-width: 600px) {
          .homepage-section h1 { font-size: 2.7rem; }
          .homepage-section h2 { font-size: 2rem; }
          .homepage-section h3 { font-size: 1.3rem; }
        }
      `}</style>
    </div>
  );
};

export default Home; 