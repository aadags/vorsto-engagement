"use client";
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function VoiceSetup() {

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [org, setOrg] = useState(null);
  const [ig, setIg] = useState(null);

  const router = useRouter();

  const sendEmail = async () => {

    const response = await fetch('/api/send-voice-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ send: "send" }),
    });

    if (response.ok) {

      alert("Request Sent");
    }

    
  };
  

  useEffect(() => {
    const fetchOrg = async () => {
      
      const response = await axios.get(`/api/get-org-details`);
      setOrg(response.data);

      if(response.data && response.data.ig_token && response.data.ig_user_id)
      {
        const response = await axios.get(`/api/get-ig-profile`);
        setIg(response.data);
      }
  
    };
    fetchOrg();
  }, []);

  return (
    <>
      <div className="techwave_fn_image_generation_page">
        <div className="generation__page">
          {/* Generation Header */}
          <div className="generation_header">
            <div className="header_top">
                <h1 className="title">Setup Voice AI</h1>
            </div>
            <div className="header_bottom">
              <button onClick={sendEmail} className="techwave_fn_button" ><span>Request Access</span></button>
            </div>
          </div>
          {/* !Generation Header */}
        </div>
      </div>
    </>
  );
}
