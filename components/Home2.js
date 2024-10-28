'use client'
import React, { useEffect } from 'react'
import Link from 'next/link'
import { animationText } from '@/components/Utilities'

export default function Home2() {
  useEffect(() => {
    animationText()
  }, [])

  return (
    <>
      <div className="techwave_fn_home">
        <div className="section_home">
          <div className="section_left">
            {/* Title Shortcode */}
            <div className="techwave_fn_title_holder">
              <h1 className="title">Unleash Your Creativity with AI</h1>
              <p className="desc">Generate your ideas into stunning visuals</p>
            </div>
            {/* !Title Shortcode */}
            {/* Interactive List Shortcode */}
            <div className="techwave_fn_interactive_list modern">
              <ul>
                <li>
                  <div className="item">
                    <Link href="/image-generation">
                      <span className="icon">
                        <img src="svg/image.svg" alt=""  className="fn__svg" />
                      </span>
                      <h2 className="title">Image Generation</h2>
                      <p className="desc">This field of AI combines deep learning algorithms and generative models to create new images that resemble real-world photographs or exhibit creative and imaginative qualities.</p>
                      <span className="arrow"><img src="svg/arrow.svg" alt=""  className="fn__svg" /></span>
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="item">
                    <Link href="/ai-chat-bot">
                      <span className="icon">
                        <img src="svg/chat.svg" alt=""  className="fn__svg" />
                      </span>
                      <h2 className="title">AI Chat Bot</h2>
                      <p className="desc">An AI chatbot, short for artificial intelligence chatbot, is a computer program designed to simulate human-like conversations and provide automated responses to user queries or prompts. </p>
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
              <img src="img/logo-desktop-full.png" alt=""  />
              <p className="fn__animated_text">The official server of TECH-AI, a text-to-image AI where your imagination is the only limit. We’re building market-leading features that will give you greater control over your generations.</p>
              <hr />
              <div className="fn__members">
                <div className="active item">
                  <span className="circle" />
                  <span className="text">1,154,694 Online</span>
                </div>
                <div className="item">
                  <span className="circle" />
                  <span className="text">77,345,912 Members</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}