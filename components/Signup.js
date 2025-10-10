'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth, googleProvider } from "../firebaseConfig/FirebaseClient";
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithCredential, createUserWithEmailAndPassword, updateProfile, signInWithPopup } from "firebase/auth";
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
  const [isAppleEnv, setIsAppleEnv] = useState(false);
  const [isZupprApp, setIsZupprApp] = useState(false);

  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const ua = navigator.userAgent.toLowerCase();

      const isZupprApp = /zupprmerchantapp(apple|android)/.test(ua);
      setIsZupprApp(isZupprApp)
  
      // ✅ Apple environment (iPhone, iPad, Mac)
      const appleDevice = /iphone|ipad|ipod|macintosh|zupprmerchantappapple/.test(ua);
      setIsAppleEnv(appleDevice);
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
      const isApple = localStorage.getItem("appleLogin") || null;

      if(isApple){

        (async () => {
          if (!isApple) return;
      
          try {
            const userData = JSON.parse(isApple);
      
            const response = await fetch('/api/verify-apple-user', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: userData.name,
                email: userData.email,
                uid: userData.apple_id,
              }),
            });

            const res = await response.json();
            if (response.ok) {
              const res = await response.json();
      
              if (!res.data.is_validated) {
                router.push('/validate');
              } else {
                router.push('/launch');
              } 
            }
          } catch (error) {
            console.log(error);
            localStorage.removeItem('appleLogin')
            router.push('/login');
          }
        })();

      } else {

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
              signInSuccessUrl: isZuppr? 'https://merchant.zuppr.ca/login' : 'https://engage.vorsto.io/login',
              signInOptions: [googleProvider.providerId],
              tosUrl: isZuppr? 'https://merchants.zuppr.ca/terms.html' : 'https://dev.vorsto.io/terms-policy',
              privacyPolicyUrl: isZuppr? 'https://merchants.zuppr.ca/privacy.html' : 'https://dev.vorsto.io/privacy-policy',
            };

            ui.start('#firebaseui-auth-container', uiConfig);
            ui.disableAutoSignIn();
          }
        });
      }
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

  const handleGoogleLogin = () => {
    if (window.ReactNativeWebView?.postMessage) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ action: "startGoogleLogin" }));
    } else {
      setError("Google login not available in this environment.");
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
        }

        if (data.provider === "apple") {
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
        }
      } catch (err) {
        console.error("Error handling token message:", err);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [router]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const initializeApple = () => {
    if (!window.AppleID) return;

    try {
      window.AppleID.auth.init({
        clientId: "com.zuppr.merchant-web", // ✅ your Service ID
        scope: "name email",
        redirectURI: window.location.origin+"/api/verify-apple-callback", // ✅ match Apple dashboard
        usePopup: true,
      });
      window.AppleID.auth._initialized = true;
      console.log("✅ AppleID.auth initialized");
    } catch (err) {
      console.error("AppleID init error:", err);
    }
  };

  // inside SignupPage component
useEffect(() => {
  if (typeof window === "undefined") return;

  // If already loaded and initialized, skip
  if (window.AppleID?.auth?._initialized) return;

  // Load SDK only once
  if (!window._appleScriptLoaded) {
    const script = document.createElement("script");
    script.src =
      "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
    script.async = true;
    script.onload = () => {
      window._appleScriptLoaded = true;
      initializeApple();
    };
    document.body.appendChild(script);
  } else {
    initializeApple();
  }
}, []);

const handleAppleSignup = async () => {
  try {
    if (!window.AppleID?.auth?._initialized) {
      initializeApple();
    }

    const res = await window.AppleID.auth.signIn();
    const { authorization, user } = res;

    const idToken = authorization.id_token;
    const appleData = {
      email: user?.email,
      name: user?.name
        ? `${user.name.firstName || ""} ${user.name.lastName || ""}`.trim()
        : "",
      apple_id: authorization.user,
      uid: idToken,
    };

    const verify = await fetch("/api/verify-apple-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(appleData),
    });

    const result = await verify.json();
    if (verify.ok) {
      localStorage.setItem("appleLogin", JSON.stringify(result?.data));
      router.push(result?.data?.is_validated ? "/launch" : "/validate");
    } else {
      console.error("Apple verification failed", result);
    }
  } catch (err) {
    console.error("Apple sign-in failed:", err);
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

              {isZupprApp ? (<>
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
                <br/><br/>

                {isAppleEnv && (
                  <button
                    type="button"
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
                      fontWeight: "bold"
                    }}
                  >
                    {" Signup with Apple"}
                  </button>
                )}
                </>
              ) : (
                <>
                <div>
                {isAppleEnv && (
                  <>
                  <button
                    type="button"
                    onClick={handleAppleSignup}
                    style={{
                      display: "inline-block",
                      padding: "10px 20px",
                      backgroundColor: "#000",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      fontWeight: "bold",
                    }}
                  >
                    {" Signup with Apple"}
                  </button>
                  </>
                )}
                </div>
                <div id="firebaseui-auth-container">
                  <div id="loader">Loading...</div>
                </div>
                </>
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
