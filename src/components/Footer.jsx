// src/components/Footer.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GiSun } from 'react-icons/gi';
import { FaFacebookF, FaYoutube, FaInstagram, FaXTwitter, FaWhatsapp, FaPhone } from 'react-icons/fa6';
import { FiArrowUp } from 'react-icons/fi';
import { quickLinks, usefulLinks } from '../data/footerLinksData';
import ContactForm from "./ContactForm";
// import AstrologerLogin from "../pages/AstrologerLogin"
import './Footer.css';

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  const [open, setOpen] = useState(false);

  const phoneNumber = "999999999999"; // change
  const whatsappNumber = "999999999999"; // change


  // inside Footer component:
  const [isContactOpen, setIsContactOpen] = useState(false);


  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };


  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hello, I want to know more about KalpJyotish services");
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  const handleCallClick = () => {
    window.location.href = `tel:${phoneNumber}`;
  };





  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const socialLinks = [
    { icon: <FaFacebookF />, link: '#' },
    { icon: <FaYoutube />, link: '#' },
    { icon: <FaInstagram />, link: '#' },
    { icon: <FaXTwitter />, link: '#' },
  ];

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-column brand-column">
          <Link to="/" className="footer-logo">
            <GiSun />
            <span>KalpJyotish</span>
          </Link>
          <h4 className="footer-heading">Available soon on</h4>
          <div className="app-badges">
            {/* UPDATED: Using direct online URLs for the SVG badges */}
            <a href="#" target="_blank" rel="noopener noreferrer">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Get it on Google Play"
              />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                alt="Download on the App Store"
              />
            </a>
          </div>
          <div className='apka-pandit'>
            <h5>ABOUT KALPJYOTISH</h5>
            <span>-----</span>
            <p>kalpjyotish.com - Your trusted partner in connecting
              with knowledgeable and culturally-rooted pandits. We
              understand the significance of rituals and traditions in your life,
              and our mission is to make these spiritual practices accessible,
              authentic, and hassle-fee.
            </p>
          </div>
          <h4 className="footer-heading">Follow us on</h4>
          <div className="social-icons">
            {socialLinks.map((social, index) => (
              <motion.a key={index} href={social.link} whileHover={{ scale: 1.1, y: -5 }} target="_blank" rel="noopener noreferrer">
                {social.icon}
              </motion.a>
            ))}
          </div>
        </div>

        <div className="footer-column">
          <h3 className="footer-title">Quick Links</h3>
          <ul className="footer-links">
            {quickLinks.map(link => <li key={link.title}><Link to={link.path}>{link.title}</Link></li>)}
          </ul>
        </div>
        <div className="footer-column">
          <h3 className="footer-title">Useful Links</h3>
          <ul className="footer-links">
            {usefulLinks.map(link => (
              <li key={link.title}>
                {link.title === "Contact Us" ? (
                  <button
                    className="contact-link"
                    onClick={() => setIsContactOpen(true)}
                  >
                    {link.title}
                  </button>
                ) : (
                  <Link to={link.path}>{link.title}</Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        <ContactForm
          isOpen={isContactOpen}
          onClose={() => setIsContactOpen(false)}
        />

      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} KalpJyotish. All rights reserved.</p>
        <div className="footer-bottom-sign">
          <a
            href="https://www.digitalinapp.in/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered By @Digital In App
          </a>
        </div>
        <div className="footer-bottom-links">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/faq">FAQs</Link>
          <Link to="/terms">T&C</Link>
        </div>
      </div>

      <AnimatePresence>
        {isVisible && (
          <>

            {/* WhatsApp */}
            <motion.button
              className="floating-btn whatsapp-btn"
              onClick={handleWhatsAppClick}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <FaWhatsapp />
            </motion.button>

            {/* Call */}
            <motion.button
              className="floating-btn call-btn"
              onClick={handleCallClick}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <FaPhone />
            </motion.button>


            <motion.button
              className="back-to-top-btn"
              onClick={scrollToTop}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <FiArrowUp />
            </motion.button>
          </>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;