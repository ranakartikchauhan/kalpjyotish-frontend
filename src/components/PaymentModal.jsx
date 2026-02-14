import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import './PaymentModal.css';

// --- THIS IS A CRITICAL BACKEND STEP (SIMULATED HERE) ---
// In a real app, you would make an API call to your server.
// Your server would then verify the payment with Razorpay and credit the user's wallet.
const verifyPaymentOnBackend = async (paymentDetails) => {
  console.log("Sending payment details to backend for verification:", paymentDetails);
  // Replace this with: return axios.post('/api/wallet/verify-recharge', paymentDetails);
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("Backend verification successful.");
      resolve({ success: true, newBalance: 500 }); // Example response
    }, 1500);
  });
};

const PaymentModal = ({ isOpen, onClose, astrologer, razorpayKey }) => {
  const [rechargeAmount] = useState(100); // Example fixed recharge amount
  const [status, setStatus] = useState('idle'); // 'idle', 'processing', 'success', 'failed'
  const [error, setError] = useState('');

  const handleClose = () => {
    setStatus('idle');
    setError('');
    onClose();
  };

  const handlePayment = () => {
    setStatus('processing');
    const options = {
      key: razorpayKey,
      amount: rechargeAmount * 100, // Amount in the smallest currency unit (paisa)
      currency: "INR",
      name: "KalpJyotish Wallet",
      description: `Recharge for ${astrologer.name}`,
      image: "https://i.imgur.com/2cvE5eF.png", // Your logo
      handler: async (response) => {
        // This function is called after a successful payment
        try {
          const verificationResult = await verifyPaymentOnBackend({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (verificationResult.success) {
            setStatus('success');
            setTimeout(handleClose, 2000); // Auto-close after 2s on success
          } else {
            setStatus('failed');
            setError('Backend verification failed. Please contact support.');
          }
        } catch (err) {
          setStatus('failed');
          setError('An error occurred during verification.');
        }
      },
      prefill: {
        // TODO: Replace with logged-in user's data
        name: "Test User",
        email: "test.user@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "KalpJyotish Corporate Office",
      },
      theme: {
        color: "#121212",
      },
      modal: {
        ondismiss: () => {
          console.log("Checkout form closed by user.");
          if (status === 'processing') {
            setStatus('idle'); // Reset status if user closes modal without paying
          }
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="payment-backdrop" onClick={handleClose}>
          <motion.div
            className="payment-modal-content"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="payment-close-btn" onClick={handleClose}><IoClose /></button>
            
            {status === 'success' ? (
              <div className="status-view">
                <div className="success-icon">✓</div>
                <h3>Payment Successful!</h3>
                <p>Amount has been added to your wallet.</p>
              </div>
            ) : status === 'failed' ? (
              <div className="status-view">
                <div className="failed-icon">✕</div>
                <h3>Payment Failed</h3>
                <p>{error}</p>
              </div>
            ) : (
              <>
                <div className="modal-header">
                  <h3>Recharge Wallet</h3>
                  <p>to connect with {astrologer.name}</p>
                </div>
                <div className="recharge-details">
                  <div className="amount-display">
                    <span>Amount to Add</span>
                    <strong>₹{rechargeAmount}</strong>
                  </div>
                  <button
                    className="proceed-btn"
                    onClick={handlePayment}
                    disabled={status === 'processing'}
                  >
                    {status === 'processing' ? 'Processing...' : 'Proceed to Pay'}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;