import React, { useState } from 'react';
import './AstrologerRegister.css';
import { useAstrologerSignupMutation } from '../services/backendApi';

const AstrologerRegister = ({ onClose, onBackToLogin }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        experience: '',
        specialization: '',
        qualification: '',
        languages: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        aadharNumber: '',
        panNumber: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState('');
    const [astrologerSignup, { isLoading }] = useAstrologerSignupMutation();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = 'Phone number must be 10 digits';
        }
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        if (!formData.experience) newErrors.experience = 'Experience is required';
        if (!formData.specialization.trim()) newErrors.specialization = 'Specialization is required';
        if (!formData.qualification.trim()) newErrors.qualification = 'Qualification is required';
        if (!formData.languages.trim()) newErrors.languages = 'Languages are required';
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');
        setSubmitSuccess('');

        if (validateForm()) {
            try {
                const payload = {
                    name: formData.fullName,
                    email: formData.email,
                    number: formData.phone,
                    gender: formData.gender,
                    experience: formData.experience,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    skills: formData.specialization,
                    practice: formData.qualification,
                    languages: formData.languages,
                    password: formData.password,
                    available_at: {
                        chat: true,
                        call: true,
                        videoCall: true,
                    },
                };

                const res = await astrologerSignup(payload).unwrap();
                setSubmitSuccess(res?.message || 'Registration submitted successfully');
                setTimeout(() => onClose(), 1500);
            } catch (err) {
                setSubmitError(err?.data?.message || 'Registration failed');
            }
        }
    };

    return (
        <div className="register-overlay">
            <div className="register-modal">
                <div className="register-header">
                    <h2>Astrologer Registration</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <form className="register-form" onSubmit={handleSubmit}>
                    {/* Personal Information */}
                    <div className="form-section">
                        <h3>Personal Information</h3>

                        <div className="form-group">
                            <label>Full Name *</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                            />
                            {errors.fullName && <span className="error">{errors.fullName}</span>}
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                />
                                {errors.email && <span className="error">{errors.email}</span>}
                            </div>

                            <div className="form-group">
                                <label>Phone Number *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="10-digit mobile number"
                                    maxLength="10"
                                />
                                {errors.phone && <span className="error">{errors.phone}</span>}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Date of Birth *</label>
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                />
                                {errors.dateOfBirth && <span className="error">{errors.dateOfBirth}</span>}
                            </div>

                            <div className="form-group">
                                <label>Gender *</label>
                                <select name="gender" value={formData.gender} onChange={handleChange}>
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                                {errors.gender && <span className="error">{errors.gender}</span>}
                            </div>
                        </div>
                    </div>

                    {/* Professional Information */}
                    <div className="form-section">
                        <h3>Professional Information</h3>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Years of Experience *</label>
                                <select name="experience" value={formData.experience} onChange={handleChange}>
                                    <option value="">Select Experience</option>
                                    <option value="0-2">0-2 years</option>
                                    <option value="2-5">2-5 years</option>
                                    <option value="5-10">5-10 years</option>
                                    <option value="10+">10+ years</option>
                                </select>
                                {errors.experience && <span className="error">{errors.experience}</span>}
                            </div>

                            <div className="form-group">
                                <label>Specialization *</label>
                                <input
                                    type="text"
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleChange}
                                    placeholder="e.g., Vedic Astrology, Tarot"
                                />
                                {errors.specialization && <span className="error">{errors.specialization}</span>}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Qualification *</label>
                            <input
                                type="text"
                                name="qualification"
                                value={formData.qualification}
                                onChange={handleChange}
                                placeholder="Enter your qualifications"
                            />
                            {errors.qualification && <span className="error">{errors.qualification}</span>}
                        </div>

                        <div className="form-group">
                            <label>Languages Known *</label>
                            <input
                                type="text"
                                name="languages"
                                value={formData.languages}
                                onChange={handleChange}
                                placeholder="e.g., Hindi, English, Sanskrit"
                            />
                            {errors.languages && <span className="error">{errors.languages}</span>}
                        </div>
                    </div>

                    {/* Address Information */}
                    <div className="form-section">
                        <h3>Address Information</h3>

                        <div className="form-group">
                            <label>Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter your address"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="City"
                                />
                            </div>

                            <div className="form-group">
                                <label>State</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    placeholder="State"
                                />
                            </div>

                            <div className="form-group">
                                <label>Pincode</label>
                                <input
                                    type="text"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    placeholder="Pincode"
                                    maxLength="6"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Documents */}
                    <div className="form-section">
                        <h3>Documents (Optional)</h3>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Aadhar Number</label>
                                <input
                                    type="text"
                                    name="aadharNumber"
                                    value={formData.aadharNumber}
                                    onChange={handleChange}
                                    placeholder="12-digit Aadhar number"
                                    maxLength="12"
                                />
                            </div>

                            <div className="form-group">
                                <label>PAN Number</label>
                                <input
                                    type="text"
                                    name="panNumber"
                                    value={formData.panNumber}
                                    onChange={handleChange}
                                    placeholder="PAN number"
                                    maxLength="10"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Password */}
                    <div className="form-section">
                        <h3>Create Password</h3>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Password *</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create password (min 6 characters)"
                                />
                                {errors.password && <span className="error">{errors.password}</span>}
                            </div>

                            <div className="form-group">
                                <label>Confirm Password *</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Re-enter password"
                                />
                                {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="submit-btn" disabled={isLoading}>
                            {isLoading ? 'Submitting...' : 'Submit Application'}
                        </button>
                    </div>
                    {submitError ? <p className="error">{submitError}</p> : null}
                    {submitSuccess ? <p style={{ color: 'green', marginTop: '8px' }}>{submitSuccess}</p> : null}
                </form>
            </div>
        </div>
    );
};

export default AstrologerRegister;
