'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios';
import { animationText } from '@/components/Utilities'
import { useRouter } from 'next/navigation';

export default function Home2() {

  const router = useRouter();

  useEffect(() => {

    const fetchOrg = async () => {
      
      const response = await axios.get(`/api/get-org-details`);
      const org = response.data;

      if(new Date(org.created_at).getTime() < Date.now() - 100 * 24 * 60 * 60 * 1000)
      {
        router.push('/');
      }
    };
    fetchOrg();
    animationText()
  }, [])

  return (
    <>
      <div className="techwave_fn_home">
        <div className="section_home">
          <div className="section_left">
            {/* Title Shortcode */}
            <div className="techwave_fn_title_holder">
              <h1 className="title">Automate your conversations!</h1>
              <p className="desc">Let's get you setup</p>
            </div>
            {/* !Title Shortcode */}
            {/* Interactive List Shortcode */}
            <div className="techwave_fn_interactive_list modern">
              <ul>
                <li>
                  <div className="item">
                    <Link href="/agent" target="_blank">
                      <span className="icon">
                        <img src="svg/robot.svg" alt=""  className="fn__svg" />
                      </span>
                      <h2 className="title">Setup your agent</h2>
                      <span className="arrow"><img src="svg/arrow.svg" alt=""  className="fn__svg" /></span>
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="item">
                    <Link href="/channel/webchat" target="_blank">
                      <span className="icon">
                        <img src="svg/webchat.svg" alt=""  className="fn__svg" />
                      </span>
                      <h2 className="title">Setup your website chat widget</h2>
                      <span className="arrow"><img src="svg/arrow.svg" alt=""  className="fn__svg" /></span>
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="item">
                    <Link href="/channel/whatsapp" target="_blank">
                      <span className="icon">
                        <img src="svg/whatsapp.svg" alt=""  className="fn__svg" />
                      </span>
                      <h2 className="title">Connect your business whatsapp account</h2>
                      <span className="arrow"><img src="svg/arrow.svg" alt=""  className="fn__svg" /></span>
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="item">
                    <Link href="/channel/instagram" target="_blank">
                      <span className="icon">
                        <img src="svg/instagram.svg" alt=""  className="fn__svg" />
                      </span>
                      <h2 className="title">Connect your professional instagram account</h2>
                      <span className="arrow"><img src="svg/arrow.svg" alt=""  className="fn__svg" /></span>
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="item">
                    <Link href="/channel/email" target="_blank">
                      <span className="icon">
                        <img src="svg/email.svg" alt=""  className="fn__svg" />
                      </span>
                      <h2 className="title">Connect your email</h2>
                      <span className="arrow"><img src="svg/arrow.svg" alt=""  className="fn__svg" /></span>
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="item">
                    <Link href="/channel/voice" target="_blank">
                      <span className="icon">
                        <img src="svg/tty.svg" alt=""  className="fn__svg" />
                      </span>
                      <h2 className="title">Setup your business phone</h2>
                      <span className="arrow"><img src="svg/arrow.svg" alt=""  className="fn__svg" /></span>
                    </Link>
                  </div>
                </li>
              </ul>
            </div>
            {/* !Interactive List Shortcode */}
          </div>
          <div className="section_right">
            <div className="company_info">
              <img src="/logo_black.png" alt=""  />
              <p className="fn__animated_text">Meet your customers where they are—WhatsApp, Web, Instagram, Email, and Voice Calls—with Vorsto’s coordinated AI and human agents.</p>

            </div>
          </div>
        </div>
      </div>

    </>
  )
}