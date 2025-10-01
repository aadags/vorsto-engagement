'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth, googleProvider } from "../firebaseConfig/FirebaseClient";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';

// import 'firebaseui/dist/firebaseui.css'; // intentionally left out
import '../public/css/firebase.css';

export default function Signup() {
  return (
    <GoogleReCaptchaProvider reCaptchaKey="6LcBq9QqAAAAAIkPQED2Epo4dVikjXOfYWhdaXHP">
      <SignupPage />
    </GoogleReCaptchaProvider>
  );
}

function SignupPage() {
  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [isZuppr, setIsZuppr] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsZuppr(window.location.hostname.includes(process.env.NEXT_PUBLIC_ZUPPR_API));
    }
  }, []);

  useEffect(() => {
    async function getRecaptchaToken() {
      if (!executeRecaptcha) return;
      const token = await executeRecaptcha("signup");
      setRecaptchaToken(token);
    }
    getRecaptchaToken();
  }, [executeRecaptcha]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      auth.onAuthStateChanged(async (currentUser) => {
        if (currentUser) {
          try {
            const response = await fetch('/api/verify-user', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: currentUser.displayName,
                email: currentUser.email,
                uid: currentUser.uid,
              }),
            });

            const res = await response.json();
            if (!res.is_validated) {
              router.push('/validate');
            } else {
              router.push('/launch');
            }
          } catch (err) {
            console.error('Error verifying user:', err);
          }
        } else if (!isZuppr) {
          // FirebaseUI only when NOT zuppr.ca
          const firebaseui = require('firebaseui');
          const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);

          const uiConfig = {
            callbacks: {
              signInSuccessWithAuthResult: () => true,
              uiShown: () => {
                const loader = document.getElementById('loader');
                if (loader) loader.style.display = 'none';
              },
            },
            signInFlow: 'popup',
            signInSuccessUrl: 'https://engage.vorsto.io/login',
            signInOptions: [googleProvider.providerId],
            tosUrl: 'https://vorsto.io/terms-policy',
            privacyPolicyUrl: 'https://vorsto.io/privacy-policy',
          };

          ui.start('#firebaseui-auth-container', uiConfig);
          ui.disableAutoSignIn();
        }
      });
    }
  }, [router, isZuppr]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!recaptchaToken) {
      setError("Failed to verify CAPTCHA. Please try again.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: name });

      const response = await fetch('/api/verify-user-with-capcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email: user.email,
          uid: user.uid,
          recaptchaToken,
        }),
      });

      const res = await response.json();
      if (!res.is_validated) {
        router.push('/validate');
      } else {
        router.push('/launch');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/validate');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="techwave_fn_sign"
      style={{
        backgroundImage: "url('/bckgd1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
      }}
    >
      <div className="sign__content" style={{ textAlign: "center" }}>
        <br /><br />
        {isZuppr?
        <img
          src="/zuppr-merchant-w.png"
          alt="logo"
          width={100}
        />
        : <img
          src="/vorsto-logo.png"
          className="logo2"
          alt="logo"
          style={{ width: "30% !important" }}
        />}

        <form className="login" onSubmit={handleSubmit}>
          <div className="form__content">
            <div className="form__title">Sign Up</div>
            {error && (
              <p className="error-message" style={{ color: 'red' }}>{error}</p>
            )}

            <div className="form__username">
              <div className="pass_lab">
                <label htmlFor="user_name">Name</label>
              </div>
              <input
                type="text"
                className="name"
                id="user_name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form__username">
              <div className="pass_lab">
                <label htmlFor="user_login">Email</label>
              </div>
              <input
                type="text"
                className="input"
                id="user_login"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form__pass">
              <div className="pass_lab">
                <label htmlFor="user_password">Password</label>
              </div>
              <input
                type="password"
                id="user_password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form__pass">
              <div className="pass_lab">
                <label htmlFor="user_confirm_password">Confirm Password</label>
              </div>
              <input
                type="password"
                id="user_confirm_password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="form__submit">
              <label className="fn__submit">
                <input type="submit" name="submit" defaultValue="Sign Up" />
              </label>
            </div>

            <div className="form__alternative">
              <div className="fn__lined_text">
                <div className="line" />
                <div className="text">Or</div>
                <div className="line" />
              </div>

              {isZuppr ? (
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  style={{
                    display: "inline-block",
                    padding: "10px 20px",
                    backgroundColor: "#4285F4",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Sign up with Google
                </button>
              ) : (
                <div id="firebaseui-auth-container">
                  <div id="loader">Loading...</div>
                </div>
              )}
              <br/><br/>
              <p>
                Already have an account?{" "}
                <Link href="/login" style={{ color: "#7c5fe3" }}>
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
