import React from 'react';

const WhatsAppButton = () => {
  return (
    <div className="whatsapp-button">
      <a href="https://wa.me/+51956363462" target="_blank" rel="noopener noreferrer">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/60/WhatsApp.svg" // Puedes cambiar este enlace por tu imagen de WhatsApp personalizada
          alt="WhatsApp"
          className="whatsapp-icon"
        />
      </a>
    </div>
  );
};

export default WhatsAppButton;
