import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './DailyHoroscope.css';
import { useLazyGetHoroscopeQuery } from '../services/backendApi';

// --- Data & Constants ---
const zodiacSigns = [
  { name: 'aries', icon: '♈' },
  { name: 'taurus', icon: '♉' },
  { name: 'gemini', icon: '♊' },
  { name: 'cancer', icon: '♋' },
  { name: 'leo', icon: '♌' },
  { name: 'virgo', icon: '♍' },
  { name: 'libra', icon: '♎' },
  { name: 'scorpio', icon: '♏' },
  { name: 'sagittarius', icon: '♐' },
  { name: 'capricorn', icon: '♑' },
  { name: 'aquarius', icon: '♒' },
  { name: 'pisces', icon: '♓' },
];
const LOCK_DURATION = 24 * 60 * 60 * 1000;
const USERS_STORAGE_KEY = 'horoscopeUsers';

// --- Animation Variants ---
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };
const buttonHoverTap = { hover: { scale: 1.05, transition: { type: 'spring', stiffness: 300 } }, tap: { scale: 0.95 } };

// --- Child Components ---
const HoroscopeCard = (
  { sign, data, type, language }) => (
  <motion.div className="horoscope-result-card"
    initial={{ opacity: 0, y: 30, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -30, scale: 0.95 }}
    transition={{ type: 'spring', duration: 0.6 }}>
    <h3 className="horoscope-title">
      {zodiacSigns.find(z => z.name === sign)?.icon}
      {sign.toUpperCase()} - {type.toUpperCase()} Horoscope
    </h3>
    <p className="horoscope-desc">"{language === 'en' ? data?.description : data?.description_hi || 'हिंदी विवरण उपलब्ध नहीं है'}"</p>
    <div className="horoscope-details">
      <motion.div className="detail-box" whileHover={{ scale: 1.08, y: -5 }}>
        <span className="detail-icon">🎯</span>
        <span className='detail-text'>
          {language === 'en' ? 'Lucky Number' : 'लकी नंबर'}:
        </span>
        <strong>{data?.lucky_number}</strong>
      </motion.div>
      <motion.div className="detail-box" whileHover={{ scale: 1.08, y: -5 }}>
        <span className="detail-icon">🌈 </span>

        <span className='detail-text'>{language === 'en' ? 'Color' : 'रंग'}:</span>
        <strong>{data?.color}</strong>
      </motion.div>

      <motion.div className="detail-box"
        whileHover={{ scale: 1.08, y: -5 }}>
        <span className="detail-icon">😌 </span>
        <span className='detail-text'>
          {language === 'en' ? 'Mood' : 'मूड'}:
        </span>
        <strong>{data?.mood}</strong>
      </motion.div>

      <motion.div className="detail-box"
        whileHover={{ scale: 1.08, y: -5 }}>
        <span className="detail-icon">📅 </span>
        <span className='detail-text'>
          {language === 'en' ? 'Date' : 'तारीख'}:
        </span>
        <strong>{data?.date}</strong>
      </motion.div>
    </div>
  </motion.div>
);

const LockPopup = ({ onClose, language }) => (<motion.div className="popup-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}> <motion.div className="popup-content" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }} transition={{ type: 'spring' }}> <h4>{language === 'en' ? 'Sign Locked' : 'राशि लॉक है'}</h4> <p>{language === 'en' ? 'You have already selected a sign for this name. Please try a different one after 24 hours.' : 'आप इस नाम के लिए पहले ही एक राशि चुन चुके हैं। कृपया 24 घंटे के बाद दूसरी राशि चुनें।'}</p> <motion.button onClick={onClose} {...buttonHoverTap}>{language === 'en' ? 'Okay' : 'ठीक है'}</motion.button> </motion.div> </motion.div>);

// New component to guide the user initially
const WelcomeMessage = ({ language }) => (
  <motion.div
    className="welcome-message"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
  >
    <div className="welcome-icon">✨</div>
    <h3>{language === 'en' ? 'Ready for Your Reading?' : 'अपने भविष्य के लिए तैयार हैं?'}</h3>
    <p>{language === 'en' ? 'Please enter your name and select a sign to begin.' : 'शुरू करने के लिए कृपया अपना नाम दर्ज करें और एक राशि चुनें।'}</p>
  </motion.div>
);


// --- Main Component ---
const DailyHoroscope = () => {
  // CORRECTED: Initialize states to be "empty"
  const [name, setName] = useState('');
  const [sign, setSign] = useState(''); // Start with no sign selected
  const [type, setType] = useState('daily');
  const [data, setData] = useState(null); // Start with no data
  const [language, setLanguage] = useState('en');
  const [showLockPopup, setShowLockPopup] = useState(false);
  const [getHoroscope, { isFetching: loading }] = useLazyGetHoroscopeQuery();

  // EFFECT 1: Fetch data only when all conditions are met
  useEffect(() => {
    const fetchHoroscope = async () => {
      // GUARD CLAUSE: Do not fetch if name or sign is missing
      if (!name || !sign) {
        setData(null); // Clear any old data
        return;
      }

      try {
        const result = await getHoroscope({ sign, type }).unwrap();
        setData(result);
      } catch (err) {
        console.error('Failed to fetch horoscope:', err);
        setData(null);
      }
    };

    fetchHoroscope();
  }, [name, sign, type]); // This hook now depends on `name`

  // EFFECT 2: Check for a locked sign when the user's name changes
  useEffect(() => {
    if (!name) return;
    const normalizedName = name.trim().toLowerCase();
    const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY)) || {};
    const userData = users[normalizedName];

    if (userData && new Date().getTime() - userData.timestamp < LOCK_DURATION) {
      setSign(userData.sign);
    } else {
      // If a new name is entered that has no lock, reset the sign
      setSign('');
    }
  }, [name]);

  // HANDLER: Smarter logic for changing the sign
  const handleSignChange = (newSign) => {
    if (!name) {
      // Optionally show a small alert/toast message to enter name first
      console.log("Please enter a name first to select a sign.");
      return;
    }

    const normalizedName = name.trim().toLowerCase();
    const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY)) || {};
    const userData = users[normalizedName];
    const now = new Date().getTime();

    if (userData && now - userData.timestamp < LOCK_DURATION && userData.sign !== newSign) {
      setShowLockPopup(true);
    } else {
      setSign(newSign);
      users[normalizedName] = { sign: newSign, timestamp: now };
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }
  };

  return (
    <div className="daily-horoscope-page">
      <AnimatePresence>
        {showLockPopup && <LockPopup onClose={() => setShowLockPopup(false)} language={language} />}
      </AnimatePresence>

      <motion.div className="input-section" variants={containerVariants} initial="hidden" animate="visible">
        <motion.h2 variants={itemVariants}>{language === 'en' ? 'Get Your Horoscope' : 'अपना राशिफल जानें'}</motion.h2>

        <motion.input
          variants={itemVariants}
          type="text"
          placeholder={language === 'en' ? 'Enter your name to begin...' : 'शुरू करने के लिए नाम दर्ज करें...'}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <motion.div className="selectors" variants={itemVariants}>
          <select value={sign} onChange={(e) => handleSignChange(e.target.value)}>
            {/* Added disabled default option */}
            <option value="" disabled>{language === 'en' ? 'Select Your Sign' : 'अपनी राशि चुनें'}</option>
            {zodiacSigns.map((z) => (
              <option key={z.name} value={z.name}>{z.icon} {z.name.charAt(0).toUpperCase() + z.name.slice(1)}</option>
            ))}
          </select>

          <div className="toggle-buttons">
            <motion.button className={type === 'daily' ? 'active' : ''} onClick={() => setType('daily')} {...buttonHoverTap}>Daily</motion.button>
            <motion.button className={type === 'weekly' ? 'active' : ''} onClick={() => setType('weekly')} {...buttonHoverTap}>Weekly</motion.button>
          </div>

          <motion.div className="language-toggle" {...buttonHoverTap}>
            <button onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}>{language === 'en' ? 'हिंदी' : 'English'}</button>
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="horoscope-results-container">
        {loading && (<div className="spinner-container"><div className="spinner"></div></div>)}
        <AnimatePresence mode="wait">
          {!loading && data && <HoroscopeCard key={sign + type + language} sign={sign} data={data} type={type} language={language} />}
          {!loading && !data && <WelcomeMessage language={language} />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DailyHoroscope;
