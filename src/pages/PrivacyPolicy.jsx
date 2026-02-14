import { useEffect, useState } from "react";
import "./PrivacyPolicy.css";
import Footer from "../components/Footer";

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;

      // Calculate scroll progress
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setScrollProgress(progress);

      // Show back to top button after 300px
      setShowBackToTop(scrollTop > 300);

      // Track active section
      const sections = document.querySelectorAll('.privacy-content section');
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to section
  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="privacy-wrapper">
        {/* Scroll Progress Bar */}
        <div className="scroll-progress">
          <div
            className="scroll-progress-bar"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* HERO */}
        <div className="privacy-hero">
          <h1>Privacy Policy</h1>
          <p className="updated">Last updated: February 2026</p>
        </div>

        <div className="privacy-container">

          {/* SIDEBAR (desktop) */}
          <aside className="privacy-sidebar">
            <div className="sidebar-title">Quick Navigation</div>
            <nav>
              <a
                href="#intro"
                onClick={(e) => scrollToSection(e, 'intro')}
                className={activeSection === 'intro' ? 'active' : ''}
              >
                <span>Introduction</span>
              </a>
              <a
                href="#info"
                onClick={(e) => scrollToSection(e, 'info')}
                className={activeSection === 'info' ? 'active' : ''}
              >
                <span>Information We Collect</span>
              </a>
              <a
                href="#usage"
                onClick={(e) => scrollToSection(e, 'usage')}
                className={activeSection === 'usage' ? 'active' : ''}
              >
                <span>How We Use Data</span>
              </a>
              <a
                href="#security"
                onClick={(e) => scrollToSection(e, 'security')}
                className={activeSection === 'security' ? 'active' : ''}
              >
                <span>Data Security</span>
              </a>
              <a
                href="#cookies"
                onClick={(e) => scrollToSection(e, 'cookies')}
                className={activeSection === 'cookies' ? 'active' : ''}
              >
                <span>Cookies</span>
              </a>
              <a
                href="#rights"
                onClick={(e) => scrollToSection(e, 'rights')}
                className={activeSection === 'rights' ? 'active' : ''}
              >
                <span>Your Rights</span>
              </a>
              <a
                href="#contact"
                onClick={(e) => scrollToSection(e, 'contact')}
                className={activeSection === 'contact' ? 'active' : ''}
              >
                <span>Contact Us</span>
              </a>
            </nav>
          </aside>

          {/* CONTENT */}
          <main className="privacy-content">

            <section id="intro" className="fade">
              <h2>Introduction</h2>
              <p>
                We respect your privacy and are committed to protecting your
                personal information. This Privacy Policy explains how KalpJyotish
                collects, uses, and safeguards your data.
              </p>
            </section>

            <section id="info" className="fade">
              <h2>Information We Collect</h2>
              <ul>
                <li>Name and contact details</li>
                <li>Date, time and place of birth</li>
                <li>Location data</li>
                <li>Usage analytics</li>
              </ul>
            </section>

            <section id="usage" className="fade">
              <h2>How We Use Your Data</h2>
              <p>
                We use your data to generate horoscope charts, match-making scores,
                improve user experience, and provide personalized astrology
                services.
              </p>
            </section>

            <section id="security" className="fade">
              <h2>Data Security</h2>
              <p>
                We implement industry-standard security measures to protect your
                data from unauthorized access, misuse, or disclosure.
              </p>
            </section>

            <section id="cookies" className="fade">
              <h2>Cookies</h2>
              <p>
                Cookies help us improve website functionality and analyze traffic.
                You may disable cookies from your browser settings.
              </p>
            </section>

            <section id="rights" className="fade">
              <h2>Your Rights</h2>
              <ul>
                <li>Access your data</li>
                <li>Request deletion</li>
                <li>Update information</li>
                <li>Withdraw consent</li>
              </ul>
            </section>

            <section id="contact" className="fade">
              <h2>Contact Us</h2>
              <p>
                If you have any questions regarding this Privacy Policy, please
                contact us at:
                <br />
                <b>support@kalpjyotish.com</b>
              </p>
            </section>

          </main>
        </div>

        {/* Back to Top Button */}
        {/* <div
          className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
          onClick={scrollToTop}
          role="button"
          aria-label="Back to top"
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              scrollToTop();
            }
          }}
        /> */}
      </div>

      <Footer />
    </>
  );
}