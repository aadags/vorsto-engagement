"use client";
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function Instagram() {

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const router = useRouter();

  const launchInstagramSignup = () => {
    router.push("https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=934739811950493&redirect_uri=https://engage.vorsto.io/channel/instagram&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish");
  };

  useEffect(() => {
    const validateIG = async () => {
      
      const response = await axios.post(`/api/validate-instagram`,
      {
        code
      });
  
    };

    if(code)
    {
      validateIG();
    }
  }, [code]);

  return (
    <>
      <div className="techwave_fn_image_generation_page">
        <div className="generation__page">
          {/* Generation Header */}
          <div className="generation_header">
            <div className="header_top">
                <h1 className="title">Connect to Instagram Business Account</h1>
            </div>
            <div className="header_bottom">
              <button onClick={launchInstagramSignup} className="techwave_fn_button" ><span>Login with Instagram</span></button>
            </div>
          </div>
          {/* !Generation Header */}
        </div>
      </div>
    </>
  );
}
