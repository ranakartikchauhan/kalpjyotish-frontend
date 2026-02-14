// src/components/BlogPostCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FiArrowRight } from 'react-icons/fi';
import './BlogSection.css'; // We'll share the CSS with the parent

const BlogPostCard = ({ post }) => {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
  };

  return (
    <motion.article
      className="blog-card"
      variants={itemVariants}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
    >
      <div className="blog-card-slider">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ type: 'progressbar' }}
          loop={true}
          autoplay={{ delay: 3500 + Math.random() * 2000, disableOnInteraction: true }}
        >
          {post.images.map((image, index) => (
            <SwiperSlide key={index} className="blog-slide" style={{ backgroundImage: `url(${image})` }} />
          ))}
        </Swiper>
        <span className="blog-card-category">{post.category}</span>
      </div>
      <div className="blog-card-content">
        <h3 className="blog-card-title">
          <Link to={post.link}>{post.title}</Link>
        </h3>
        <div className="blog-card-meta">
          <span>By {post.author}</span>
          <span>{post.date}</span>
        </div>
        <p className="blog-card-excerpt">{post.excerpt}</p>
        <Link to={post.link} className="read-more-btn">
          <span>Read More</span>
          <FiArrowRight />
        </Link>
      </div>
    </motion.article>
  );
};

export default BlogPostCard;