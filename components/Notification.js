
import React from 'react'
import Link from 'next/link'


export default function Notification() {
  return (
    <>
      <div className="techwave_fn_notifications_page">
        {/* Page Title */}
        <div className="techwave_fn_pagetitle">
          <h2 className="title">Notifications</h2>
        </div>
        {/* !Page Title */}
        <div className="techwave_fn_notifications_content">
          <div className="container small">
            {/* Notifications List */}
            <div className="techwave_fn_notifications_list">
              <div className="notification__item">
                <Link href="/notification-single" className="fn__full_link" />
                <h2 className="item__title">Version 4.1.2 has been released</h2>
                <span className="item__date">May 25, 2023</span>
              </div>
              <div className="notification__item">
                <Link href="/notification-single" className="fn__full_link" />
                <h2 className="item__title">Video generation Beta has been released</h2>
                <span className="item__date">May 25, 2023</span>
              </div>
              <div className="notification__item">
                <Link href="/notification-single" className="fn__full_link" />
                <h2 className="item__title">Terms has been updated</h2>
                <span className="item__date">May 25, 2023</span>
              </div>
              <div className="notification__item">
                <Link href="/notification-single" className="fn__full_link" />
                <h2 className="item__title">Project Delivery Preparation</h2>
                <span className="item__date">May 25, 2023</span>
              </div>
              <div className="notification__item">
                <Link href="/notification-single" className="fn__full_link" />
                <h2 className="item__title">Your generation has been chosen this month featured item</h2>
                <span className="item__date">May 25, 2023</span>
              </div>
              <div className="notification__item">
                <Link href="/notification-single" className="fn__full_link" />
                <h2 className="item__title">Congratulations. You are upgraded to premium level</h2>
                <span className="item__date">May 25, 2023</span>
              </div>
              <div className="notification__item">
                <Link href="/notification-single" className="fn__full_link" />
                <h2 className="item__title">Your account is verified now!</h2>
                <span className="item__date">May 25, 2023</span>
              </div>
              <div className="notification__item">
                <Link href="/notification-single" className="fn__full_link" />
                <h2 className="item__title">Welcome to TECH-AI</h2>
                <span className="item__date">May 25, 2023</span>
              </div>
            </div>
            {/* !Notifications List */}
          </div>
        </div>
      </div>

    </>
  )
}