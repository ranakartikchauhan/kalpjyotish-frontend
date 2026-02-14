import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Modal.css';

const Modal = ({ service, onClose }) => {
  const [language, setLanguage] = useState('en');

  if (!service) {
    return null;
  }

  const handleWhatsAppRedirect = () => {
    const phoneNumber = '+918979408209';
    const message = `Selected Service: ${service.title}`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <AnimatePresence>
      <motion.div
        className="modal-backdrop"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="modal-content"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
        >
          <div className="modal-header">
            <div className="language-switcher">
              <button 
                onClick={() => setLanguage('en')} 
                className={language === 'en' ? 'active' : ''}
              >
                EN
              </button>
              <button 
                onClick={() => setLanguage('hi')} 
                className={language === 'hi' ? 'active' : ''}
              >
                HI
              </button>
            </div>
            <button className="close-button" onClick={onClose}>&times;</button>
          </div>
          <div className="modal-body">
            <p>{service.description[language]}</p>
          </div>
          <div className="modal-footer">
            <button className="connect-button" onClick={handleWhatsAppRedirect}>
              Connect with Astrologer
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Modal;