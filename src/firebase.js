import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDVCA5pgPKpVIB5sbIyRnmWEZXxXFYe2tw",
  authDomain: "kalpjyotish-bd41d.firebaseapp.com",
  projectId: "kalpjyotish-bd41d",
  storageBucket: "kalpjyotish-bd41d.appspot.com",
  messagingSenderId: "5986978124",
  appId: "1:5986978124:web:e35bc407a14d46c482e7e9",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

const isLocalHost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

export const PHONE_AUTH_TEST_MODE = import.meta.env.VITE_PHONE_AUTH_TEST_MODE === "true";

// Local development fallback for phone auth app verifier issues.
// Use only with Firebase fictional test phone numbers.
if (PHONE_AUTH_TEST_MODE && isLocalHost) {
  auth.settings.appVerificationDisabledForTesting = true;
}

export default app;
