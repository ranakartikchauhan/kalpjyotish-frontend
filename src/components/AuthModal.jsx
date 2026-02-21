import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { RecaptchaVerifier, signInWithPhoneNumber, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import authImage from "../assets/authImage.jpg";
import "./AuthModal.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
const normalizeMobile = (value) => String(value || "").replace(/\D/g, "").slice(-10);

const parseAuthPayload = (payload) => {
  const root = payload?.data && typeof payload.data === "object" ? payload.data : payload;
  const user =
    (root?.user && typeof root.user === "object" && root.user) ||
    (payload?.user && typeof payload.user === "object" && payload.user) ||
    (root?._id ? root : null);
  const token = root?.token || payload?.token || payload?.authToken || null;
  return { user, token };
};

export default function AuthModal({ onClose, isLoggedIn, user }) {
  const navigate = useNavigate();
  const recaptchaVerifierRef = useRef(null);
  const confirmationResultRef = useRef(null);

  const [step, setStep] = useState("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [verifiedMobile, setVerifiedMobile] = useState("");
  const [firebaseToken, setFirebaseToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoggedIn && user) {
      onClose();
      navigate("/user-profile");
    }
  }, [isLoggedIn, user, onClose, navigate]);

  useEffect(() => {
    return () => {
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch {
          // ignore
        }
        recaptchaVerifierRef.current = null;
      }
      confirmationResultRef.current = null;
    };
  }, []);

  const postJson = async (path, payload) => {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data?.message || "Request failed");
    }
    return data;
  };

  const saveSession = ({ backendUser, backendToken, fallbackUser }) => {
    const sessionUser = {
      _id: backendUser?._id || fallbackUser?._id || fallbackUser?.uid || null,
      id: backendUser?._id || fallbackUser?.id || fallbackUser?.uid || null,
      name: backendUser?.name || fallbackUser?.name || "User",
      email: backendUser?.email || fallbackUser?.email || "",
      mobileNo: backendUser?.mobileNo || fallbackUser?.mobileNo || "",
      profileImage: backendUser?.profile || fallbackUser?.photoURL || "",
    };

    localStorage.setItem("user", JSON.stringify(sessionUser));
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("authRole", "user");

    if (backendUser?._id) {
      localStorage.setItem("userId", backendUser._id);
      localStorage.setItem("backendUserId", backendUser._id);
    }
    if (backendToken) {
      localStorage.setItem("authToken", backendToken);
    }
  };

  const syncUserToBackend = async ({ mobileNo, nameValue, emailValue, profile, firebaseTokenValue }) => {
    const payload = {
      mobileNo: mobileNo || undefined,
      name: nameValue || undefined,
      email: emailValue || undefined,
      profile: profile || undefined,
      firebaseToken: firebaseTokenValue || undefined,
    };

    const data = await postJson("/auth/social-login", payload);
    const { user: backendUser, token: backendToken } = parseAuthPayload(data);
    return { backendUser, backendToken };
  };

  const checkPhoneUser = async (mobileNo) => {
    const data = await postJson("/auth/check-phone-user", { mobileNo });
    return { exists: Boolean(data?.exists), user: data?.data || null };
  };

  const ensureRecaptcha = async () => {
    if (recaptchaVerifierRef.current) return recaptchaVerifierRef.current;

    const container = document.getElementById("recaptcha-container");
    if (!container) throw new Error("reCAPTCHA container not found");

    recaptchaVerifierRef.current = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
      callback: () => {},
      "expired-callback": () => setError("reCAPTCHA expired. Please try again."),
    });

    await recaptchaVerifierRef.current.render();
    return recaptchaVerifierRef.current;
  };

  const sendPhoneOtp = async () => {
    const safeMobile = normalizeMobile(mobile);
    if (safeMobile.length !== 10) return setError("Please enter a valid 10-digit mobile number");

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const verifier = await ensureRecaptcha();
      const confirmationResult = await signInWithPhoneNumber(auth, `+91${safeMobile}`, verifier);
      confirmationResultRef.current = confirmationResult;
      setMobile(safeMobile);
      setStep("otp");
      setMessage(`OTP sent to +91 ${safeMobile}`);
    } catch (err) {
      setError(err?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyPhoneOtp = async () => {
    if (otp.length !== 6) return setError("Please enter a valid 6-digit OTP");
    if (!confirmationResultRef.current) return setError("OTP session expired. Please resend OTP.");

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const result = await confirmationResultRef.current.confirm(otp);
      const firebaseUser = result.user;
      const idToken = await firebaseUser.getIdToken();
      const normalized = normalizeMobile(firebaseUser.phoneNumber || mobile);

      const existing = await checkPhoneUser(normalized);
      if (existing.exists) {
        const { backendUser, backendToken } = await syncUserToBackend({
          mobileNo: normalized,
          firebaseTokenValue: idToken,
        });

        saveSession({
          backendUser,
          backendToken,
          fallbackUser: {
            uid: firebaseUser.uid,
            name: existing.user?.name || "User",
            email: existing.user?.email || "",
            mobileNo: normalized,
          },
        });

        onClose();
        navigate("/user-profile");
        return;
      }

      setVerifiedMobile(normalized);
      setFirebaseToken(idToken);
      setStep("profile");
      setMessage("OTP verified. Please complete your profile.");
    } catch (err) {
      setError(err?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const completeProfileAndLogin = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) return setError("Please enter your full name");
    if (!isValidEmail(trimmedEmail)) return setError("Please enter a valid email");
    if (!verifiedMobile) return setError("Phone verification required");

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const { backendUser, backendToken } = await syncUserToBackend({
        mobileNo: verifiedMobile,
        nameValue: trimmedName,
        emailValue: trimmedEmail,
        firebaseTokenValue: firebaseToken,
      });

      saveSession({
        backendUser,
        backendToken,
        fallbackUser: {
          name: trimmedName,
          email: trimmedEmail,
          mobileNo: verifiedMobile,
        },
      });

      onClose();
      navigate("/user-profile");
    } catch (err) {
      setError(err?.message || "Failed to complete login");
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      const idToken = await firebaseUser.getIdToken();

      const { backendUser, backendToken } = await syncUserToBackend({
        nameValue: firebaseUser.displayName || "Google User",
        emailValue: firebaseUser.email || "",
        profile: firebaseUser.photoURL || "",
        firebaseTokenValue: idToken,
      });

      saveSession({
        backendUser,
        backendToken,
        fallbackUser: {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || "Google User",
          email: firebaseUser.email || "",
          photoURL: firebaseUser.photoURL || "",
        },
      });

      onClose();
      navigate("/user-profile");
    } catch (err) {
      setError(err?.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  const resetOtpStep = () => {
    setStep("mobile");
    setOtp("");
    setMessage("");
    setError("");
    confirmationResultRef.current = null;
  };

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains("auth-backdrop")) onClose();
  };

  return (
    <div className="auth-backdrop" onClick={handleBackdropClick}>
      <motion.div
        className="auth-modal"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="auth-close" onClick={onClose}>
          <IoClose />
        </button>

        <div className="auth-left">
          <img src={authImage} alt="Auth" />
        </div>

        <div className="auth-right">
          {error && <p className="error-text">{error}</p>}
          {message && <p className="info-text">{message}</p>}

          {step === "mobile" && (
            <>
              <h2>Log In</h2>
              <p className="subtitle">Enter mobile number to continue with OTP</p>

              <input
                type="tel"
                placeholder="Mobile Number"
                value={mobile}
                maxLength="10"
                onChange={(e) => {
                  setMobile(e.target.value.replace(/\D/g, ""));
                  setError("");
                }}
              />

              <button
                disabled={normalizeMobile(mobile).length !== 10 || loading}
                onClick={sendPhoneOtp}
                className="primary-btn"
              >
                {loading ? "Please wait..." : "Continue"}
              </button>

              <div className="divider">
                <span>OR</span>
              </div>

              <button className="google-btn" onClick={loginWithGoogle} disabled={loading}>
                <FcGoogle size={20} />
                <span>{loading ? "Please wait..." : "Continue with Google"}</span>
              </button>

              <button
                className="astrologer-btn"
                onClick={() => {
                  onClose();
                  navigate("/astrologer-login");
                }}
              >
                Login as Astrologer
              </button>
            </>
          )}

          {step === "otp" && (
            <>
              <h3>Verify OTP</h3>
              <p className="subtitle">Enter the 6-digit code sent to +91 {mobile}</p>

              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                maxLength="6"
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, ""));
                  setError("");
                }}
              />

              <button
                disabled={otp.length !== 6 || loading}
                onClick={verifyPhoneOtp}
                className="primary-btn"
              >
                {loading ? "Verifying..." : "Verify & Login"}
              </button>

              <button className="back-btn" onClick={resetOtpStep}>
                Change Number
              </button>

              <button className="resend-btn" onClick={sendPhoneOtp} disabled={loading}>
                Resend OTP
              </button>
            </>
          )}

          {step === "profile" && (
            <>
              <h3>Complete Profile</h3>
              <p className="subtitle">New user detected. Please enter name and email.</p>

              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
              />

              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
              />

              <button
                disabled={!name.trim() || !isValidEmail(email) || loading}
                onClick={completeProfileAndLogin}
                className="primary-btn"
              >
                {loading ? "Please wait..." : "Save & Login"}
              </button>
            </>
          )}
        </div>

        <div id="recaptcha-container"></div>
      </motion.div>
    </div>
  );
}
