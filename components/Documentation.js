'use client'
import React, { useState } from 'react'
import Link from 'next/link'


export default function Documentation() {
  const [isDropdown, setIsDropdown] = useState(false)
const handleIsDropdown = () => {
  setIsDropdown(!isDropdown)
}
  return (
    <>
      <div className="techwave_fn_doc_page">
        <div className="docpage">
          {/* Page Title */}
          <div className="techwave_fn_pagetitle">
            <h2 className="title">Documentation</h2>
          </div>
          {/* !Page Title */}
          <div className="doccontent">
            <div className="container small">
              <div id="doc_introduction">
                <h4>Thank you for choosing TECH-AI</h4>
                <p>Dear Client</p>
                <p>We wanted to inform you that this documentation was generated by an AI chat bot as an example. While the content and structure of the documentation are based on best practices and industry standards, please note that it may not fully align with your specific requirements or project scope.</p>
                <p>The AI chat bot utilized advanced language processing capabilities to generate the documentation, incorporating information and guidelines commonly found in similar documentation. However, we strongly recommend reviewing and customizing the documentation to accurately reflect your {`project's`} unique needs, preferences, and implementation details.</p>
                <p>We understand the importance of tailored documentation that addresses your specific goals, and our team is more than happy to assist you in creating a comprehensive and customized documentation package. We will work closely with you to understand your {`project's`} intricacies and deliver documentation that precisely matches your expectations.</p>
                <p>Should you require any further assistance or have any questions regarding the documentation or any other aspect of your project, please feel free to reach out to our team. We are committed to providing you with the highest level of support and ensuring the success of your endeavor.</p>
                <p>Thank you for your understanding, and we look forward to collaborating with you further.</p>
                <p>Best regards,<br />Jack Nelson,<br />Frenify</p>
                <h4>Introduction</h4>
                <p><b>Overview:</b> Explore how the AI chat bot leverages natural language processing (NLP) algorithms and machine learning techniques to understand user input and generate contextually appropriate responses.</p>
                <p><b>Key Features:</b> Dive deeper into the key features, such as sentiment analysis, entity recognition, and intent classification, that empower the AI chat bot to provide intelligent and accurate interactions.</p>
                <p><b>System Requirements:</b> Review the hardware and software prerequisites necessary for deploying and running the AI chat bot, including supported operating systems, browsers, and server requirements.</p>
              </div>
              <div id="doc_customization">
                <h4>Customization</h4>
                <p><b>Chat Bot Appearance:</b> Learn how to modify the visual elements of the chat bot, including its layout, typography, icons, and overall design, to match your {`brand's`} aesthetics or user interface guidelines.</p>
                <p><b>Conversational Flow:</b> Gain insights into customizing the chat {`bot's`} dialogue flow, including creating custom intents, defining response templates, and incorporating context-aware conversations to improve user engagement.</p>
                <p><b>Personalization:</b> Explore advanced customization options, such as user profiling, personalized recommendations, and user-specific preferences, to enhance the user experience and make interactions more tailored and relevant.</p>
              </div>
              <div id="doc_video">
                <h4>Video Tutorials</h4>
                <p><b>Step-by-Step Implementation:</b> Access a library of video tutorials that guide you through each phase of the AI chat bot implementation process, including installation, configuration, customization, and deployment.</p>
                <p><b>Best Practices:</b> Learn from expert tips and best practices demonstrated in video tutorials to optimize the performance, scalability, and user satisfaction of your AI chat bot.</p>
              </div>
              <div id="doc_darkmode">
                <h4>Dark Mode</h4>
                <p><b>Enabling Dark Mode:</b> Understand how to implement and toggle the dark mode feature within the chat {`bot's`} user interface, allowing users to switch between light and dark themes based on their preference or the {`website/application's`} design.</p>
              </div>
              <div id="doc_assets">
                <h4>Build Assets</h4>
                <p><b>Integration APIs:</b> Explore a comprehensive guide on how to integrate the AI chat bot with various platforms, utilizing APIs to send and receive messages, extract user data, and leverage additional functionalities offered by external services.</p>
                <p><b>SDKs and Libraries:</b> Discover software development kits (SDKs) or libraries that provide pre-built components and tools for seamless integration, simplifying the development process and reducing implementation time.</p>
              </div>
              <div id="doc_multidemo">
                <h4>Multi-Demo</h4>
                <p><b>Multi-Language Support:</b> Learn about language localization techniques and how to incorporate multiple languages into the AI chat bot, enabling it to communicate effectively with users from diverse linguistic backgrounds.</p>
                <p><b>Multi-Platform Deployment:</b> Gain insights into deploying the AI chat bot across different platforms simultaneously, such as websites, mobile apps, social media, and messaging platforms, ensuring broad accessibility and a consistent user experience.</p>
              </div>
              <div id="doc_structure">
                <h4>File Structure</h4>
                <p><b>Project Organization:</b> Explore an in-depth overview of the AI chat {`bot's`} file structure, including the organization of code files, assets, configuration files, and third-party libraries. Understand how different components interact and collaborate within the project.</p>
                <p>Remember, the documentation should provide clear instructions, explanations, and examples to assist users in understanding and implementing the AI chat bot effectively. It should also incorporate diagrams, diagrams, and flowcharts where applicable, to enhance comprehension.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="docsidebar">
          <ul>
            <li>
              <Link href="#doc_introduction">Introduction</Link>
            </li>
            <li className="menu-item-has-children">
              <Link href="#" onClick={handleIsDropdown}>
                Quick Setup
                <span className="trigger"><img src="svg/arrow.svg" alt=""  className="fn__svg" /></span>
              </Link>
              <ul className="sub-menu"  style={{display: `${!isDropdown ? "none" : ""}`}}>
                <li>
                  <Link href="#doc_customization"><span className="text">Customization</span></Link>
                </li>
                <li>
                  <Link href="#doc_video"><span className="text">Video Tutorials</span></Link>
                </li>
                <li>
                  <Link href="#doc_darkmode"><span className="text">Dark Mode</span></Link>
                </li>
              </ul>
            </li>
            <li>
              <Link href="#doc_assets">Build Assets</Link>
            </li>
            <li>
              <Link href="#doc_multidemo">Multi-demo</Link>
            </li>
            <li>
              <Link href="#doc_structure">File Structure</Link>
            </li>
          </ul>
        </div>
      </div>

    </>
  )
}