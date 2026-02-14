import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { premiumServicesData, complimentaryServicesData } from '../data/servicesData';
import Modal from './Modal';
import './ServicesSection.css';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

const ServicesSection = () => {
  const [selectedService, setSelectedService] = useState(null);

  const openModal = (service) => setSelectedService(service);
  const closeModal = () => setSelectedService(null);

  return (
    <section className="services-section">
      <motion.div
        className="service-container"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <h2 className="service-container-title">Our Services</h2>

        <div className="services-grid premium-grid">
          {premiumServicesData.map((service, index) => (
            <a href={service.link} className="service-item" key={`premium-${index}`}>
              <div className="icon-container">
                <div className="icon-wrapper">
                  <div className="service-icon">{service.icon}</div>
                </div>
              </div>
              <span className="service-title">{service.title}</span>
            </a>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="service-container"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <h2 className="service-container-title">
          Complimentary Astrology Services
        </h2>

        <div className="services-grid complimentary-grid">
          {complimentaryServicesData.map((service, index) => (
            <div
              className="service-item"
              key={`complimentary-${index}`}
              onClick={() => openModal(service)}
              style={{ cursor: 'pointer' }}
            >
              <div className="icon-container">
                <div className="icon-wrapper">
                  <div className="service-icon">{service.icon}</div>
                </div>
              </div>
              <span className="service-title">{service.title}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {selectedService && <Modal service={selectedService} onClose={closeModal} />}
    </section>
  );
};

export default ServicesSection;
