"use client";
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function Instagram() {

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [org, setOrg] = useState(null);
  const [ig, setIg] = useState(null);

  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const router = useRouter();

  const launchInstagramSignup = () => {
    router.push("https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=934739811950493&redirect_uri=https://engage.vorsto.io/channel/instagram&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish");
  };

  const disconnectIG = async () => {
    const confirmed = window.confirm("Are you sure you want to disconnect Instagram?");
    if (confirmed) {
      try {
        const response = await axios.get(`/api/deactivate-instagram`);
        if (response.data) {
          router.refresh();
        }
      } catch (error) {
        console.error("Error deactivating Instagram:", error);
      }
    }
  };
  

  useEffect(() => {
    const validateIG = async () => {
      
      const response = await axios.post(`/api/validate-instagram`,
      {
        code
      });

      if(response.data)
      {
        router.refresh();
      }
  
    };

    if(code)
    {
      validateIG();
    }
  }, [code]);

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
                <h1 className="title">Connect to Instagram Professional Account</h1>
            </div>
            <div className="header_bottom">
            { org && ig && org.ig_token && org.ig_user_id?
            <div className="techwave_fn_user_profile">
              <button onClick={disconnectIG} className="techwave_fn_button" ><span>Disconnect Instagram</span></button>
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
              <button onClick={launchInstagramSignup} className="techwave_fn_button" ><span>Login with Instagram</span></button>
            }
            </div>
          </div>
          {/* !Generation Header */}
        </div>
      </div>
    </>
  );
}
