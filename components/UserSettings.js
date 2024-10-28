
import React from 'react'
import Link from 'next/link'


export default function UserSettings() {
  return (
    <>
      <div className="techwave_fn_user_settings_page">
        {/* Page Title */}
        <div className="techwave_fn_pagetitle">
          <h2 className="title">Settings</h2>
        </div>
        {/* !Page Title */}
        <div className="container small">
          <div className="techwave_fn_user_settings">
            <form>
              <div className="user__settings">
                <div className="settings_left">
                  {/* Upload Shortcode */}
                  <label className="fn__upload">
                    <span className="upload_content">
                      <img src="svg/upload.svg" alt=""  className="fn__svg" />
                      <span className="title">Drag &amp; Drop a Image</span>
                      <span className="fn__lined_text">
                        <span className="line" />
                        <span className="text">Or</span>
                        <span className="line" />
                      </span>
                      <span className="title">Browse</span>
                      <span className="desc">Supports JPG, JPEG, and PNG</span>
                    </span>
                    <span className="upload_preview">
                      <Link href="#" className="fn__closer fn__icon_button">
                        <img src="svg/close.svg" alt=""  className="fn__svg" />
                      </Link>
                      <img src="#" alt=""  className="preview_img" />
                    </span>
                    <input type="file" accept="image/*" />
                  </label>
                  {/* !Upload Shortcode */}
                </div>
                <div className="settings_right">
                  <div className="item">
                    <label className="input_label" htmlFor="name">Name</label>
                    <div className="input_item">
                      <input className="input" type="text" id="name" defaultValue="Caden Smith" />
                    </div>
                  </div>
                  <div className="item">
                    <label className="input_label" htmlFor="username">Username</label>
                    <div className="input_item">
                      <span className="email">@</span>
                      <input className="input" type="text" id="username" defaultValue="caddeomyth" />
                    </div>
                  </div>
                  <div className="item">
                    <label className="input_label" htmlFor="email">Email Address</label>
                    <div className="input_item">
                      <input className="input" type="text" id="email" defaultValue="cadensmith@gmail.com" />
                    </div>
                  </div>
                  <div className="item">
                    <label className="input_label" htmlFor="password">Password</label>
                    <div className="input_item">
                      <input className="input" type="password" id="password" defaultValue="lqbjSA34a!bh1" />
                    </div>
                  </div>
                  <div className="item">
                    <label className="fn__checkbox">
                      <input type="checkbox" />I approve all changes
                      <span className="checkmark" />
                      <img src="svg/check.svg" alt=""  className="fn__svg" />
                    </label>
                  </div>
                  <div className="item">
                    <label className="fn__submit">
                      <input type="submit" defaultValue="Save Changes" />
                    </label>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

    </>
  )
}