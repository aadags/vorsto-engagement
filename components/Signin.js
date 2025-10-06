'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { auth, googleProvider } from "../firebaseConfig/FirebaseClient";
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithCredential, signInWithPopup } from "firebase/auth";
// import 'firebaseui/dist/firebaseui.css'; // Removed, we’ll conditionally load
import '../public/css/firebase.css';

export default function Signin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isZuppr, setIsZuppr] = useState(false);
  const [isAppleEnv, setIsAppleEnv] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // 👈 loading state

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ua = navigator.userAgent.toLowerCase();
      const appleDevice =
        /iphone|ipad|ipod|macintosh/.test(ua) && !/windows/.test(ua);
      setIsAppleEnv(appleDevice);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsZuppr(window.location.hostname.includes(process.env.NEXT_PUBLIC_ZUPPR_API));

      const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
        if (currentUser) {
          try {
            setIsLoading(true); // start loading
            const response = await fetch('/api/verify-user', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name: currentUser.displayName,
                email: currentUser.email,
                uid: currentUser.uid,
              }),
            });

            if (response.ok) {
              await response.json();
              handleUserId(currentUser.email);
              router.push('/validate');
            }
          } catch (error) {
            console.error('Verification failed:', error);
          } finally {
            setIsLoading(false); // stop loading
          }
        } else if (!isZuppr) {
          // Only load FirebaseUI if NOT zuppr.ca
          const firebaseui = require('firebaseui');
          const ui =
            firebaseui.auth.AuthUI.getInstance() ||
            new firebaseui.auth.AuthUI(auth);

          const uiConfig = {
            callbacks: {
              signInSuccessWithAuthResult: function (authResult) {
                console.log(authResult);
                return true;
              },
              uiShown: function () {
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

      return () => unsubscribe();
    }
  }, [router, isZuppr]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true); // start loading
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false); // stop loading
    }
  };

  const handleGoogleLogin = () => {
    setIsLoading(true); // start loading
    if (window.ReactNativeWebView?.postMessage) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ action: "startGoogleLogin" }));
    } else {
      setError("Google login not available in this environment.");
      setIsLoading(false);
    }
  };

  const handleUserId = (userId) => {
    if (window.ReactNativeWebView?.postMessage && isZuppr) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ instruction: "userId", id: userId }));
    } else {
      console.log("Unable to set user Id.");
    }
  };

  useEffect(() => {
    const handleMessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.provider === "google") {
          setIsLoading(true);
          const credential = GoogleAuthProvider.credential(data.token);
          const result = await signInWithCredential(auth, credential);
          
          const response = await fetch('/api/verify-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: result.user.displayName,
              email: result.user.email,
              uid: result.user.uid,
            }),
          });

          if (response.ok) {
            await response.json();
            handleUserId(result.user.email);
            router.push('/validate');
          }
          setIsLoading(false);
        }

        if (data.provider === "apple") {
          setIsLoading(true);
          const response = await fetch('/api/verify-apple-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: (data.name?.givenName && data.name?.familyName)
                ? `${data.name.givenName} ${data.name.familyName}`
                : undefined,
              email: data.email,
              uid: data.user,
            }),
          });

          if (response.ok) {
            const res = await response.json();
            handleUserId(res.data.email);
            localStorage.setItem("appleLogin", JSON.stringify(res.data))
            router.push('/validate');
          }
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error handling token message:", err);
        setIsLoading(false);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [router]);
  

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

        <form className="login" onSubmit={handleSubmit}>
          <div className="form__content">
            <div className="form__title">Sign In</div>
            {error && (
              <p className="error-message" style={{ color: 'red' }}>
                {error.includes('user-not-found') && 'User not found. Please check your email.'}
                {error.includes('wrong-password') && 'Incorrect password. Please try again.'}
                {!error.includes('user-not-found') && !error.includes('wrong-password') && error}
              </p>
            )}

            {isLoading && (
              <p style={{ color: "#7c5fe3", fontWeight: "bold" }}>Loading...</p>
            )}

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
                disabled={isLoading}
              />
            </div>
            <div className="form__pass">
              <div className="pass_lab">
                <label htmlFor="user_password">Password</label>
                <Link href="/forgot-password">Forgot Password?</Link>
              </div>
              <input
                type="password"
                id="user_password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="form__submit">
              <label className="fn__submit">
                <input type="submit" name="submit" defaultValue="Sign In" disabled={isLoading} />
              </label>
            </div>

            <div className="form__alternative">
              <div className="fn__lined_text">
                <div className="line" />
                <div className="text">Or</div>
                <div className="line" />
              </div>

              {isZuppr ? (
                <>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  style={{
                    display: "inline-block",
                    padding: "10px 20px",
                    backgroundColor: "#4285F4",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    fontWeight: "bold",
                    cursor: isLoading ? "not-allowed" : "pointer",
                  }}
                >
                  {isLoading ? "Processing..." : "Login with Google"}
                </button>
                <br/><br/>

                {isAppleEnv && (
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => {
                      if (window.ReactNativeWebView?.postMessage) {
                        window.ReactNativeWebView.postMessage(
                          JSON.stringify({ action: "startAppleLogin" })
                        );
                      }
                    }}
                    style={{
                      display: "inline-block",
                      padding: "10px 20px",
                      backgroundColor: "#000", // Apple style
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      fontWeight: "bold",
                      cursor: isLoading ? "not-allowed" : "pointer",
                    }}
                  >
                    {isLoading ? "Processing..." : " Login with Apple"}
                  </button>
                )}
                </>
              ) : (
                <div id="firebaseui-auth-container">
                  <div id="loader">Loading...</div>
                </div>
              )}
              <br/><br/>
              {!isAppleEnv && <p>
                Don&apos;t have an account yet?{" "}
                <Link href="/signup" style={{ color: "#7c5fe3" }}>
                  Sign Up
                </Link>
              </p>}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
