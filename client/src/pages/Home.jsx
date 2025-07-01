import React, { useState, useRef } from 'react';
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
    title: 'Collapsible Solar Power Station (V1)',
    subtitle: 'Efficient, portable, and sustainable energy for your needs.',
    image: '/removed bg product 1.png',
    cards: [],
  },
  {
    title: 'Collapsible Solar Power Station (V2)',
    subtitle: 'Reliable solar solutions for every environment.',
    image: '/removed bg product 2.png',
    cards: [],
  },
  {
    title: 'Collapsible Solar Power Station (V3)',
    subtitle: 'Innovative design for modern energy challenges.',
    image: '/removed bg product 3.png',
    cards: [],
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
  const [fade, setFade] = useState(false);
  const fadeTimeout = useRef();
  const slide = featuredSlides[currentSlide];

  const handleLearnMore = (service) => {
    setSelectedService(service);
    setShowServiceDetail(true);
  };

  const closeServiceDetailModal = () => {
    setShowServiceDetail(false);
    setSelectedService(null);
  };

  const handlePrev = () => {
    setFade(true);
    clearTimeout(fadeTimeout.current);
    fadeTimeout.current = setTimeout(() => {
      setCurrentSlide((prev) => (prev === 0 ? featuredSlides.length - 1 : prev - 1));
      setFade(false);
    }, 250);
  };
  const handleNext = () => {
    setFade(true);
    clearTimeout(fadeTimeout.current);
    fadeTimeout.current = setTimeout(() => {
      setCurrentSlide((prev) => (prev === featuredSlides.length - 1 ? 0 : prev + 1));
      setFade(false);
    }, 250);
  };
  const handleImageClick = () => setShowSpecs((prev) => !prev);

  return (
    <div className="homepage-root">
      {/* Main Homepage Section */}
      <section id="home" className="homepage-section home-section-modern" style={{
        minHeight: 'calc(100vh - 64px)',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        position: 'relative',
        background: '#222',
        overflow: 'hidden',
        padding: 0,
        paddingTop: '120px',
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
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.72) 0%, rgba(11, 11, 12, 0.92) 100%)',
          zIndex: 2,
        }} />
        <div className="homepage-content" style={{
          position: 'relative',
          zIndex: 3,
          maxWidth: 650,
          width: '100%',
          margin: '0 auto',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 2rem',
        }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 700,
            marginBottom: 64,
            lineHeight: 1.08,
            letterSpacing: '-2px',
            fontFamily: 'Poppins, sans-serif',
            textShadow: '0 4px 24px rgba(0,0,0,0.18)',
            maxWidth: '650px',
          }}>
            Sustainable Energy<br />
            <span className="nowrap-span">that Adapts to You</span>
          </h1>
          <p style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
            fontWeight: 400,
            marginBottom: 48,
            maxWidth: 580,
            color: '#f3f3f3',
            textShadow: '0 2px 8px rgba(0,0,0,0.10)',
            lineHeight: 1.5
          }}>
            Embrace a greener future with innovative solutions tailored for eco-conscious living.
          </p>
          <button
            className="flash-slide flash-slide--green"
            onClick={() => navigate('/products')}
          >
            Shop Now
          </button>
        </div>
        {/* Animated Sliding Stats Section - now part of normal flow */}
        <div className="sliding-stats-container single-row">
          <div className="sliding-stats-track">
            <div className="stat-group">
              <div className="stat-number huge">120+</div>
              <div className="stat-label">
                <span className="stat-title">Projects</span>
                <span className="stat-desc">Completed worldwide</span>
              </div>
            </div>
            <div className="stat-group">
              <div className="stat-number huge">98%</div>
              <div className="stat-label">
                <span className="stat-title">Satisfaction</span>
                <span className="stat-desc">Client approval rate</span>
              </div>
            </div>
            <div className="stat-group">
              <div className="stat-number huge">24/7</div>
              <div className="stat-label">
                <span className="stat-title">Support</span>
                <span className="stat-desc">Always available</span>
              </div>
            </div>
            <div className="stat-group">
              <div className="stat-number huge">50+</div>
              <div className="stat-label">
                <span className="stat-title">Team Members</span>
                <span className="stat-desc">Expert professionals</span>
              </div>
            </div>
            <div className="stat-group">
              <div className="stat-number huge">10</div>
              <div className="stat-label">
                <span className="stat-title">Awards</span>
                <span className="stat-desc">Industry recognition</span>
              </div>
            </div>
            {/* Duplicate for continuous effect */}
            <div className="stat-group">
              <div className="stat-number huge">120+</div>
              <div className="stat-label">
                <span className="stat-title">Projects</span>
                <span className="stat-desc">Completed worldwide</span>
              </div>
            </div>
            <div className="stat-group">
              <div className="stat-number huge">98%</div>
              <div className="stat-label">
                <span className="stat-title">Satisfaction</span>
                <span className="stat-desc">Client approval rate</span>
              </div>
            </div>
            <div className="stat-group">
              <div className="stat-number huge">24/7</div>
              <div className="stat-label">
                <span className="stat-title">Support</span>
                <span className="stat-desc">Always available</span>
              </div>
            </div>
            <div className="stat-group">
              <div className="stat-number huge">50+</div>
              <div className="stat-label">
                <span className="stat-title">Team Members</span>
                <span className="stat-desc">Expert professionals</span>
              </div>
            </div>
            <div className="stat-group">
              <div className="stat-number huge">10</div>
              <div className="stat-label">
                <span className="stat-title">Awards</span>
                <span className="stat-desc">Industry recognition</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="featured" className="homepage-section featured-section-modern" style={{
        minHeight: '100vh',
        width: '100%',
        background: 'linear-gradient(180deg, #b2f0e6 0%, #d0f7c6 70%, #fff 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '8rem 1rem 3rem 1rem',
      }}>
        <h2 style={{ fontSize: '2.8rem', fontWeight: 700, color: '#111', marginBottom: 8, textAlign: 'center', letterSpacing: '-1px', textShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>{slide.title}</h2>
        <div style={{ fontSize: '1.1rem', color: '#444', marginBottom: 24, textAlign: 'center', fontWeight: 400, paddingBottom: 16 }}>{slide.subtitle}</div>
        <div
          style={{ position: 'relative', width: '90vw', maxWidth: 1200, height: 520, margin: '0 auto', marginBottom: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onTouchStart={e => {
            if (e.touches && e.touches.length === 1) {
              window._swipeStartX = e.touches[0].clientX;
            }
          }}
          onTouchEnd={e => {
            if (typeof window._swipeStartX === 'number' && e.changedTouches && e.changedTouches.length === 1) {
              const deltaX = e.changedTouches[0].clientX - window._swipeStartX;
              if (Math.abs(deltaX) > 50) {
                if (deltaX < 0) handleNext();
                else handlePrev();
              }
              window._swipeStartX = undefined;
            }
          }}
        >
          {/* Left arrow */}
          <div className="featured-arrow-left" style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 2 }}>
            <button onClick={handlePrev} aria-label="Previous" style={{
              background: 'none',
              border: 'none',
              fontSize: 56,
              color: '#222',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
            <span className="material-symbols-outlined" style={{ fontSize: 56 }}>chevron_left</span>
          </button>
          </div>
          {/* Product image (transparent PNG, no shadow/container) */}
          <img
            src={slide.image}
            alt="Product"
            className={`featured-image-fade${fade ? ' exiting' : ''}`}
            style={{ width: 700, height: 420, display: 'block', margin: '0 auto', position: 'relative', zIndex: 1, background: 'none' }}
          />
          {/* Right arrow */}
          <div className="featured-arrow-right" style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 2 }}>
            <button onClick={handleNext} aria-label="Next" style={{
              background: 'none',
              border: 'none',
              fontSize: 56,
              color: '#222',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
            <span className="material-symbols-outlined" style={{ fontSize: 56 }}>chevron_right</span>
          </button>
          </div>
          {/* Dots indicator */}
          <div className="dots-indicator featured-section-modern dots-indicator" style={{ position: 'absolute', left: 0, right: 0, bottom: -32 }}>
            {featuredSlides.map((_, i) => (
              <span key={i} className={`dot${i === currentSlide ? ' active' : ''}`}></span>
            ))}
          </div>
        </div>
        {/* Description Section */}
        <div style={{
          background: 'rgba(40,40,40,0.08)',
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
                <div style={{ fontWeight: 700, fontSize: 28, marginBottom: 18, letterSpacing: '-1px', color: '#111' }}>{desc.heading}</div>
                <div style={{ fontSize: 18, color: '#222', lineHeight: 1.6 }}>{desc.text}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="services" className="homepage-section services-section" style={{
        background: '#fff',
        width: '100%',
        position: 'relative',
      }}>
        <h2 style={{textAlign: 'center', color: '#111'}}>Our Services</h2>
        <div className="services-flex">
          {defaultServices.map(service => (
            <div className="service-card" key={service._id}>
              <div className="service-icon material-symbols-outlined" style={{background:'#e0fbe8',color:'#28a745',borderRadius:'50%',padding:'16px',fontSize:'2.5rem',marginBottom:'1rem',display:'inline-flex',alignItems:'center',justifyContent:'center'}}>{service.materialIcon}</div>
              <h3 style={{color:'#222',margin:'0.7rem 0 0.5rem 0',fontWeight:600,fontSize:'1.25rem',textAlign:'center'}}>{service.name}</h3>
              <p style={{color:'#222',fontSize:'1rem',margin:'0 0 0.7rem 0',textAlign:'center'}}>{service.description}</p>
              <div style={{flex:1}} />
              <button className="learn-more-btn" onClick={() => handleLearnMore(service)}>
                Learn More
              </button>
            </div>
          ))}
        </div>
        {/* CTA Section with heading and subheading */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '3rem',
          marginBottom: '1.5rem',
        }}>
          <div style={{
            fontWeight: 700,
            fontSize: '1.7rem',
            marginBottom: 8,
            color: '#111',
            textAlign: 'center',
            fontFamily: 'Poppins, sans-serif',
          }}>
            Ready to Get Started?
          </div>
          <div style={{
            fontSize: '1.1rem',
            color: '#222',
            marginBottom: 24,
            textAlign: 'center',
            maxWidth: 600,
          }}>
            Contact us today to discuss your project requirements and get customized solutions
        </div>
        <div className="services-cta">
          <button className="contact-btn" onClick={() => setShowContact(true)}>Contact Us</button>
          <button className="quote-btn" onClick={() => setShowQuote(true)}>Request a Quote</button>
          </div>
        </div>
      </section>
      <section id="about" style={{
        background: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('about-bg.jpg') center/cover fixed",
        padding: "6rem 0 3rem 0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "520px",
        position: "relative",
        width: '100%',
      }}>
        {/* SVG wave at top, merging with about-bg */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          lineHeight: 0,
          zIndex: 2,
          pointerEvents: 'none',
        }}>
          <svg viewBox="0 0 1440 80" width="100%" height="80" preserveAspectRatio="none" style={{ display: 'block' }}>
            <path
              d="M0,40 C480,0 960,0 1440,40 L1440,0 L0,0 Z"
              fill="#fff"
            />
          </svg>
        </div>
        <div className="about-2x2-grid" style={{
          display: "flex",
          flexDirection: "column",
          gap: "4rem",
          width: "min(1200px, 95vw)",
          margin: "0 auto",
          position: "relative",
          zIndex: 3,
        }}>
          <div style={{ display: "flex", gap: "4rem", width: "100%" }}>
            <img
              src="/about(2).jpg"
              alt="About 2"
              className="about-img"
              style={{
                width: "600px",
                height: "400px",
                objectFit: "cover",
                borderRadius: "16px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                transition: "transform 0.35s cubic-bezier(.4,0,.2,1)"
              }}
            />
            <div style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              padding: "0 1rem"
            }}>
              <h2 style={{ fontSize: "2.3rem", fontWeight: 600, marginBottom: "1.2rem", marginTop: 0, color: "#fff" }}>Who We Are</h2>
              <p style={{ fontSize: "1.1rem", color: "#fff", lineHeight: 1.6, margin: 0 }}>
                The Collapsible Solar Power Station for farm irrigation uses renewable energy from the sun. It features solar panels that convert sunlight into electricity, providing a sustainable and eco-friendly source of energy for irrigating the farm.
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "4rem", width: "100%" }}>
            <img
              src="/about(1).jpg"
              alt="About 1"
              className="about-img"
              style={{
                width: "600px",
                height: "400px",
                objectFit: "cover",
                borderRadius: "16px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                transition: "transform 0.35s cubic-bezier(.4,0,.2,1)"
              }}
            />
            <img
              src="/about(3).jpg"
              alt="About 3"
              className="about-img"
              style={{
                width: "600px",
                height: "400px",
                objectFit: "cover",
                borderRadius: "16px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                transition: "transform 0.35s cubic-bezier(.4,0,.2,1)"
              }}
            />
          </div>
        </div>
        <style>{`
          .about-img:hover {
            transform: scale(1.13);
            z-index: 2;
            box-shadow: 0 8px 32px rgba(40,167,69,0.13);
          }
          @media (max-width: 900px) {
            .about-2x2-grid {
              gap: 1.5rem;
            }
            .about-2x2-grid > div {
              flex-direction: column !important;
              gap: 1.5rem;
              align-items: center;
            }
            .about-img {
              width: 90vw !important;
              max-width: 340px;
              height: 180px !important;
            }
          }
          @media (max-width: 600px) {
            .featured-arrow-left, .featured-arrow-right {
              display: none !important;
            }
          }
        `}</style>
      </section>
      {/* Footer Section */}
      <footer style={{
        width: '100%',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        color: '#333',
        padding: '4rem 2rem 2rem 2rem',
        fontFamily: 'Poppins, sans-serif',
        marginTop: '0',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
        boxSizing: 'border-box'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start'
        }}>
          {/* Request a Quote */}
          <div>
            <div style={{ color: '#666', fontSize: '0.95rem', marginBottom: '8px', fontWeight: 500 }}>Get a custom solution</div>
            <div style={{ fontWeight: 700, fontSize: '2.2rem', marginBottom: '1.5rem', lineHeight: 1.2, color: '#2c3e50' }}>Request a Quote</div>
            <button 
              type="button" 
              onClick={() => setShowQuote(true)} 
              style={{
                background: '#28a745',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                padding: '1rem 2.5rem',
                fontWeight: 600,
                fontSize: '1.1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(40,167,69,0.3)',
                fontFamily: 'Poppins, sans-serif'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#218838';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(40,167,69,0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#28a745';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(40,167,69,0.3)';
              }}
            >
              Request Quote
            </button>
          </div>

          {/* Company */}
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: 12, color: '#2c3e50' }}>Company</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href="#about" onClick={e => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }} style={{ color: '#555', textDecoration: 'none', fontSize: '1rem', transition: 'color 0.2s ease', fontWeight: 500 }} onMouseEnter={e => e.target.style.color = '#28a745'} onMouseLeave={e => e.target.style.color = '#555'}>About Us</a>
              <a href="#services" onClick={e => { e.preventDefault(); document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }); }} style={{ color: '#555', textDecoration: 'none', fontSize: '1rem', transition: 'color 0.2s ease', fontWeight: 500 }} onMouseEnter={e => e.target.style.color = '#28a745'} onMouseLeave={e => e.target.style.color = '#555'}>Services</a>
              <a href="/products" onClick={e => { e.preventDefault(); navigate('/products'); }} style={{ color: '#555', textDecoration: 'none', fontSize: '1rem', transition: 'color 0.2s ease', fontWeight: 500 }} onMouseEnter={e => e.target.style.color = '#28a745'} onMouseLeave={e => e.target.style.color = '#555'}>Products</a>
              <a href="/contact" onClick={e => { e.preventDefault(); navigate('/contact'); }} style={{ color: '#555', textDecoration: 'none', fontSize: '1rem', transition: 'color 0.2s ease', fontWeight: 500 }} onMouseEnter={e => e.target.style.color = '#28a745'} onMouseLeave={e => e.target.style.color = '#555'}>Contact</a>
            </div>
          </div>

          {/* Contact Info with Icons */}
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: 12, color: '#2c3e50' }}>Contact</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span className="material-symbols-outlined" style={{ color: '#28a745', fontSize: 20 }}>mail</span>
              <a href="mailto:info@resetcorp.com" style={{ color: '#28a745', textDecoration: 'none', fontWeight: 500 }}>info@resetcorp.com</a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span className="material-symbols-outlined" style={{ color: '#28a745', fontSize: 20 }}>call</span>
              <a href="tel:+15551234567" style={{ color: '#28a745', textDecoration: 'none', fontWeight: 500 }}>+1 (555) 123-4567</a>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
              <span className="material-symbols-outlined" style={{ color: '#28a745', fontSize: 20, marginTop: 2 }}>location_on</span>
              <span style={{ color: '#333', fontSize: '1rem' }}>Batangas, 4200, Philippines</span>
            </div>
          </div>

          {/* Our Services (no descriptions) */}
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: 12, color: '#2c3e50', textAlign: 'left' }}>Our Services</div>
            <ul style={{ paddingLeft: 18, color: '#333', fontSize: '1rem', margin: 0, listStyle: 'disc', textAlign: 'left' }}>
              <li>Sustainable Energy Solutions</li>
              <li>Fabrication and Installation</li>
              <li>Research</li>
            </ul>
          </div>
        </div>

        {/* Bottom Section with Social Links and Copyright */}
        <div style={{
          maxWidth: '1200px',
          margin: '3rem auto 0',
          paddingTop: '2rem',
          borderTop: '1px solid #dee2e6',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ 
            fontSize: '0.95rem', 
            color: '#666',
            fontWeight: 500
          }}>
            &copy; {new Date().getFullYear()} Collapsible Solar Solutions. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a 
              href="#" 
              style={{ 
                background: '#28a745',
                color: '#fff',
                padding: '8px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                width: '40px',
                height: '40px'
              }} 
              aria-label="Facebook"
              onMouseEnter={(e) => {
                e.target.style.background = '#218838';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#28a745';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>public</span>
            </a>
            <a 
              href="#" 
              style={{ 
                background: '#28a745',
                color: '#fff',
                padding: '8px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                width: '40px',
                height: '40px'
              }} 
              aria-label="Twitter"
              onMouseEnter={(e) => {
                e.target.style.background = '#218838';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#28a745';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>alternate_email</span>
            </a>
            <a 
              href="#" 
              style={{ 
                background: '#28a745',
                color: '#fff',
                padding: '8px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                width: '40px',
                height: '40px'
              }} 
              aria-label="Instagram"
              onMouseEnter={(e) => {
                e.target.style.background = '#218838';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#28a745';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>photo_camera</span>
            </a>
            <a 
              href="#" 
              style={{ 
                background: '#28a745',
                color: '#fff',
                padding: '8px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                width: '40px',
                height: '40px'
              }} 
              aria-label="LinkedIn"
              onMouseEnter={(e) => {
                e.target.style.background = '#218838';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#28a745';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>business_center</span>
            </a>
          </div>
        </div>
      </footer>
      <ContactModal isOpen={showContact} onClose={() => setShowContact(false)} />
      <QuoteModal isOpen={showQuote} onClose={() => setShowQuote(false)} />
      <ServiceDetailModal isOpen={showServiceDetail} onClose={closeServiceDetailModal} service={selectedService} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined');
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
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
        .home-section { background: #e8fbe8; min-height: 60vh; }
        .featured-section { background: #f1fbe9; }
        .services-section { background: #f6fff6; }
        .about-section { background: #f4fbe8; }
        .footer-section { background: #e8fbe8; min-height: 20vh; }
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
          box-shadow: 0 2px 12px rgba(40,167,69,0.13);
          padding: 2.5rem 1.8rem 2rem 1.8rem;
          min-width: 260px;
          max-width: 320px;
          flex: 1 1 260px;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: box-shadow 0.3s, transform 0.3s;
          border: 2px solid #e8fbe8;
        }
        .service-card:hover {
          box-shadow: 0 8px 32px rgba(40,167,69,0.13);
          transform: translateY(-8px) scale(1.03);
          border-color: #28a745;
        }
        .service-icon.material-symbols-outlined {
          background: #e8fbe8;
          color: #28a745;
          border-radius: 50%;
          padding: 16px;
          font-size: 2.5rem;
          margin-bottom: 1rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .service-card ul {
          text-align: left;
          margin: 1rem 0;
          padding-left: 1.2rem;
        }
        .learn-more-btn {
          position: relative;
          width: 150px;
          padding: 12px;
          border-radius: 20px;
          color: #111;
          border: 2px solid #bbb;
          background: transparent;
          font-weight: 500;
          margin-top: 1rem;
          overflow: hidden;
          z-index: 1;
          cursor: pointer;
          transition: background 0.3s, color 0.2s, border-color 0.2s;
        }
        .learn-more-btn:hover {
          background: #28a745;
          color: #fff;
          border-color: #28a745;
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
          transition: background 0.2s;
        }
        .quote-btn {
          background: #28a745;
        }
        .contact-btn:hover, .quote-btn:hover {
          background: #218838;
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
        .flash-slide {
          border: none;
          display: inline-block;
          color: #222;
          border-radius: 32px;
          position: relative;
          overflow: hidden;
          text-decoration: none;
          font-family: 'Poppins', sans-serif;
          font-size: 20px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(40,167,69,0.13);
          transition: box-shadow 0.3s, transform 0.3s;
          background: linear-gradient(90deg, #e8fbe8 0%, #28a745 100%);
          cursor: pointer;
          padding: 18px 52px;
        }
        .flash-slide--green {
          background: linear-gradient(90deg, #e8fbe8 0%, #28a745 100%);
        }
        
        .flash-slide:hover {
          transform: scale(1.08);
          box-shadow: 0 8px 32px rgba(40,167,69,0.25);
        }

        .flash-slide::before {
          content: "";
          position: absolute;
          top: 0;
          left: -75%;
          width: 50%;
          height: 100%;
          background: rgba(255, 255, 255, 0.3);
          transform: skewX(-20deg);
          transition: left 0.5s;
        }

        .flash-slide:hover::before {
          left: 125%;
        }
        .sliding-stats-container.single-row {
          position: static;
          width: 100vw;
          margin-top: 32px;
          z-index: 10;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          pointer-events: none;
          overflow: hidden;
        }
        .sliding-stats-track {
          display: flex;
          align-items: flex-end;
          gap: 96px;
          animation: slide-stats 32s linear infinite;
        }
        .stat-group {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          min-width: 320px;
          padding: 0 32px 0 0;
          background: none;
          border-radius: 0;
          box-shadow: none;
        }
        .stat-number.huge {
          font-family: 'Poppins', sans-serif;
          font-size: 5.2rem;
          font-weight: 800;
          color: #fff;
          line-height: 1;
          margin-right: 18px;
          text-shadow: 0 4px 24px rgba(0,0,0,0.18);
        }
        .stat-label {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          font-family: 'Poppins', sans-serif;
          font-size: 2.1rem;
          font-weight: 300;
          color: #e0f7fa;
          letter-spacing: 0.02em;
          white-space: nowrap;
        }
        .stat-title {
          font-size: 2.1rem;
          font-weight: 300;
          color: #e0f7fa;
          line-height: 1.1;
        }
        .stat-desc {
          font-size: 1.1rem;
          font-weight: 200;
          color: #b2f0e6;
          line-height: 1.1;
        }
        @keyframes slide-stats {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .featured-section-modern button[aria-label="Previous"],
        .featured-section-modern button[aria-label="Next"] {
          transition: transform 0.2s cubic-bezier(.4,0,.2,1);
        }
        .featured-section-modern button[aria-label="Previous"]:hover,
        .featured-section-modern button[aria-label="Next"]:hover {
          transform: scale(1.35);
        }
        .featured-section-modern button[aria-label="Previous"]:focus:not(:focus-visible),
        .featured-section-modern button[aria-label="Next"]:focus:not(:focus-visible) {
          outline: none;
          box-shadow: none;
        }
        .featured-section-modern .dots-indicator {
          display: flex;
          justify-content: center;
          gap: 12px;
          align-items: center;
        }
        .featured-section-modern .dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #b2b2b2;
          display: inline-block;
          transition: background 0.2s, transform 0.4s cubic-bezier(.4,0,.2,1);
        }
        .featured-section-modern .dot.active {
          background: #222;
          transform: scale(1.3);
        }
        .featured-image-fade {
          opacity: 1;
          transition: opacity 0.5s cubic-bezier(.4,0,.2,1);
        }
        .featured-image-fade.exiting {
          opacity: 0;
        }
        @media (max-width: 600px) {
          .home-section-modern h1 {
            font-size: clamp(2.8rem, 11vw, 4rem) !important;
            margin-bottom: 18px !important;
            line-height: 1.14 !important;
            letter-spacing: 0 !important;
            word-break: break-word !important;
            text-align: center !important;
          }
          .home-section-modern p {
            font-size: clamp(1.1rem, 4vw, 1.3rem) !important;
            margin-bottom: 20px !important;
          }
          .home-section-modern .homepage-content {
            max-width: 100% !important;
            padding: 0 0.2rem !important;
            margin: 0 auto !important;
            align-items: center !important;
            justify-content: center !important;
            text-align: center !important;
            display: flex !important;
            flex-direction: column !important;
          }
          .home-section-modern .nowrap-span {
            white-space: normal !important;
          }
        }
        @media (max-width: 450px) {
          .home-section-modern h1 {
            font-size: 2.3rem !important;
            line-height: 1.18 !important;
          }
          .home-section-modern p {
            font-size: 1.05rem !important;
          }
        }
        @media (max-width: 370px) {
          .home-section-modern h1 {
            font-size: 1.8rem !important;
            line-height: 1.22 !important;
          }
          .home-section-modern p {
            font-size: 0.85rem !important;
          }
        }
        @media (max-height: 900px) {
          .home-section-modern {
            min-height: unset !important;
            padding-top: 80px !important;
            padding-bottom: 40px !important;
          }
        }
        .homepage-stats-row {
          margin-top: 64px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: flex-end;
          z-index: 3;
          position: relative;
        }
        @media (max-width: 900px), (max-height: 900px) {
          .homepage-stats-row {
            margin-top: 80px !important;
          }
        }
        @media (max-width: 600px) {
          .homepage-stats-row {
            flex-direction: column;
            margin-top: 48px !important;
            gap: 24px;
          }
        }
        @media (max-width: 900px), (max-height: 900px) {
          .sliding-stats-container.single-row {
            z-index: 10 !important;
            position: static !important;
            margin-top: 24px;
            bottom: unset !important;
            pointer-events: auto;
          }
          .home-section-modern {
            min-height: unset !important;
            padding-top: 80px !important;
            padding-bottom: 40px !important;
          }
        }
        @media (max-width: 600px) {
          .sliding-stats-container.single-row {
            z-index: 10 !important;
            position: static !important;
            margin-top: 16px;
            bottom: unset !important;
            pointer-events: auto;
          }
          .home-section-modern {
            min-height: unset !important;
            padding-top: 60px !important;
            padding-bottom: 24px !important;
          }
          .stat-number.huge {
            font-size: 1.35rem;
          }
          .stat-title {
            font-size: 0.9rem;
          }
          .stat-desc {
            font-size: 0.65rem;
          }
        }
        @media (max-height: 1080px) and (min-width: 1200px) {
          .stat-number.huge {
            font-size: 3.2rem;
          }
          .stat-title {
            font-size: 1.3rem;
          }
          .stat-desc {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;