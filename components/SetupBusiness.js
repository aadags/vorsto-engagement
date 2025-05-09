'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'


export default function SetupBusiness() {
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [phone, setPhone] = useState()

  const router = useRouter();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const data = { name, tagline };

    try {
      const response = await fetch('/api/update-business', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {

        router.push('/information')
        
      } else {
        // Handle error
        setLoading(false);
        setError("An error occurred");
      }
    } catch (error) {
      setLoading(false);
      setError("An error occurred: " + error);
      console.error('Error creating agent:', error);
    }
  };

  return (
    <>
      <div className="techwave_fn_image_generation_page">
        <div className="generation__page">
          {/* Generation Header */}
          <div className="generation_header">
            <div className="header_top">
              <h1 className="title">Update Business Information</h1>
            </div>
            <div className="header_bottom">
              <form onSubmit={handleSubmit} style={{ width: "70%" }}>
                <div className="form_group">
                <PhoneInput
                  id="phone"
                  placeholder="Enter phone number"
                  defaultCountry="US"
                  value={phone}
                  onChange={setPhone}
                  international
                />
                <p></p>
                </div>
                <br/>
                <div className="form_group">
                  <input
                    id="system_bio"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    rows={4}
                    placeholder="Tagline"
                    required
                  />
                </div>
                <br/>
                <p className="text-red">{error}</p>
                <br/>
                <div className="generate_section">
                  <button type="submit" className="techwave_fn_button" aria-readonly={loading}><span>Update Information {loading && <FontAwesomeIcon icon={faSpinner} spin={true} />}</span></button>
                </div>
              </form>
            </div>
          </div>
          {/* !Generation Header */}
        </div>
      </div>
    </>
  );
}
