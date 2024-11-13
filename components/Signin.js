'use client'
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, googleProvider, githubProvider, emailProvider } from "../firebaseConfig/FirebaseClient";
// import 'firebaseui/dist/firebaseui.css';
import '../public/css/firebase.css';

export default function Signin() {
  const router = useRouter();


  useEffect(() => {
    if (typeof window !== 'undefined') {

      auth.onAuthStateChanged(async (currentUser) => {

        if (currentUser) {

            try {

              const response = await fetch('/api/verify-user', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: currentUser.email }),
              });
        
              if (response.ok) {
                const res = await response.json();
                router.push('/')
                
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
              googleProvider.providerId,
              githubProvider.providerId
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

  return (
    <>
      <div className="techwave_fn_sign">
        <div className="sign__content" style={{ textAlign: "center" }}>
          <img src="/img/vorsto-logo-small.png" className="logo2" alt="logo" />
          <span style={{ fontWeight: "bold", fontSize: "20px", color: "#FFF" }}>CUSTOMER ENGAGEMENT</span><br/><br/>
          {/* <h1>Sign In</h1> */}
          <div id="firebaseui-auth-container">
            {/* Loader can be added here if needed */}
            <div id="loader">Loading...</div>
          </div>
        </div>
      </div>
    </>
  );
}
