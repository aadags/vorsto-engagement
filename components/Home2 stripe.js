'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios';
import { animationText } from '@/components/Utilities'
import { useRouter } from 'next/navigation';

// import { useStripeConnect } from "../hooks/useStripeConnect";
// import {
//   ConnectAccountOnboarding,
//   ConnectComponentsProvider,
// } from "@stripe/react-connect-js";

export default function Home2() {

  const router = useRouter();
  const [organization, setOrganization] = useState('');
  const [country, setCountry] = useState('');
  const [accountCreatePending, setAccountCreatePending] = useState(false);
  const [onboardingExited, setOnboardingExited] = useState(false);
  const [error, setError] = useState(false);
  // const [connectedAccountId, setConnectedAccountId] = useState();
  // const stripeConnectInstance = useStripeConnect(connectedAccountId);

  useEffect(() => {

    const fetchOrg = async () => {
      
      const response = await axios.get(`/api/get-org-details`);
      const org = response.data;
      setOrganization(org);

      if(org.onboarding)
      {
        router.push('/');
      }
    };
    fetchOrg();
    animationText()
  }, [onboardingExited])

  return (
    <>
      <div className="techwave_fn_image_generation_page">
        <div className="generation__page">
          {/* Generation Header */}
          <div className="generation_header">
            <div className="header_bottom">
              {!connectedAccountId && <h2>Get ready for take off</h2>}
              {connectedAccountId && !stripeConnectInstance && <h2>Add information to start accepting money</h2>}
              {!connectedAccountId && <p>Let's setup your business.</p>}
              

              {!accountCreatePending && !connectedAccountId && (
                <div>
                  <select
                  style={{ width: "20%" }}
                    value={country}
                    onChange={(e) =>
                                setCountry(e.target.value)
                              }>
                    <option value="">Select your country</option>
                    <option value="CA">Canada</option>
                    <option value="US">United States of America</option>
                  </select>
                  <br/>
                  {country != "" && <button
                    className="techwave_fn_button"
                    onClick={async () => {
                      setAccountCreatePending(true);
                      setError(false);
                      fetch("/api/stripe/create-account", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          country
                        }),
                      })
                        .then((response) => response.json())
                        .then((json) => {
                          setAccountCreatePending(false);
                          const { account, error } = json;

                          if (account) {
                            setConnectedAccountId(account);
                          }

                          if (error) {
                            setError(true);
                          }
                        });
                    }}
                  >
                    Get Started
                  </button>}
                </div>
              )}
              {stripeConnectInstance && (
                <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
                  <ConnectAccountOnboarding
                    onExit={() => setOnboardingExited(true)}
                  />
                </ConnectComponentsProvider>
              )}
              {error && <p className="error">Something went wrong!</p>}
              {(connectedAccountId || accountCreatePending || onboardingExited) && (
                <div className="dev-callout">
                  {accountCreatePending && <p>Setting up your account...</p>}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

    </>
  )
}