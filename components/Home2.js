'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import axios from 'axios';
import Script from "next/script";
import { animationText } from '@/components/Utilities'
import { useRouter } from 'next/navigation';
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

export default function Home2() {

  const router = useRouter();
  const [organization, setOrganization] = useState('');
  const [user, setUser] = useState('');
  const [name, setName] = useState('');
  const [dba, setDBName] = useState('');
  const [number, setNumber] = useState('');
  const [type, setType] = useState('');
  const [country, setCountry] = useState('CA');
  const [loading, setLoading] = useState(false);
  const [tagline, setTagline] = useState('');
  const [address, setAddress] = useState('')
  const [pickupAddress, setPickupAddress] = useState('')
  const [lat, setLat] = useState(null)
  const [lng, setLng] = useState(null)
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
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

  const inputRef = useRef(null)

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
          dba,
          number,
          type,
          address,
          pickupAddress,
          lat,
          lng,
          country,
          tagline,
          phone,
          init: true,
          email
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
              <form onSubmit={handleSubmit} className="business-form">
                  <h2>Get ready for take off</h2>
                  <p>Setup your business.</p>
                  <div className="form_group"  >
                  <label>Business Legal Name</label>
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
                  <div className="form_group"  >
                  <label>Doing Business As?</label>
                    <input
                      type="text"
                      id="b_name"
                      className="full_width"
                      placeholder="DBA"
                      value={dba}
                      onChange={(e) => setDBName(e.target.value)}
                      required
                    />
                  </div>
                  <br />
                  <div className="form_group"  >
                  <label>Business Number</label>
                    <input
                      type="text"
                      id="b_name"
                      className="full_width"
                      placeholder="Business Number"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      required
                    />
                  </div>
                  <br />
                  <div className="form_group" >
                  <label>Business Address</label>
                  <input
                    type="text"
                    id="address"
                    className="full_width"
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
                <br/>
                  <div className="form_group" >
                  <label>Business Type</label>
                      <select
                          value={type}
                          onChange={(e) =>
                                      setType(e.target.value)
                                    }>
                          <option value="Retail">Retail/Wholesale Store</option>
                          <option value="Food">Restaurant</option>
                      </select>
                  </div>
                  <br/>
                  <div className="form_group" >
                  <label>Country</label>
                      <select
                          value={country}
                          onChange={(e) =>
                                      setCountry(e.target.value)
                                    }>
                          <option value="CA">Canada</option>
                          <option value="US">United States of America</option>
                      </select>
                  </div>
                  <br/>
                  <div className="form_group" >
                <label>Phone Number</label>
                <PhoneInput
                  id="phone"
                  placeholder="Enter phone number"
                  defaultCountry="US"
                  value={phone}
                  onChange={setPhone}
                  international
                />
                </div>
                <br/>
                <div className="form_group" >
                  <label>Business Email</label>
                  <input
                    type="text"
                    id="email"
                    className="full_width"
                    placeholder="Business Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <br/>
                <div className="form_group" >
                  <label>Tagline</label>
                  <input
                    type="text"
                    id="tagline"
                    className="full_width"
                    placeholder="Tagline"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    required
                  />
                </div>
                <br/>
                
                <div className="form_group" >
                  <label>Store Location (Orders & Pickups will be routed to this location)</label>
                  <input
                    type="text"
                    id="address"
                    className="full_width"
                    placeholder="Address"
                    value={pickupAddress}
                    ref={inputRef}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    required
                  />
                </div>
                <br/>

                <span style={{ color: "green" }}>Business Verification may take a few moments. We may ask to share additional information, otherwise you are ready to go!</span>

                <br/><br/>

                  {loading && <span>updating...</span>} 
                  {!loading && <button className="techwave_fn_button" type="submit">Proceed</button>} 

              </form>
            </div>
          </div>
        </div>
      </div>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyCzZUtpoLjBKa5hFrvqCAP_9zBQFPVcXy8&libraries=places`}
        strategy="afterInteractive"
        onLoad={() => {
          const autocomplete = new window.google.maps.places.Autocomplete(
            inputRef.current,
            { types: ["address"], componentRestrictions: { country: `${country}` }, },
          );

          autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            const location = place.geometry?.location;
            setPickupAddress(place.formatted_address)
            setLat(location?.lat())
            setLng(location?.lng())
          });
        }}
      />

    </>
  )
}