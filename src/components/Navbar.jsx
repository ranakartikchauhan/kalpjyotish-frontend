import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Icons
import { GiSun } from "react-icons/gi";
import { FaHome, FaShoppingCart } from "react-icons/fa";
import { BsStars, BsChatDots } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import AuthModal from "./AuthModal";
import "./Navbar.css";
import logo from '../assets/logo.jpeg';

const Path = (props) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke="hsl(0, 0%, 100%)"
    strokeLinecap="round"
    {...props}
  />
);

const Navbar = ({ onSignupClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setAuthModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  const toggleMobileMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMobileMenu = () => setIsMenuOpen(false);
  const openAuthModal = () => setAuthModal(true);
  const closeAuthModal = () => setAuthModal(false);

  // Check login status on component mount
  useEffect(() => {
    const checkLoginStatus = () => {
      const storedUser = localStorage.getItem('user');
      const storedLoginStatus = localStorage.getItem('isLoggedIn');

      if (storedUser && storedLoginStatus === 'true') {
        setUser(JSON.parse(storedUser));
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();

    // Listen for storage changes
    const interval = setInterval(checkLoginStatus, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
  }, [isMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle login/profile button click
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('authRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('backendUserId');
    setUser(null);
    setIsLoggedIn(false);
    setShowUserMenu(false);
    navigate('/');
  };

  const handleProfileNavigate = () => {
    const role = localStorage.getItem("authRole");
    setShowUserMenu(false);
    if (role === "astrologer") {
      navigate("/astrologer-dashboard");
      return;
    }
    navigate("/user-profile");
  };

  const handleAuthClick = () => {
    if (!isLoggedIn) {
      openAuthModal();
      return;
    }
    setShowUserMenu((prev) => !prev);
  };

  const navItems = [
    { to: "/", icon: <FaHome />, text: "Home" },
    { to: "/horoscope", icon: <BsStars />, text: "Horoscope" },
    { to: "/pooja", icon: <BsStars />, text: "Pooja" },
    { to: "/astro-connect", icon: <BsChatDots />, text: "Connect with Astrologer" },
    { to: "/contact-us", icon: <BsChatDots />, text: "Contact Now" },
    { to: "/shop", icon: <FaShoppingCart />, text: "Shop" },
  ];

  const sideMenuVariants = {
    closed: { x: "100%" },
    open: { x: "0%", transition: { type: "spring", stiffness: 120 } },
  };

  const listItemVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 },
  };

  return (
    <>
      <motion.nav
        className="navbar"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Logo */}
        <div className="navbar-logo">
          <NavLink to="/" onClick={isMenuOpen ? closeMobileMenu : undefined}>
            <img src={logo} alt="logo" />
          </NavLink>
        </div>

        {/* Desktop Navigation */}
        <ul className="navbar-links desktop-links">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to}>
                <span>{item.text}</span>
              </NavLink>
            </li>
          ))}

          {/* ✅ Show only in Desktop */}
          <li className="promo-desktop">
            {isLoggedIn ? (
              <div className="user-menu" ref={userMenuRef}>
                <button
                  className="promo-button"
                  onClick={handleAuthClick}
                  title="Account"
                >
                  {user?.name || "Account"}
                </button>
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.ul
                      className="user-dropdown"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                    >
                      <li>
                        <button className="dropdown-btn" onClick={handleProfileNavigate}>Profile</button>
                      </li>
                      <li>
                        <button className="dropdown-btn" onClick={handleLogout}>Logout</button>
                      </li>
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                className="promo-button"
                onClick={handleAuthClick}
                title="Login"
              >
                Login
              </button>
            )}
          </li>
        </ul>

        {/* ✅ Mobile: show promo icon before hamburger */}
        <div className="mobile-icons">
          <div className="user-menu" ref={userMenuRef}>
            <button
              className="promo-button promo-mobile"
              onClick={handleAuthClick}
              title={isLoggedIn ? "Account" : "Login"}
            >
              <FaUserCircle size={26} />
            </button>
            <AnimatePresence>
              {isLoggedIn && showUserMenu && (
                <motion.ul
                  className="user-dropdown"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <li>
                    <button className="dropdown-btn" onClick={handleProfileNavigate}>Profile</button>
                  </li>
                  <li>
                    <button className="dropdown-btn" onClick={handleLogout}>Logout</button>
                  </li>
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          <button className="hamburger-button" onClick={toggleMobileMenu}>
            <svg width="23" height="23" viewBox="0 0 23 23">
              <Path
                variants={{
                  closed: { d: "M 2 2.5 L 20 2.5" },
                  open: { d: "M 3 16.5 L 17 2.5" },
                }}
                animate={isMenuOpen ? "open" : "closed"}
              />
              <Path
                d="M 2 9.423 L 20 9.423"
                variants={{ closed: { opacity: 1 }, open: { opacity: 0 } }}
                transition={{ duration: 0.1 }}
                animate={isMenuOpen ? "open" : "closed"}
              />
              <Path
                variants={{
                  closed: { d: "M 2 16.346 L 20 16.346" },
                  open: { d: "M 3 2.5 L 17 16.346" },
                }}
                animate={isMenuOpen ? "open" : "closed"}
              />
            </svg>
          </button>
        </div>
      </motion.nav>

      {/* --- MOBILE MENU --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              className="backdrop"
              onClick={closeMobileMenu}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.aside
              className="mobile-menu"
              variants={sideMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="mobile-menu-header">
                <h3>Menu</h3>
                <button onClick={closeMobileMenu}>
                  <IoClose size={28} />
                </button>
              </div>
              <ul>
                {navItems.map((item) => (
                  <motion.li key={item.to} variants={listItemVariants}>
                    <NavLink to={item.to} onClick={closeMobileMenu}>
                      {item.icon}
                      <span>{item.text}</span>
                    </NavLink>
                  </motion.li>
                ))}
                <motion.li variants={listItemVariants}>
                  {/* <button
                    onClick={() => {
                      closeMobileMenu();
                      openPromoModal();
                    }}
                  > */}
                  {/* <IoChatbubblesOutline /> */}
                  {/* <span>Promotions</span> */}
                  {/* </button> */}
                </motion.li>
              </ul>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAuthModal && (
          <AuthModal
            onClose={closeAuthModal}
            isLoggedIn={isLoggedIn}
            user={user}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;


