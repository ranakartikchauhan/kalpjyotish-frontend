import React, { useState, useRef, useEffect, useMemo, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoginUserMutation, useSendOtpMutation, useSignupUserMutation, useVerifyOtpMutation } from '../services/backendApi';

// --- LIBRARY IMPORTS ---
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

// --- ICONS ---
import { IoClose } from 'react-icons/io5';
import {
  MdEmail, MdLock, MdPerson, MdCalendarToday, MdAccessTime,
  MdLocationCity, MdPhone, MdArrowForward, MdExpandMore, MdUploadFile
} from 'react-icons/md';
import { FaVenusMars } from "react-icons/fa";

// --- CSS IMPORT ---
import './SignupModal.css';

// ====================================================================
// --- INTERNAL HELPER & STEP COMPONENTS ---
// ====================================================================

// --- CustomSelect Component ---
const CustomSelect = ({ icon, placeholder, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => { if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false); };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const handleSelect = (optionValue) => { onChange(optionValue); setIsOpen(false); };
  return (
    <div className="custom-select-container" ref={dropdownRef}>
      <button type="button" className={`custom-select-trigger ${value ? 'has-value' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        {icon} <span>{value || placeholder}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}><MdExpandMore className="expand-icon" /></motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.ul className="custom-select-options" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <li className="placeholder-option" onClick={() => handleSelect('')}>{placeholder}</li>
            {options.map((option) => ( <li key={option} className={`option-item ${option === value ? 'selected' : ''}`} onClick={() => handleSelect(option)}>{option}</li> ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Custom Time Picker ---
const CustomTimePicker = ({ icon, placeholder, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const listRef = useRef(null);
  const timeOptions = useMemo(() => {
    const times = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 15) {
        const hour12 = h % 12 === 0 ? 12 : h % 12;
        const minute = m.toString().padStart(2, '0');
        const ampm = h < 12 ? 'AM' : 'PM';
        times.push(`${hour12}:${minute} ${ampm}`);
      }
    }
    return times;
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => { if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false); };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  useEffect(() => {
    if (isOpen && value && listRef.current) {
      const selectedElement = listRef.current.querySelector('.selected');
      if (selectedElement) { selectedElement.scrollIntoView({ block: 'center' }); }
    }
  }, [isOpen, value]);
  const handleSelect = (timeValue) => { onChange(timeValue); setIsOpen(false); };
  return (
    <div className="custom-select-container" ref={dropdownRef}>
      <button type="button" className={`custom-select-trigger ${value ? 'has-value' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        {icon} <span>{value || placeholder}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}><MdExpandMore className="expand-icon" /></motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div className="custom-time-picker-options" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="custom-time-picker-header">Time</div>
            <ul ref={listRef} className="custom-time-picker-list">
              {timeOptions.map((time) => (
                <li key={time} className={`option-item ${time === value ? 'selected' : ''}`} onClick={() => handleSelect(time)}>{time}</li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Custom Input for DatePicker ---
const DatePickerCustomInput = forwardRef(({ value, onClick, icon, placeholder }, ref) => (
  <div className={`form-group custom-datepicker-input ${value ? 'has-value' : ''}`} onClick={onClick} ref={ref}>
    {icon}
    <input type="text" value={value} readOnly placeholder={placeholder} />
  </div>
));

// --- AuthStepOne Component (wrapper removed) ---
const AuthStepOne = ({ authMode, setAuthMode, email, setEmail, password, setPassword, handleSendOtp, handleLogin, isLoading, error }) => ( <AnimatePresence mode="wait">{authMode === 'signup' ? ( <motion.div key="signup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><h2>Create Your Account</h2><p>First, let's verify your email address.</p><form onSubmit={handleSendOtp}><div className="form-group"><MdEmail className="input-icon" /><input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>{error && <p className="error-msg">{error}</p>}<button type="submit" className="modal-btn" disabled={isLoading}>{isLoading ? 'Sending...' : 'Send OTP'}</button></form><p className="auth-toggle">Already have an account? <span onClick={() => setAuthMode('login')}>Login</span></p></motion.div> ) : ( <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><h2>Welcome Back!</h2><p>Please enter your details to login.</p><form onSubmit={handleLogin}><div className="form-group"><MdEmail className="input-icon" /><input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div><div className="form-group"><MdLock className="input-icon" /><input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>{error && <p className="error-msg">{error}</p>}<button type="submit" className="modal-btn" disabled={isLoading}>{isLoading ? 'Logging In...' : 'Login'}</button></form><p className="auth-toggle">Don't have an account? <span onClick={() => setAuthMode('signup')}>Sign Up</span></p></motion.div> )}</AnimatePresence> );

// --- AuthStepTwo Component (wrapper removed) ---
const AuthStepTwo = ({ email, otp, setOtp, handleVerifyOtp, changeStep, isLoading, error }) => ( <><h2>Enter OTP</h2><p>A 6-digit code was sent to <strong>{email}</strong></p><form onSubmit={handleVerifyOtp}><div className="form-group"><MdLock className="input-icon" /><input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required maxLength="6" /></div>{error && <p className="error-msg">{error}</p>}<button type="submit" className="modal-btn" disabled={isLoading}>{isLoading ? 'Verifying...' : 'Verify & Proceed'}</button></form><a className="back-link" onClick={() => changeStep(1, -1)}>Go Back</a></> );

// --- AuthStepThree Component (wrapper removed) ---
const AuthStepThree = ({ email, formData, setFormData, handleInputChange, handleSelectChange, handleFileChange, profilePreview, handleSignup, isLoading, error }) => (
  <>
    <h2>Complete Your Profile</h2>
    <form onSubmit={handleSignup} className="details-form">
      <div className="form-group"><MdPerson className="input-icon" /><input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange} required /></div>
      <div className="form-group"><MdEmail className="input-icon" /><input type="email" name="email" value={email} disabled /></div>
      <div className="form-group"><MdPhone className="input-icon" /><input type="tel" name="mobileNo" placeholder="Mobile Number" value={formData.mobileNo} onChange={handleInputChange} required /></div>
      <div className="form-group"><MdLock className="input-icon" /><input type="password" name="password" placeholder="Create Password" value={formData.password} onChange={handleInputChange} required minLength={6} /></div>
      <div className="form-group"><MdLocationCity className="input-icon" /><input type="text" name="city" placeholder="City" value={formData.city} onChange={handleInputChange} required /></div>
      <div className="form-group"><CustomSelect icon={<FaVenusMars className="input-icon" />} placeholder="Select Gender" options={['Male', 'Female', 'Other']} value={formData.gender} onChange={(value) => handleSelectChange('gender', value)} /></div>
      <div className="form-group"><DatePicker selected={formData.dateOfBirth} onChange={(date) => setFormData({ ...formData, dateOfBirth: date })} customInput={<DatePickerCustomInput icon={<MdCalendarToday className="input-icon" />} placeholder="Date of Birth" />} dateFormat="dd / MMMM / yyyy" maxDate={new Date()} showYearDropdown scrollableYearDropdown yearDropdownItemNumber={80} required /></div>
      <div className="form-group"><CustomTimePicker icon={<MdAccessTime className="input-icon" />} placeholder="Time of Birth" value={formData.timeOfBirth} onChange={(value) => handleSelectChange('timeOfBirth', value)} /></div>
      <div className="form-group file-group">
        <div className="upload-box-label"><MdUploadFile /> Upload Profile Picture</div>
        <div className="file-input-wrapper">
          <input id="profile-upload" type="file" name="profile" accept="image/*" onChange={handleFileChange} />
          <label htmlFor="profile-upload" className="file-choose-btn">Choose File</label>
          <span className="file-name-display">{formData.profile?.name || "No file chosen"}</span>
        </div>
        {profilePreview && <img src={profilePreview} alt="Preview" className="profile-preview" />}
      </div>
      {error && <p className="error-msg">{error}</p>}
      <div className="form-group">
        <button type="submit" className="modal-btn" disabled={isLoading}>
          <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>{!isLoading && <MdArrowForward />}
        </button>
      </div>
    </form>
  </>
);

// --- AuthStepFour Component (wrapper removed) ---
const AuthStepFour = ({ authMode }) => ( <div className="success-message"><h2>Success!</h2><p>{authMode === 'login' ? 'You are now logged in.' : 'Your account has been created.'}</p></div> );


// ====================================================================
// --- MAIN MODAL COMPONENT ---
// ====================================================================

const SignupModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [authMode, setAuthMode] = useState('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [formData, setFormData] = useState({ name: '', gender: '', city: '', mobileNo: '', password: '', profile: null, dateOfBirth: null, timeOfBirth: '' });
  const [profilePreview, setProfilePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [sendOtpMutation] = useSendOtpMutation();
  const [verifyOtpMutation] = useVerifyOtpMutation();
  const [loginUserMutation] = useLoginUserMutation();
  const [signupUserMutation] = useSignupUserMutation();

  // Handlers & API calls
  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSelectChange = (name, value) => setFormData({ ...formData, [name]: value });
  const handleFileChange = (e) => { const file = e.target.files[0]; if (file) { setFormData({ ...formData, profile: file }); setProfilePreview(URL.createObjectURL(file)); } };
  const resetState = () => { setStep(1); setAuthMode('signup'); setEmail(''); setPassword(''); setOtp(''); setFormData({ name: '', gender: '', city: '', mobileNo: '', password: '', profile: null, dateOfBirth: null, timeOfBirth: '' }); setProfilePreview(null); setError(''); setIsLoading(false); onClose(); };
  const changeStep = (newStep, newDirection = 1) => { setDirection(newDirection); setStep(newStep); };
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await sendOtpMutation({ email }).unwrap();
      changeStep(2);
    } catch (err) {
      setError(err?.data?.message || 'Failed to send OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await verifyOtpMutation({ email, otp }).unwrap();
      changeStep(3);
    } catch (err) {
      setError(err?.data?.message || 'Invalid OTP.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await loginUserMutation({ email, password }).unwrap();
      const token = res?.token;
      if (token) {
        localStorage.setItem('authToken', token);
      }
      if (res?.data) {
        localStorage.setItem('user', JSON.stringify(res.data));
      }
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('authRole', 'user');
      changeStep(4);
      setTimeout(resetState, 2000);
    } catch (err) {
      setError(err?.data?.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const submissionData = new FormData();
    const formattedData = {
      ...formData,
      dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth.toISOString().split('T')[0] : '',
    };
    submissionData.append('email', email);
    for (const key in formattedData) {
      if (key !== 'profile') submissionData.append(key, formattedData[key]);
    }
    if (formData.profile) submissionData.append('profile', formData.profile);

    try {
      const res = await signupUserMutation(submissionData).unwrap();
      const token = res?.token;
      if (token) {
        const expiryTime = new Date().getTime() + 2 * 60 * 60 * 1000;
        localStorage.setItem('authToken', token);
        localStorage.setItem('tokenExpiry', expiryTime);
      }
      if (res?.data) {
        localStorage.setItem('user', JSON.stringify(res.data));
      }
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('authRole', 'user');
      changeStep(4);
      setTimeout(resetState, 2000);
    } catch (err) {
      setError(err?.data?.message || 'Signup failed.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Dynamic Render Logic
  const renderStep = () => { switch (step) { case 1: return <AuthStepOne {...{ authMode, setAuthMode, email, setEmail, password, setPassword, handleSendOtp, handleLogin, isLoading, error }} />; case 2: return <AuthStepTwo {...{ email, otp, setOtp, handleVerifyOtp, changeStep, isLoading, error }} />; case 3: return <AuthStepThree {...{ email, formData, setFormData, handleInputChange, handleSelectChange, handleFileChange, profilePreview, handleSignup, isLoading, error }} />; case 4: return <AuthStepFour {...{ authMode }} />; default: return null; } };
  
  // Animation & Final JSX
  const modalVariants = { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { type: "spring", damping: 25, stiffness: 180 } }, exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }, };
  const stepVariants = { enter: (direction) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }), center: { x: 0, opacity: 1, transition: { type: "tween", ease: "circOut", duration: 0.5 } }, exit: (direction) => ({ x: direction < 0 ? 300 : -300, opacity: 0, transition: { type: "tween", ease: "circIn", duration: 0.3 } }), };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="modal-backdrop" onClick={resetState}>
          <motion.div className="modal-content" variants={modalVariants} initial="hidden" animate="visible" exit="exit" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={resetState}><IoClose /></button>
            {/* --- NEW: Persistent Scroll Container --- */}
            <div className="modal-body">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div key={step} custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit">
                  {renderStep()}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SignupModal;
