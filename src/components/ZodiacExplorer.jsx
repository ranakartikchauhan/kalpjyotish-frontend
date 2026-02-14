// src/components/ZodiacSigns.jsx
// NEW JSX STRUCTURE TO MATCH THE LATEST IMAGE

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { zodiacSignsData } from '../data/zodiacData';
import './ZodiacExplorer.css'; // Assuming you have a CSS file for styles

const ZodiacSigns = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 30 }
  };

  return (
    <section className="zodiac-signs-page">
      {/* Header is hidden via CSS to match the clean look of the screenshot */}
      <div className="zodiac-signs-header">
        <h1 className="zodiac-signs-title">Zodiac Signs</h1>
      </div>

      <motion.div 
        className="zodiac-signs-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {zodiacSignsData.map(sign => (
          <motion.div key={sign.name} variants={cardVariants}>
            <Link to={sign.link} className="zodiac-sign-card">
              {/* This is the new structure for the purple icon box */}
              <div className="card-icon-content-wrapper">
                {/* 1. The giant, faint glyph in the background */}
                <div className="zodiac-glyph">{sign.icon}</div>
                {/* 2. The text layered on top */}
                <div className="card-text-overlay">
                  <h3 className="card-name">{sign.name}</h3>
                  <p className="card-trait">{sign.trait}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default ZodiacSigns;