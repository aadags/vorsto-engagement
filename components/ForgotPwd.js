'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { auth } from "../firebaseConfig/FirebaseClient";
import { sendPasswordResetEmail } from "firebase/auth";
// import 'firebaseui/dist/firebaseui.css';
import '../public/css/firebase.css';

export default function ForgotPwd() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isZuppr, setIsZuppr] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsZuppr(window.location.hostname.includes(process.env.NEXT_PUBLIC_ZUPPR_API));
    }
  }, []);

  const handlePasswordReset = async (e) => {
    e.preventDefault(); // Prevent page refresh

    setMessage("");
    setError("");

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent. Check your inbox.");
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setError("User not found. Please check your email.");
      } else {
        setError("Failed to send reset email. Try again.");
      }
    }
  };

  return (
    <>
      <div className="techwave_fn_sign" style={{
        backgroundImage: "url('/bckgd1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
      }}>
        <div className="sign__content" style={{ textAlign: "center" }}>
        {isZuppr?
        <img
          src="/zuppr-merchant-w.png"
          alt="logo"
          width={100}
        />
        :
        <img
          src="/vorsto-logo.png"
          className="logo2"
          alt="logo"
          style={{ width: "30% !important" }}
        />}
          {/* <h1>Sign In</h1> */}
          <form className="login"  onSubmit={handlePasswordReset}>
            <div className="form__content">
              <div className="form__title">Password Reset</div>
              {error && (
                <p className="error-message" style={{ color: 'red' }}>
                  {error}
                </p>
              )}
              {message && <p className="error-message" style={{ color: 'green' }}>{message}</p>}
            
              <div className="form__username">
                <div className="pass_lab">
                  <label htmlFor="user_login">Email</label>
                </div>
                <input type="text" className="input" id="user_login" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            
              <div className="form__submit">
                <label className="fn__submit">
                  <input type="submit" name="submit" defaultValue="Reset" />
                </label>
              </div>
            </div>
          </form>
          <div className="sign__desc">
            <p> <Link href="/login">Log In</Link></p>
          </div>
        </div>
      </div>
    </>
  );
}
