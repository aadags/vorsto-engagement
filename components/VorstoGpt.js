
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { getUser } from '@/services/userService';


export default function VorstoGpt() {

  const [emailKey, setEmailKey] = useState();
  const [user, setUser] = useState();

  async function getCountryCode() {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return data.country_code; // Returns the country code, e.g., "US"
  }

  useEffect(() => {

    const fetchCc = async () => {
      let cc = user.location || localStorage.getItem("cc");
      if(!cc)
      {
        cc = await getCountryCode();
        localStorage.setItem("cc", cc);
      }
      const split = user.email.split("@");
      const u = split[0] + "+location_"+cc;
      setEmailKey(u+"@"+split[1]);
    }

    if(user)
    {
      fetchCc();
    }

  }, [user])

  useEffect(() => {
        
    const fetchData = async () => {
      try {
        const user = await getUser();
        setUser(user);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [])
  
  return (
    <>
      <div className="techwave_fn_user_profile_page">
        {/* Page Title */}
        <div className="techwave_fn_pagetitle">
          <h2 className="title">Vorsto-XA</h2>
        </div>
        {/* !Page Title */}
        <div className="container small">
          <div className="techwave_fn_user_profile">
            <div className="user__profile">
              <div className="user_details">
                <ul>
                  <li>
                    <div className="item">
                      <h4 className="subtitle">Model</h4>
                      <h3 className="title">Vorsto-XA</h3>
                    </div>
                  </li>
                  <li>
                    <div className="item">
                      <h4 className="subtitle">Context Tokens</h4>
                      <h3 className="title">128,000 tokens</h3>
                    </div>
                  </li>
                  <li>
                    <div className="item">
                      <h4 className="subtitle">Version</h4>
                      <h3 className="title">vorsto-xa-2</h3>
                    </div>
                  </li>
                  <li>
                    <div className="item">
                      <h4 className="subtitle">Max Output Tokens</h4>
                      <h3 className="title">16,384 tokens</h3>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            {/* {user && <div className="user__plan">
              <div className="plan_left">
                <h4 className="subtitle">Tokens</h4>
                <p className="info"><span> {user.gpt_token}</span></p>
              </div>
              <div className="plan_right">
                {user.location==="NG"?
                <Link href={`${process.env.NEXT_PUBLIC_PAYSTACK_TOKEN_URL}`} className="token_upgrade techwave_fn_button"><span>Buy Tokens</span></Link>
                :
                <Link href={`${process.env.NEXT_PUBLIC_VORSTO_GPT_BUY_BTN}?prefilled_email=${emailKey}&client_reference_id=gpttoken_${user.stripe_id}`} className="token_upgrade techwave_fn_button"><span>Buy Tokens</span></Link>
                }
              </div>
            </div>} */}
            
          </div>
        </div>
      </div>

    </>
  )
}