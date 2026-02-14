// src/components/HamburgerIcon.jsx
import React from 'react';
import { motion } from 'framer-motion';

// SVG Path animation properties
const Path = (props) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke="hsl(0, 0%, 100%)" // White color
    strokeLinecap="round"
    {...props}
  />
);

const HamburgerIcon = ({ toggle, isOpen }) => (
  <motion.button
    onClick={toggle}
    className="hamburger-button"
    animate={isOpen ? 'open' : 'closed'}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
  >
    <svg width="23" height="23" viewBox="0 0 23 23">
      <Path
        variants={{
          closed: { d: 'M 2 2.5 L 20 2.5' },
          open: { d: 'M 3 16.5 L 17 2.5' },
        }}
      />
      <Path
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.1 }}
      />
      <Path
        variants={{
          closed: { d: 'M 2 16.346 L 20 16.346' },
          open: { d: 'M 3 2.5 L 17 16.346' },
        }}
      />
    </svg>
  </motion.button>
);

export default HamburgerIcon;