'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { auth, googleProvider, githubProvider, emailProvider, facebookProvider } from "../firebaseConfig/FirebaseClient";
import { signInWithEmailAndPassword } from "firebase/auth";
// import 'firebaseui/dist/firebaseui.css';
import '../public/css/firebase.css';

export default function Signin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");


  useEffect(() => {
    if (typeof window !== 'undefined') {

      auth.onAuthStateChanged(async (currentUser) => {
        console.log({ currentUser })
        if (currentUser) {

            try {

              const response = await fetch('/api/verify-user', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: currentUser.displayName, email: currentUser.email, uid: currentUser.uid }),
              });
        
              if (response.ok) {
                const res = await response.json();
                router.push('/launch')
                
              } 
            } catch (error) {
             
            }
            
        } else {

          let firebaseui = require('firebaseui');

          const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
          
          const uiConfig = {
            callbacks: {
              signInSuccessWithAuthResult: function(authResult, redirectUrl) {
                console.log(authResult);
                return true;
              },
              uiShown: function() {
                document.getElementById('loader').style.display = 'none';
              }
            },
            signInFlow: 'popup',
            signInSuccessUrl: 'https://engage.vorsto.io/login',
            signInOptions: [
              googleProvider.providerId
            ],
            tosUrl: 'https://vorsto.io/terms-policy',
            privacyPolicyUrl: 'https://vorsto.io/privacy-policy'
          };

          ui.start('#firebaseui-auth-container', uiConfig);
          ui.disableAutoSignIn();
        }
      });
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/launch');
    } catch (err) {
      setError(err.message);
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
          <img src="/white_logo.png" className="logo2" alt="logo" style={{ width: "30% !important" }} />
          {/* <h1>Sign In</h1> */}
          <form className="login" onSubmit={handleSubmit}>
            <div className="form__content">
              <div className="form__title">Sign In</div>
              {error && (
                <p className="error-message" style={{ color: 'red' }}>
                  {error.includes('user-not-found') && 'User not found. Please check your email.'}
                  {error.includes('wrong-password') && 'Incorrect password. Please try again.'}
                </p>
              )}
              <div className="form__username">
                <div className="pass_lab">
                  <label htmlFor="user_login">Email</label>
                </div>
                <input type="text" className="input" id="user_login" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="form__pass">
                <div className="pass_lab">
                  <label htmlFor="user_password">Password</label>
                  <Link href="/forgot-password">Forgot Password?</Link>
                </div>
                <input type="password" id="user_password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="form__submit">
                <label className="fn__submit">
                  <input type="submit" name="submit" defaultValue="Sign In" />
                </label>
              </div>
              <div className="form__alternative">
                <div className="fn__lined_text">
                  <div className="line" />
                  <div className="text">Or</div>
                  <div className="line" />
                </div>
                <div id="firebaseui-auth-container">
                  {/* Loader can be added here if needed */}
                  <div id="loader">Loading...</div>
                </div>
              </div>
            </div>
          </form>
          <div className="sign__desc">
            <p>Don't have an account yet? <Link href="/signup">Sign Up</Link></p>
          </div>
        </div>
      </div>
    </>
  );
}
