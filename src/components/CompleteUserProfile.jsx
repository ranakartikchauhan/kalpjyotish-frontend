import { useState } from "react";
import "./CompleteUserProfile.css";

const CompleteUserProfile = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        gender: "",
        dob: "",
        tob: "",
        birthPlace: "",
        address: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Profile Data:", formData);
        // later → send this data to backend API
    };

    return (
        <div className="profile-form-wrapper">
            <form className="profile-form" onSubmit={handleSubmit}>
                <h2>Complete Your Profile</h2>

                <div className="form-group-container">
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Enter full name"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-group-container">
                    <div className="form-group">
                        <label>Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Enter phone number"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Gender</label>
                        <select name="gender" value={formData.gender} onChange={handleChange} required>
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Date of Birth</label>
                        <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Time of Birth</label>
                        <input
                            type="time"
                            name="tob"
                            value={formData.tob}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Birth Place</label>
                    <input
                        type="text"
                        name="birthPlace"
                        placeholder="City / Place of birth"
                        value={formData.birthPlace}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Address</label>
                    <textarea
                        name="address"
                        rows="3"
                        placeholder="Enter full address"
                        value={formData.address}
                        onChange={handleChange}
                    ></textarea>
                </div>

                <div className="button-container">
                    <button type="submit" className=" submit-btn">
                        Save Profile
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CompleteUserProfile;
