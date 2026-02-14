import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from 'react-router-dom';
import "./Profile.css"; 
import { useGetAstrologerByIdQuery } from "../services/backendApi";

// ====================================================================
// --- SIMULATION & CONFIGURATION ---
// ====================================================================

// !! IMPORTANT !!
// Change this to 'true' to simulate a logged-in user and see the Wallet features.
const IS_LOGGED_IN = false; 

const useAuth = () => ({
  isAuthenticated: IS_LOGGED_IN,
  user: IS_LOGGED_IN 
    ? { 
        id: 'user_abc123', 
        name: 'Sample User', 
        walletBalance: 500 
      } 
    : null,
});

// ====================================================================
// --- MODAL COMPONENTS ---
// ====================================================================

const PaymentModal = ({ onClose, astrologer, user }) => {
  const cost = astrologer.charge_per_minute || 25;
  const balance = user.walletBalance;
  const hasSufficientFunds = balance >= cost;
  const remainingBalance = balance - cost;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="modal-content">
      <button onClick={onClose} className="modal-close-btn">✖</button>
      <h2 className="modal-title">Confirm Connection</h2>
      <div className="modal-body">
        <p>You are connecting with <strong>{astrologer.name}</strong>.</p>
        <div className="wallet-details">
          <div>
            <span className="detail-label">Call Cost</span>
            <span className="detail-value cost">₹{cost}</span>
          </div>
          <div>
            <span className="detail-label">Your Wallet Balance</span>
            <span className="detail-value">₹{balance}</span>
          </div>
        </div>
        {hasSufficientFunds ? (
          <div className="balance-info sufficient">
            <p>₹{cost} will be deducted. Your new balance will be <strong>₹{remainingBalance}</strong>.</p>
          </div>
        ) : (
          <div className="balance-info insufficient">
            <p>Your wallet balance is too low. Please add funds to connect.</p>
          </div>
        )}
      </div>
      <div className="modal-actions">
        {hasSufficientFunds ? (
          <button className="profile-connect-btn">Pay from Wallet & Connect</button>
        ) : (
          <button className="profile-connect-btn">Add Money to Wallet</button>
        )}
      </div>
    </motion.div>
  );
};

// --- THIS IS THE FIX ---
// The placeholder comment has been replaced with the full component definition.
const SignupModal = ({ onClose }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="modal-content"
  >
    <button onClick={onClose} className="modal-close-btn">✖</button>
    <h2 className="modal-title">Login Required</h2>
    <div className="modal-body">
      <p>Please log in or create an account to connect with an astrologer.</p>
    </div>
    <div className="modal-actions">
      {/* In a real app, these should be NavLink components from react-router-dom */}
      <a href="#" className="profile-connect-btn">Login</a>
      <a href="#" className="profile-connect-btn">Sign Up</a>
    </div>
  </motion.div>
);


// ====================================================================
// --- MAIN PROFILE COMPONENT ---
// ====================================================================

const Profile = () => {
  const { userId } = useParams();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  
  const { isAuthenticated, user } = useAuth();
  const {
    data: profileData,
    isLoading: loading,
    isError,
  } = useGetAstrologerByIdQuery(userId, { skip: !userId });

  const handleConnectClick = () => {
    if (isAuthenticated) {
      setIsPaymentModalOpen(true);
    } else {
      setIsSignupModalOpen(true);
    }
  };
  
  if (loading) {
    return <div className="profile-container"><div className="profile-message">Loading Profile...</div></div>;
  }
  
  if (!userId || isError || !profileData) {
    return <div className="profile-container"><div className="profile-message">Could not load profile.</div></div>;
  }
  
  const isLive = profileData.status === 'live';

  return (
    <>
      <div className="profile-container">
        <div className="profile-card">
          <header className="profile-header">
            <img 
              src={profileData.user_profile || profileData.profilePhoto || "https://i.imgur.com/G4G987O.png"}
              alt={profileData.name}
              className="profile-image" 
            />
            <h1 className="profile-name">{profileData.name}</h1>
            <div className={`profile-status ${isLive ? 'live' : ''}`}>
              {isLive ? '● Live' : 'Offline'}
            </div>
            <p className="profile-skills">
              {profileData.all_skills?.join(" • ") || "Expert Astrologer"}
            </p>
          </header>
          
          <section className="profile-details">
            <div className="detail-item">
              <strong>Experience</strong>
              <span>{profileData.experience || '5 Years'}</span>
            </div>
            <div className="detail-item">
              <strong>Languages</strong>
              <span>{profileData.language?.join(', ') || 'English, Hindi'}</span>
            </div>
          </section>

          {isAuthenticated && (
            <div className="wallet-display">
              <span>Your Wallet Balance: <strong>₹{user.walletBalance}</strong></span>
            </div>
          )}

          <button 
            className="profile-connect-btn" 
            onClick={handleConnectClick}
            disabled={!isLive}
          >
            {isLive ? `Connect Now (₹${profileData.charge_per_minute}/min)` : 'Currently Offline'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isPaymentModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-overlay">
            <PaymentModal 
              onClose={() => setIsPaymentModalOpen(false)} 
              astrologer={profileData}
              user={user} 
            />
          </motion.div>
        )}
        {isSignupModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-overlay">
            <SignupModal onClose={() => setIsSignupModalOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Profile;
