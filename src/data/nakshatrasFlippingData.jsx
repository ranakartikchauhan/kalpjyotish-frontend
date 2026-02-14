// src/data/nakshatrasFlippingData.jsx
import React from 'react';
import { GiStarKey, GiMoon, GiSun, GiGalaxy, GiCometSpark, GiStarFormation, GiSpikedDragonHead } from 'react-icons/gi';
import { FaFeatherAlt } from 'react-icons/fa';

// A curated list of 8 celestial/mystical icons to cycle through
const icons = [
  <GiStarKey />, <GiMoon />, <GiSun />, <GiGalaxy />, 
  <GiCometSpark />, <GiStarFormation />, <FaFeatherAlt />, <GiSpikedDragonHead />
];

const nakshatraNames = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu",
  "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra",
  "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Moola", "Purva Ashadha", "Uttara Ashadha",
  "Shravana", "Dhanishtha", "Satabhisha", "Purva Bhadrapad", "Uttara Bhadrapad", "Revati"
];

// Map the names to an object with a name and a cycled icon
export const nakshatrasData = nakshatraNames.map((name, index) => ({
  name: name,
  icon: icons[index % icons.length], // Use modulo to cycle through the icon array
  link: `/nakshatra/${name.toLowerCase().replace(' ', '-')}`
}));