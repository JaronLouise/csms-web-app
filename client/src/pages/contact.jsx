import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaUser, FaComments } from 'react-icons/fa';
import ContactModal from '../components/ContactModal';
import { useAuth } from '../context/AuthContext';

const Contact = () => {
  const [showContactModal, setShowContactModal] = useState(false);
  const { user } = useAuth();

  const handleContactUs = () => {
    setShowContactModal(true);
  };

  return (
    <div>
      <div>
        <h1>Contact Us</h1>
        <p>Get in touch with our team. We're here to help with your renewable energy and sustainable technology needs.</p>
      </div>

      <div>
        {/* Only show contact form button for non-admin users */}
        {(!user || user.role !== 'admin') && (
          <div>
            <h2>Get In Touch</h2>
            <p>Ready to start your project? Contact us today for a consultation.</p>
            
            <button onClick={handleContactUs}>
              <FaEnvelope /> Send us a Message
            </button>
          </div>
        )}

        <div>
          <h2>Contact Information</h2>
          
          <div>
            <div>
              <FaEnvelope />
              <h3>Email</h3>
              <p>info@resetcorp.com</p>
            </div>

            <div>
              <FaPhone />
              <h3>Phone</h3>
              <p>+1 (555) 123-4567</p>
              <p>+1 (555) 987-6543</p>
            </div>

            <div>
              <FaMapMarkerAlt />
              <h3>Address</h3>
              <p>2/F STEERHUB Batangas State University</p>
              <p>Batangas City, 4200</p>
              <p>Philippines</p>
            </div>

            <div>
              <FaClock />
              <h3>Business Hours</h3>
              <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
              <p>Saturday: 9:00 AM - 3:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
        </div>

        <div>
          <h2>Our Services</h2>
          <p>We specialize in three main areas:</p>
          
          <div>
            <div>
              <h3>Sustainable Energy Solutions</h3>
              <p>Solar panels, wind energy systems, energy storage solutions, and energy efficiency audits.</p>
            </div>

            <div>
              <h3>Fabrication and Installation</h3>
              <p>Custom machinery fabrication, industrial equipment installation, and precision engineering.</p>
            </div>

            <div>
              <h3>Research</h3>
              <p>Renewable energy research, sustainable materials development, and technology innovation.</p>
            </div>
          </div>
        </div>

        <div>
          <h2>Why Choose RESET Corp.?</h2>
          <ul>
            <li>Expert team with years of experience</li>
            <li>Customized solutions for your specific needs</li>
            <li>Quality assurance and ongoing support</li>
            <li>Competitive pricing and transparent quotes</li>
            <li>Commitment to sustainability and innovation</li>
          </ul>
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