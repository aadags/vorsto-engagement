'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link'
import { useRouter } from 'next/navigation';


export default function Validate() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');



const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/activate-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (response.ok) {
      const res = await response.json();
      if(res.status)
      {
        router.push('/launch')
      }

      setError(res.error)
      
    } 
    
  };

  return (
    <>
      <div className="techwave_fn_sign" >
        <div className="sign__content" style={{ textAlign: "center" }}>
          <br/><br/>
          
          <h1>Email Verification</h1>
          <form className="login" onSubmit={handleSubmit}>
            <div className="form__content">
              <div className="form__title"></div>
              {error && (
                <p className="error-message" style={{ color: 'red' }}>
                  {error}
                </p>
              )}
              <div className="form__username">
                <div className="pass_lab">
                  <label htmlFor="user_login">Code <span style={{ fontSize: "12px" }}>**check your email for code</span></label>
                </div>
                <input type="text" className="input" id="user_login" value={code} onChange={(e) => setCode(e.target.value)} required />
              </div>
            
              
              <div className="form__submit">
                <label className="fn__submit">
                  <input type="submit" name="submit" defaultValue="Continue" />
                </label>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
