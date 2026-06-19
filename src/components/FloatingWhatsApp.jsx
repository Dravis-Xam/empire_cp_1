import React, { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import '../styles/FloatingWhatsApp.css';

export default function FloatingWhatsApp() {
  const [isHovering, setIsHovering] = useState(false);

  const handleWhatsAppClick = () => {
    const phoneNumber = '254711489056';
    const message = 'Hello! I would like to know more about your products.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div 
      className="floating-whatsapp"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleWhatsAppClick}
    >
      <div className="whatsapp-bubble">
        <FaWhatsapp className="whatsapp-icon" />
      </div>
      {isHovering && (
        <div className="whatsapp-tooltip">
          <small>Chat with us</small>
        </div>
      )}
    </div>
  );
}
