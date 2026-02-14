import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { consultationTopicsData } from '../data/consultationData';
import './ConsultationTopics.css'; 

const ConsultationTopics = () => {
  return (
    <section className="consultation-section">
      <motion.div
        className="consultation-container"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="consultation-main-title">Consult The Right Astrologer For You</h2>
        
        <div className="consultation-grid">
          {consultationTopicsData.map((item, index) => (
            <Link to={item.link} className="consultation-item" key={index}>
              {/* This wrapper is essential for the glowing circle effect */}
              <div className="consultation-icon-wrapper">
                <div className="consultation-icon">{item.icon}</div>
              </div>
              <span className="consultation-title">{item.title}</span>
            </Link>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default ConsultationTopics;