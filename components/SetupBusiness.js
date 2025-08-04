'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import PhoneInput from 'react-phone-number-input'
import axios from "axios";
import 'react-phone-number-input/style.css'


export default function SetupBusiness() {
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [file, setFile] = useState();
  const [file2, setFile2] = useState();
  const [message, setMessage] = useState("");
  const [message2, setMessage2] = useState("");
  const [uploaded, setUploaded] = useState();
  const [uploaded2, setUploaded2] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitting2, setIsSubmitting2] = useState(false);
  const fileInputRef = useRef(null);
  const fileInputRef2 = useRef(null);

  const router = useRouter();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const data = { name, tagline, phone, email, country };

    try {
      const response = await fetch('/api/update-business', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {

        setLoading(false);
        setSuccess("Information updated");
        
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

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload-business-logo", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    if (res.ok) {
      setMessage(`Uploaded successfully`);
      setUploaded(result.file);
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    } else {
      setMessage(result.error || "Upload failed");
    }
    setIsSubmitting(false);
  };

  const handlePromoImageSubmit = async (e) => {
    e.preventDefault();
    if (!file2) {
      setMessage2("Please select a file.");
      return;
    }

    setIsSubmitting2(true);

    const formData = new FormData();
    formData.append("file", file2);

    const res = await fetch("/api/upload-business-promo", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    if (res.ok) {
      setMessage2(`Uploaded successfully`);
      setUploaded2(result.file);
      if (fileInputRef2.current) {
        fileInputRef2.current.value = null;
      }
    } else {
      setMessage2(result.error || "Upload failed");
    }
    setIsSubmitting2(false);
  };


  const fetchOrg = async () => {
      
    const response = await axios.get(`/api/get-org-details`);
    const org = response.data;
    setName(org.name);
    setTagline(org.tagline);
    setPhone(org.contact_number);
    setEmail(org.contact_email);
    setCountry(org.country);
    setUploaded({ url: org.logo});
    setUploaded2({ url: org.promo_image});
  };

  useEffect(() => {
   
    fetchOrg();

  }, []);

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
                <label>Business Name</label>
                  <input
                    type="text"
                    id="name"
                    className="full_width"
                    placeholder="Business Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <br/>
                <div className="form_group">
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
                <div className="form_group">
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
                <div className="form_group">
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
          
                <span style={{ color: "green" }}>800kb max per image</span>
                <form
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: "0.5rem",
                    paddingBottom: "0.5em",
                  }}
                >
                  <div className="form_group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    ref={fileInputRef}
                    className="block mb-4"
                  />
                  </div>
                  <button
                    type="button"
                    onClick={handleImageSubmit}
                    disabled={isSubmitting}
                    className="techwave_fn_button"
                  >
                    {isSubmitting ? "Uploading" : "Upload Business Logo"}
                  </button>
                </form>

                {message && <p style={{ color: "red" }}>{message}</p>}
                <br />
                {uploaded && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: "0.5rem",
                      paddingBottom: "0.5em",
                    }}
                  >
                    <div>
                        <img
                          src={uploaded.url}
                          alt={`Uploaded logo`}
                          className="w-full"
                          width="200px"
                        />
                        <br />
                    
                      </div>
                  </div>
                )}

                <br />

                <form
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: "0.5rem",
                    paddingBottom: "0.5em",
                  }}
                >
                  <div className="form_group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile2(e.target.files?.[0] || null)}
                    ref={fileInputRef2}
                    className="block mb-4"
                  />
                  </div>
                  <button
                    type="button"
                    onClick={handlePromoImageSubmit}
                    disabled={isSubmitting2}
                    className="techwave_fn_button"
                  >
                    {isSubmitting2 ? "Uploading" : "Upload Business Promo Image"}
                  </button>
                </form>

                {message2 && <p style={{ color: "red" }}>{message2}</p>}
                <br />
                {uploaded2 && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: "0.5rem",
                      paddingBottom: "0.5em",
                    }}
                  >
                    <div>
                        <img
                          src={uploaded2.url}
                          alt={`Uploaded logo`}
                          className="w-full"
                          width="200px"
                        />
                        <br />
                    
                      </div>
                  </div>
                )}

                <p style={{ color: "red" }}>{error}</p>
                <p style={{ color: "green" }}>{success}</p>

                <br />
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
