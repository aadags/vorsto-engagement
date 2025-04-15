'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios';
import { animationText } from '@/components/Utilities'
import { useRouter } from 'next/navigation';

import { useStripeConnect } from "../hooks/useStripeConnect";
import {
  ConnectAccountOnboarding,
  ConnectComponentsProvider,
} from "@stripe/react-connect-js";

export default function Home2() {

  const router = useRouter();
  const [organization, setOrganization] = useState('');
  const [accountCreatePending, setAccountCreatePending] = useState(false);
  const [onboardingExited, setOnboardingExited] = useState(false);
  const [error, setError] = useState(false);
  const [connectedAccountId, setConnectedAccountId] = useState();
  const stripeConnectInstance = useStripeConnect(connectedAccountId);


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
  }, [])

  return (
    <>
      <div className="techwave_fn_image_generation_page">
        <div className="generation__page">
          {/* Generation Header */}
          <div className="generation_header">
            <div className="header_bottom">
              {!connectedAccountId && <h2>Getting ready for take off</h2>}
              {connectedAccountId && !stripeConnectInstance && <h2>Add information to start accepting money</h2>}
              {!connectedAccountId && <p>PallyTech Co is the world's leading air travel platform: join our team of pilots to help people travel faster.</p>}
              

              {!accountCreatePending && !connectedAccountId && (
                <div>
                  <button
                    onClick={async () => {
                      setAccountCreatePending(true);
                      setError(false);
                      fetch("/api/account", {
                        method: "POST",
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
                    Sign up
                  </button>
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
                  {connectedAccountId && <p>Your connected account ID is: <code className="bold">{connectedAccountId}</code></p>}
                  {accountCreatePending && <p>Setting up your account...</p>}
                  {onboardingExited && <p>The Account Onboarding component has exited</p>}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

    </>
  )
}