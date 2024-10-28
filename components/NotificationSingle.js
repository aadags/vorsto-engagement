
import React from 'react'
import Link from 'next/link'


export default function NotificationSingle() {
  return (
    <>
      <div className="techwave_fn_notification_single_page">
        {/* Page Title */}
        <div className="techwave_fn_pagetitle">
          <h2 className="title"><span>Notification:</span> Version 4.1.2 has been released.</h2>
        </div>
        {/* !Page Title */}
        <div className="techwave_fn_notification_single_content">
          <div className="container small">
            <p>Introducing TECH-AI 4.1.2: Empowering Innovation and Efficiency</p>
            <p>We are thrilled to announce the release of TECH-AI 4.1.2, the latest version of our groundbreaking project management software. Building upon the success of the previous version, TECH-AI 4.1.2 takes innovation and efficiency to new heights, providing organizations with enhanced tools and features to streamline project workflows and drive success.</p>
            <ol>
              <li>Intuitive User Interface: TECH-AI 4.1.2 boasts a sleek and user-friendly interface, making it easier than ever for teams to navigate and collaborate within the platform. The updated interface offers a clean design, intuitive controls, and customizable dashboards, ensuring a seamless user experience.</li>
              <li>Intuitive User Interface: TECH-AI 4.1.2 boasts a sleek and user-friendly interface, making it easier than ever for teams to navigate and collaborate within the platform. The updated interface offers a clean design, intuitive controls, and customizable dashboards, ensuring a seamless user experience.</li>
              <li>Enhanced Collaboration: Collaboration lies at the heart of TECH-AI 4.1.2. The software now offers enhanced collaboration features, including real-time messaging, file sharing, and team discussions. Stay connected with your team members, share ideas, and make informed decisions together.</li>
              <li>Comprehensive Reporting: Gain valuable insights into project performance and make data-driven decisions with TECH-AI 4.1.2{`'`}s comprehensive reporting features. Generate customized reports, visualize project data through interactive charts, and track key metrics to monitor progress and identify areas for improvement.</li>
              <li>Integration Capabilities: TECH-AI 4.1.2 seamlessly integrates with popular productivity tools and platforms, allowing for a unified project management ecosystem. Connect with applications like G Suite, Microsoft Office 365, and Slack, ensuring smooth data synchronization and collaboration across your organization.</li>
              <li>Advanced Security Measures: We understand the importance of data security. With TECH-AI 4.1.2, we have implemented robust security measures to safeguard your sensitive project information. Rest assured that your data is protected with advanced encryption protocols and regular security updates.</li>
              <li>Scalability and Flexibility: Whether you{`'`}re managing small projects or large-scale initiatives, TECH-AI 4.1.2 offers the scalability and flexibility to adapt to your organization{`'`}s evolving needs. Seamlessly scale up as your project portfolio expands and tailor the software to align with your unique workflows.</li>
            </ol>
            <p>With TECH-AI 4.1.2, we continue our commitment to empowering teams, improving project outcomes, and driving organizational success. Experience the power of innovation and efficiency with our latest version. Upgrade to TECH-AI 4.1.2 and unlock the full potential of your projects.</p>
            <div className="fn__backto">
              <Link href="/notifications">
                <img src="svg/arrow.svg" alt=""  className="fn__svg" />
                <span className="text">Back to Notifications</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}
