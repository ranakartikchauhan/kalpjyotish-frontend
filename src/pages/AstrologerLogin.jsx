import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import "./AstrologerLogin.css";
import AstrologerRegister from '../components/AstrologerRegister';
import { useAstrologerLoginMutation } from "../services/backendApi";


export default function AstrologerLogin() {
    const [showRegister, setShowRegister] = useState(false);

    const [formData, setFormData] = useState({
        loginId: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [astrologerLogin, { isLoading: loading }] = useAstrologerLoginMutation();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const openRegisterForm = () => {
        setShowRegister(true);
    };

    const closeRegisterForm = () => {
        setShowRegister(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const data = await astrologerLogin({
                email: formData.loginId.includes("@") ? formData.loginId : undefined,
                eid: formData.loginId.startsWith("KALP") ? formData.loginId : undefined,
                number: /^\d+$/.test(formData.loginId) ? formData.loginId : undefined,
                password: formData.password,
            }).unwrap();

            if (data?.success) {
                if (data?.token) {
                    localStorage.setItem("token", data.token);
                }
                localStorage.setItem("user", JSON.stringify(data.data));
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("authRole", "astrologer");
                navigate("/astrologer-dashboard");
            } else {
                setError(data.message || "Login failed");
            }
        } catch (err) {
            setError(err?.data?.message || "Network error. Please try again.");
        }
    };

    return (
        <div className="astrologer-login-page">
            <div className="astrologer-login-container">
                <button className="back-btn" onClick={() => navigate("/")}>
                    <IoArrowBack /> Back to Home
                </button>

                <div className="login-box">
                    <h2>Astrologer Login</h2>
                    <p className="subtitle">Access your astrologer dashboard</p>

                    {error && <p className="error-text">{error}</p>}

                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="loginId"
                            placeholder="Email / EID / Phone"
                            value={formData.loginId}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                        <button type="submit" disabled={loading} className="submit-btn">
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    <div className="register-section">
                        <p>Don't have an account?</p>
                        <button className="apply-now-btn" onClick={openRegisterForm}>
                            Apply Now
                        </button>
                    </div>
                </div>
            </div>
            {showRegister && (
                <AstrologerRegister
                    onClose={closeRegisterForm}
                    onBackToLogin={closeRegisterForm}
                />
            )}
        </div>
    );
}
