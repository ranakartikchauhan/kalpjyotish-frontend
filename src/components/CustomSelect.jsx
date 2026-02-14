import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdExpandMore } from 'react-icons/md';
import './CustomSelect.css';

const CustomSelect = ({ icon, placeholder, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, transition: { duration: 0.2 } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };

  return (
    <div className="custom-select-container" ref={dropdownRef}>
      <button type="button" className="custom-select-trigger" onClick={() => setIsOpen(!isOpen)}>
        {icon}
        <span className={value ? 'value-selected' : ''}>
          {value || placeholder}
        </span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <MdExpandMore className="expand-icon" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            className="custom-select-options"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {placeholder && <li className="placeholder-option" onClick={() => handleSelect('')}>{placeholder}</li>}
            {options.map((option) => (
              <li
                key={option}
                className={`option-item ${option === value ? 'selected' : ''}`}
                onClick={() => handleSelect(option)}
              >
                {option}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomSelect;