import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import "./ContactForm.css";
import { useSendContactQueryMutation } from "../services/backendApi";

const ContactForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    city: "",
    purpose: "General",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");
  const [sendContactQuery] = useSendContactQueryMutation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMsg("");

    try {
      await sendContactQuery({
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        gender: formData.purpose || "Other",
        dob_time: "N/A",
        place_of_birth: formData.city,
        query: formData.message,
      }).unwrap();
      setResponseMsg("Message sent successfully!");
      setFormData({
        name: "",
        email: "",
        mobile: "",
        city: "",
        purpose: "General",
        message: "",
      });
    } catch (error) {
      setResponseMsg(error?.data?.message || "Server not responding, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="modal-content"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="modal-header">
              <h2>Contact Us</h2>
              <button className="close-button" onClick={onClose}>
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
                <input type="tel" name="mobile" placeholder="Mobile Number" value={formData.mobile} onChange={handleChange} required />
                <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
                <textarea name="message" placeholder="Your Message" rows="5" value={formData.message} onChange={handleChange} required />
                <div className="modal-footer">
                  <button type="submit" className="connect-button" disabled={loading}>
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </form>
              {responseMsg && (
                <p style={{ marginTop: "10px", color: responseMsg.includes("success") ? "green" : "red" }}>
                  {responseMsg}
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContactForm;
