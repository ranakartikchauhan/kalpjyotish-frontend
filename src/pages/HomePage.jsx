// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// Import your OPTIMIZED images
// For true mobile optimization, consider using tools like Squoosh (squoosh.app)
// to compress these images and save them in a web-friendly format like WebP.
import heroImage1 from '../assets/hero-1.png';
import heroImage2 from '../assets/new.png';
import heroImage3 from '../assets/hero-3.png';

import './HomePage.css';
import { FiArrowRight } from 'react-icons/fi';
import ServicesSection from '../components/ServicesSection';
import DailyInsights from '../components/DailyInsights';
import ConsultationTopics from '../components/ConsultationTopics';
import NakshatrasSection from '../components/NakshatrasSection';
import Testimonials from '../components/Testimonials';
import BlogSection from '../components/BlogSection';
import Footer from '../components/Footer';

const slideContent = [
  {
    image: heroImage1,
    // title: "Chart Your Destiny",
    // subtitle: "Personalized birth charts and detailed astrological reports.",
    // link: "/zodiac-signs"
  },
  {
    image: heroImage2,
    // title: "Consult with Experts",
    // subtitle: "Connect with renowned astrologers for one-on-one sessions.",
    // link: "/talk"
  },
  {
    image: heroImage3,
    // title: "Ancient Wisdom, Modern Insights",
    // subtitle: "Explore Vedic astrology to illuminate your life's path.",
    // link: "/horoscope"
  }
];

const HomePage = () => {
  return (
    // We use a React Fragment <>...</> to group elements without adding an extra node to the DOM.
    <>
      {/* 
        STRUCTURAL CHANGE: The hero section is now self-contained.
        This fixes the issue where content below was not visible. The hero section
        now occupies its defined space, and the rest of the content flows naturally after it.
      */}
      <section className="hero-section">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          spaceBetween={50}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          effect="fade"
          speed={1200}
          className="hero-swiper"
        >
          {slideContent.map((slide, index) => (
            <SwiperSlide key={index} className="hero-slide">
              <div
                className="slide-background"
                style={{ backgroundImage: `url(${slide.image})` }}
              ></div>
              <div className="slide-overlay"></div>
              <motion.div
                // className="slide-content"
                // initial={{ opacity: 0, y: 50 }}
                // whileInView={{ opacity: 1, y: 0 }}
                // transition={{ duration: 1, delay: 0.5 }}
                // viewport={{ once: true }}
              >
                {/* Conditionally render title/subtitle only if they exist */}
                {/* {slide.title && <h1 className="slide-title">{slide.title}</h1>}
                {slide.subtitle && <p className="slide-subtitle">{slide.subtitle}</p>} */}
                {/* <Link to={slide.link} className="cta-button"> */}
                  {/* <span>Explore Now</span> */}
                  {/* <FiArrowRight /> */}
                {/* </Link> */}
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* The rest of your page content now renders correctly below the hero section */}
      <ServicesSection />
      <DailyInsights />
      {/* <ConsultationTopics /> */}
      <NakshatrasSection />
      <Testimonials />
      <BlogSection />
      <Footer />
    </>
  );
};

export default HomePage;