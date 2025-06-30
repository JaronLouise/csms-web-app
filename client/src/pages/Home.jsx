import React, { useState } from 'react';
import ContactModal from '../components/ContactModal';
import QuoteModal from '../components/QuoteModal';
import ServiceDetailModal from '../components/ServiceDetailModal';
import { useNavigate } from 'react-router-dom';

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
    materialIcon: 'solar_power'
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
    materialIcon: 'build'
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
    materialIcon: 'science'
  }
];

const featuredSlides = [
  {
    title: 'Collapsible Solar Power Station (CSPS)',
    image: 'https://via.placeholder.com/320x220?text=Product+Image',
    cards: [
      { text: 'Lorem ipsum dolor sit amet. Ea vero optio cum sequi magni qui necessitat', style: { top: 30, left: 30, width: 200 } },
      { text: 'Lorem ipsum dolor sit amet. Ea vero optio cum sequi magni qui necessitat', style: { top: 60, right: 30, width: 200 } },
      { text: 'Lorem ipsum dolor sit amet. Ea vero optio cum sequi magni qui necessitat', style: { bottom: 30, left: 80, width: 220 } },
    ],
  },
  {
    title: 'Placeholder Product 2',
    image: 'https://via.placeholder.com/320x220?text=Product+2',
    cards: [
      { text: 'Another feature or highlight for product 2.', style: { top: 40, left: 40, width: 180 } },
      { text: 'More details about this product.', style: { bottom: 40, right: 40, width: 180 } },
    ],
  },
  {
    title: 'Placeholder Product 3',
    image: 'https://via.placeholder.com/320x220?text=Product+3',
    cards: [
      { text: 'Highlight for product 3.', style: { top: 50, left: 120, width: 180 } },
    ],
  },
];

const Home = () => {
  const [showContact, setShowContact] = useState(false);
  const [showQuote, setShowQuote] = useState(false);
  const [showServiceDetail, setShowServiceDetail] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showSpecs, setShowSpecs] = useState(false);
  const slide = featuredSlides[currentSlide];

  const handleLearnMore = (service) => {
    setSelectedService(service);
    setShowServiceDetail(true);
  };

  const closeServiceDetailModal = () => {
    setShowServiceDetail(false);
    setSelectedService(null);
  };

  const handlePrev = () => setCurrentSlide((prev) => (prev === 0 ? featuredSlides.length - 1 : prev - 1));
  const handleNext = () => setCurrentSlide((prev) => (prev === featuredSlides.length - 1 ? 0 : prev + 1));
  const handleImageClick = () => setShowSpecs((prev) => !prev);

  return (
    <div className="homepage-root">
      {/* Main Homepage Section */}
      <section id="home" className="homepage-section home-section-modern" style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        position: 'relative',
        background: '#222',
        overflow: 'hidden',
        padding: 0,
        paddingTop: '120px', // Added top padding for headspace
      }}>
        {/* Background image placeholder */}
        <div style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          background: `url('/1000013266.jpg') center/cover no-repeat`,
          zIndex: 1,
        }} />
        {/* Overlay for readability */}
        <div style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, rgba(20,20,20,0.72) 0%, rgba(20,20,20,0.92) 100%)',
          zIndex: 2,
        }} />
        {/* Bottom fade to featured section */}
        {/* Blur + opacity fade overlay for vanishing effect */}
        <div style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 70, // Height of the blur/fade effect
          zIndex: 3,
          pointerEvents: 'none',
          background: 'linear-gradient(to bottom, rgba(178,240,230,0) 0%, rgba(178,240,230,0.7) 60%, #b2f0e6 100%)',
          filter: 'blur(12px)',
          opacity: 0.85,
        }} />
        {/* Reduced height for the main blend gradient */}
        <div style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 120, // Reduced from 340 to 120
          background: 'linear-gradient(to bottom, transparent 0%, #b2f0e6 100%)',
          zIndex: 3,
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'relative',
          zIndex: 3,
          maxWidth: 1200,
          width: '100%',
          margin: '0 auto',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          textAlign: 'left',
          padding: '0 2rem 0 4rem', // Increased left padding for better left alignment
        }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 700,
            marginBottom: 32, // Increased margin for better spacing
            lineHeight: 1.08,
            letterSpacing: '-2px',
            fontFamily: 'Poppins, sans-serif',
            textShadow: '0 4px 24px rgba(0,0,0,0.18)',
            maxWidth: '650px' // Slightly increased max width
          }}>
            Sustainable Energy that<br />
            Adapts to You
          </h1>
          <p style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
            fontWeight: 400,
            marginBottom: 48, // Increased margin for better spacing
            maxWidth: 580, // Increased max width
            color: '#f3f3f3',
            textShadow: '0 2px 8px rgba(0,0,0,0.10)',
            lineHeight: 1.5 // Added line height for better readability
          }}>
            Embrace a greener future with innovative solutions tailored for eco-conscious living.
          </p>
          <button
            style={{
              background: 'linear-gradient(90deg, #b2f0e6 0%, #0fd850 100%)',
              color: '#222',
              border: 'none',
              borderRadius: 32,
              padding: '18px 52px', // Increased padding for more prominence
              fontWeight: 600,
              fontSize: 20,
              fontFamily: 'Poppins, sans-serif',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)', // Enhanced shadow
              cursor: 'pointer',
              transition: 'all 0.3s ease', // Improved transition
              letterSpacing: '0.5px',
              transform: 'translateX(0)', // Base transform for hover effect
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateX(8px) translateY(-2px)';
              e.target.style.boxShadow = '0 6px 24px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateX(0) translateY(0)';
              e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
            }}
            onClick={() => navigate('/products')}
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="featured" className="homepage-section featured-section-modern" style={{
        minHeight: '100vh',
        width: '100vw',
        background: 'linear-gradient(180deg, #b2f0e6 0%, #d0f7c6 70%, #fff 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '8rem 1rem 3rem 1rem',
      }}>
        <h2 style={{ fontSize: '2.8rem', fontWeight: 700, color: '#111', marginBottom: 24, textAlign: 'center', letterSpacing: '-1px', textShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>{slide.title}</h2>
        <div style={{ position: 'relative', width: '90vw', maxWidth: 1200, height: 520, margin: '0 auto', marginBottom: 48 }}>
          {/* Left arrow */}
          <button onClick={handlePrev} aria-label="Previous" style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', fontSize: 56, color: '#222', cursor: 'pointer', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 56 }}>chevron_left</span>
          </button>
          {/* Product image (transparent PNG, no shadow/container) */}
          <img
            src={slide.image}
            alt="Product"
            style={{ width: 700, height: 420, display: 'block', margin: '0 auto', position: 'relative', zIndex: 1, cursor: 'pointer', background: 'none' }}
            onClick={handleImageClick}
          />
          {/* Floating cards (specs/characteristics) only show after image click */}
          {showSpecs && slide.cards.map((card, idx) => (
            <div
              key={idx}
              className="spec-box-animate"
              style={{
                position: 'absolute',
                background: 'rgba(255,255,255,0.92)',
                borderRadius: 12,
                boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
                padding: '20px 32px',
                fontSize: 20,
                color: '#222',
                ...card.style,
                zIndex: 2,
                minWidth: 260,
                maxWidth: 340,
                transition: 'opacity 0.6s cubic-bezier(.4,0,.2,1), transform 0.6s cubic-bezier(.4,0,.2,1)',
                opacity: showSpecs ? 1 : 0,
                transform: showSpecs ? 'translateY(0)' : 'translateY(40px)',
                transitionDelay: `${idx * 0.12}s`,
                ...(idx === 0 ? { top: 60, left: 60 } : idx === 1 ? { top: 80, right: 80 } : { bottom: 60, left: 320 }),
              }}
            >{card.text}</div>
          ))}
          {/* Right arrow */}
          <button onClick={handleNext} aria-label="Next" style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', fontSize: 56, color: '#222', cursor: 'pointer', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 56 }}>chevron_right</span>
          </button>
          {/* Dots indicator */}
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: -32, display: 'flex', justifyContent: 'center', gap: 12 }}>
            {featuredSlides.map((_, i) => (
              <span key={i} style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: i === currentSlide ? '#222' : '#b2b2b2',
                display: 'inline-block',
                transition: 'background 0.2s',
              }} />
            ))}
          </div>
        </div>
        {/* Description Section */}
        <div style={{
          background: 'rgba(40,40,40,0.18)',
          borderRadius: 32,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          padding: '3.5rem 3vw',
          maxWidth: 900,
          width: '100%',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 48,
        }}>
          {[
            { heading: 'What is Collapsible?', text: 'The Collapsible Solar Power Station for farm irrigation uses renewable energy from the sun. It features solar panels that convert sunlight into electricity, providing a sustainable and eco-friendly source of energy for irrigating the farm.' },
            { heading: 'Why Choose Collapsible?', text: 'The Collapsible Solar Power Station for farm irrigation uses renewable energy from the sun. It features solar panels that convert sunlight into electricity, providing a sustainable and eco-friendly source of energy for irrigating the farm.' },
            { heading: 'What is Collapsible?', text: 'The Collapsible Solar Power Station for farm irrigation uses renewable energy from the sun. It features solar panels that convert sunlight into electricity, providing a sustainable and eco-friendly source of energy for irrigating the farm.' },
          ].map((desc, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: idx % 2 === 0 ? 'flex-start' : 'flex-end',
                width: '100%',
              }}
            >
              <div style={{
                maxWidth: 420,
                textAlign: idx % 2 === 0 ? 'left' : 'right',
              }}>
                <div style={{ fontWeight: 700, fontSize: 28, marginBottom: 18, letterSpacing: '-1px' }}>{desc.heading}</div>
                <div style={{ fontSize: 18, color: '#222', lineHeight: 1.6 }}>{desc.text}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="services" className="homepage-section services-section" style={{
        background: '#fff',
      }}>
        <h2 style={{textAlign: 'center'}}>Our Services</h2>
        <div className="services-flex">
          {defaultServices.map(service => (
            <div className="service-card" key={service._id}>
              <div className="service-icon material-symbols-outlined" style={{background:'#e0f7fa',color:'#007bff',borderRadius:'50%',padding:'16px',fontSize:'2.5rem',marginBottom:'1rem',display:'inline-flex',alignItems:'center',justifyContent:'center'}}>{service.materialIcon}</div>
              <h3 style={{color:'#222',margin:'0.7rem 0 0.5rem 0',fontWeight:600,fontSize:'1.25rem',textAlign:'center'}}>{service.name}</h3>
              <p style={{color:'#444',fontSize:'1rem',margin:'0 0 0.7rem 0',textAlign:'center'}}>{service.description}</p>
              <div style={{flex:1}} />
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
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined');
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
          alignItems: center;
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
          box-shadow: 0 2px 12px rgba(0,0,0,0.10);
          padding: 2.5rem 1.8rem 2rem 1.8rem;
          min-width: 260px;
          max-width: 320px;
          flex: 1 1 260px;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: box-shadow 0.3s, transform 0.3s;
          border: 2px solid #e0f7fa;
        }
        .service-card:hover {
          box-shadow: 0 8px 32px rgba(0,123,255,0.13);
          transform: translateY(-8px) scale(1.03);
          border-color: #007bff;
        }
        .service-icon.material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48;
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
          transition: background 0.2s;
        }
        .learn-more-btn:hover {
          background: #0056b3;
        }
        .services-cta {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1.5rem;
          margin-top: 2.5rem;
          width: 100%;
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
        
        /* Responsive Design Improvements */
        @media (max-width: 768px) {
          .home-section-modern {
            padding: 80px 1rem 0 2rem !important;
          }
          .home-section-modern > div {
            padding: 0 1rem 0 2rem !important;
          }
          .home-section-modern h1 {
            max-width: 100% !important;
          }
          .home-section-modern p {
            max-width: 100% !important;
          }
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
        .spec-box-animate {
          will-change: opacity, transform;
        }
      `}</style>
    </div>
  );
};

export default Home;