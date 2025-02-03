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
            { org && ig && org.ig_token && org.ig_user_id?
            <div className="techwave_fn_user_profile">
              <button className="techwave_fn_button" ><span>Disconnect Instagram</span></button>
              <br/>
              <div className="user__profile">
              <div className="user_avatar">
                <img src={ig.profile_picture_url} alt=""  />
              </div>
              <div className="user_details">
                <ul>
                  <li>
                    <div className="item">
                      <h4 className="subtitle">Name</h4>
                      <h3 className="title">{ig.name}</h3>
                    </div>
                  </li>
                  <li>
                    <div className="item">
                      <h4 className="subtitle">Username</h4>
                      <h3 className="title">@{ig.username}</h3>
                    </div>
                  </li>
                  <li>
                    <div className="item">
                      <h4 className="subtitle">Account Type</h4>
                      <h3 className="title">{ig.account_type}</h3>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            </div>
              :
              <button onClick={sendEmail} className="techwave_fn_button" ><span>Request Access</span></button>
            }
            </div>
          </div>
          {/* !Generation Header */}
        </div>
      </div>
    </>
  );
}
