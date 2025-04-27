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
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
  
    try {
      const res = await fetch('/api/update-business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          country,
        }),
      });
  
      const data = await res.json();
  
      if (!res.ok) throw new Error(data.error || 'Failed to update business');
  
      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="techwave_fn_image_generation_page">
        <div className="generation__page">
          {/* Generation Header */}
          <div className="generation_header">
            <div className="header_bottom">
              <form onSubmit={handleSubmit}>
                  <h2>Get ready for take off</h2>
                  <p>Setup your business.</p>
                  <div className="form_group"  style={{ width: "30%" }}>
                    <input
                      type="text"
                      id="b_name"
                      className="full_width"
                      placeholder="Business Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <br />
                  <div className="form_group" style={{ width: "30%" }}>
                      <select
                          value={country}
                          onChange={(e) =>
                                      setCountry(e.target.value)
                                    }>
                          <option value="">Select your country</option>
                          <option value="CA">Canada</option>
                          <option value="US">United States of America</option>
                      </select>
                  </div>
                  <br/>
                  {loading && <span>updating...</span>} 
                  {!loading && <button className="techwave_fn_button" type="submit">Proceed</button>} 

              </form>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}