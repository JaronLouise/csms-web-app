import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import ContactModal from '../components/ContactModal';
import { useAuth } from '../context/AuthContext';

const Contact = () => {
  const [showContactModal, setShowContactModal] = useState(false);
  const { user } = useAuth();

  const handleContactUs = () => {
    setShowContactModal(true);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(180deg, #b2f0e6 0%, #d0f7c6 70%)',
      fontFamily: 'Poppins, sans-serif',
      boxSizing: 'border-box',
      padding: '80px 0 32px 0',
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
        body { font-family: 'Poppins', sans-serif; }
        .contact-card { background: #fff; border-radius: 24px; box-shadow: 0 6px 32px rgba(0,0,0,0.10); max-width: 66%; width: 100%; margin: 0 auto; padding: 0; box-sizing: border-box; overflow: visible; }
        .contact-header-bar { background: linear-gradient(90deg, #e8fbe8 0%, #28a745 100%); border-radius: 24px 24px 0 0; padding: 36px 32px 28px 32px; display: flex; flex-direction: column; align-items: center; position: relative; }
        .contact-header-title { font-size: 2rem; font-weight: 700; color: #111; margin-bottom: 6px; text-align: center; }
        .contact-header-sub { font-size: 1.08rem; color: #333; margin-bottom: 22px; text-align: center; }
        .contact-header-btn-row { display: flex; justify-content: center; width: 100%; }
        .contact-header-btn { display: flex; align-items: center; gap: 10px; background: #111; color: #fff; border: none; border-radius: 999px; padding: 14px 32px; font-size: 1.1rem; font-weight: 600; font-family: 'Poppins', sans-serif; box-shadow: 0 4px 20px rgba(40,167,69,0.13); cursor: pointer; transition: background 0.2s, transform 0.2s; }
        .contact-header-btn:hover { background: #222; transform: translateY(-2px) scale(1.03); }
        .contact-cards-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 28px;
          justify-content: center;
          margin: 0;
          padding: 40px 40px 40px 40px;
          background: none;
        }
        @media (max-width: 1100px) {
          .contact-card { max-width: 90%; }
          .contact-cards-row { grid-template-columns: repeat(2, 1fr); padding: 32px 16px; }
        }
        @media (max-width: 700px) {
          .contact-header-bar { padding: 24px 4vw 18px 4vw; }
          .contact-cards-row { grid-template-columns: 1fr; gap: 16px; padding: 18px 4vw; }
        }
        .contact-card-info {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 2px 12px rgba(40,167,69,0.08);
          min-width: 0;
          max-width: 100%;
          min-height: 170px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1.5rem 1.5rem 1.5rem 1.5rem;
          position: relative;
          transition: box-shadow 0.3s cubic-bezier(.4,0,.2,1), transform 0.3s cubic-bezier(.4,0,.2,1);
        }
        .contact-card-info:hover {
          box-shadow: 0 8px 32px rgba(40,167,69,0.18);
          transform: translateY(-8px) scale(1.02);
          z-index: 2;
        }
        .contact-card-icon {
          font-size: 2rem;
          color: #28a745;
          margin-bottom: 18px;
        }
        .contact-card-title {
          font-size: 1.12rem;
          font-weight: 600;
          color: #222;
          margin-bottom: 8px;
          text-align: center;
          letter-spacing: 0.01em;
        }
        .contact-card-desc {
          font-size: 1rem;
          color: #222;
          margin-bottom: 0;
          text-align: center;
        }
        .contact-card-link {
          color: #111;
          text-decoration: none;
          word-break: break-all;
          transition: color 0.2s, text-decoration 0.2s;
          cursor: pointer;
          font-size: 0.98rem;
          font-family: 'Poppins', sans-serif;
          font-weight: 500;
          text-align: center;
          margin-bottom: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 220px;
        }
        .contact-card-link:hover { color: #28a745; text-decoration: underline; }
      `}</style>
      <div className="contact-card">
        <div className="contact-header-bar">
          <div className="contact-header-title">Get in Touch</div>
          <div className="contact-header-sub">Ready to start your project? Contact us today for consultation</div>
          <div className="contact-header-btn-row">
            <button className="contact-header-btn" onClick={handleContactUs}><span role="img" aria-label="chat">🗨️</span> Send Us a Message</button>
          </div>
        </div>
        <div className="contact-cards-row">
          <div className="contact-card-info">
            <FaEnvelope className="contact-card-icon" />
            <div className="contact-card-title">Email:</div>
            <a href="mailto:info@resetcorm.com" className="contact-card-link">Info@resetcorm.com</a>
          </div>
          <div className="contact-card-info">
            <FaPhone className="contact-card-icon" />
            <div className="contact-card-title">Phone:</div>
            <div className="contact-card-desc">+1(555)123–456<br />+1(555)987–654</div>
          </div>
          <div className="contact-card-info">
            <FaMapMarkerAlt className="contact-card-icon" />
            <div className="contact-card-title">Address:</div>
            <div className="contact-card-desc">2/F Steerhub<br />Batangas State University,<br />Batangas City,<br />4200, Philippines</div>
          </div>
          <div className="contact-card-info">
            <FaClock className="contact-card-icon" />
            <div className="contact-card-title">Business Hours:</div>
            <div className="contact-card-desc">Mon–Fri: 8:00 AM – 6:00 PM<br />Sat: 9:00 AM – 3:00 PM<br />Sun: Closed</div>
          </div>
        </div>
      </div>
      <ContactModal 
        isOpen={showContactModal} 
        onClose={() => setShowContactModal(false)} 
      />
    </div>
  );
};

export default Contact; 