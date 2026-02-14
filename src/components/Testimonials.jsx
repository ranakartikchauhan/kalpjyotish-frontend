// src/components/Testimonials.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { testimonialsData } from '../data/testimonialsData';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import './Testimonials.css';

const cardVariants = {
  enter: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
  center: {
    zIndex: 1,
    opacity: 1,
    y: 0,
    scale: 1,
  },
  exit: {
    zIndex: 0,
    opacity: 0,
    y: -30,
    scale: 0.95,
  },
};

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeTestimonial = testimonialsData[activeIndex];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar key={i} color={i < rating ? 'var(--primary-color)' : '#4a4a4a'} />
    ));
  };

  return (
    <section className="testimonials-section">
      <h2 className="testimonials-title">What Our Users Say</h2>
      
      <div className="testimonial-display-area">
        <FaQuoteLeft className="quote-icon-bg" />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeIndex}
            className="testimonial-card"
            variants={cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <p className="testimonial-text">"{activeTestimonial.testimonial}"</p>
            <div className="testimonial-rating">{renderStars(activeTestimonial.rating)}</div>
            <div className="testimonial-author">
              <h3 className="author-name">{activeTestimonial.name}</h3>
              <p className="author-location">{activeTestimonial.location}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="testimonial-selectors">
        {testimonialsData.map((person, index) => (
          <motion.button
            key={person.id}
            className={`selector-btn ${index === activeIndex ? 'active' : ''}`}
            onClick={() => setActiveIndex(index)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <img src={person.image} alt={person.name} className="selector-img" />
          </motion.button>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;