// src/components/BlogSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { blogPostsData } from '../data/blogData';
import BlogPostCard from './BlogPostCard'; // Assuming BlogPostCard is in its own file
import './BlogSection.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

const BlogSection = () => {
  return (
    <section className="blog-section">
      <div className="container">
        <h2 className="blog-section-title">From Our Cosmic Journal</h2>
        <motion.div
          className="blog-grid" // This class will be re-styled for mobile
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {blogPostsData.map(post => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection;