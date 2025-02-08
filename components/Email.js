"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import EmbeddedSignup from "./WhatsappEmbedded";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

export default function Email() {
  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [supportEmail, setSupportEmail] = useState();
  const [supportPwd, setSupportPwd] = useState();
  const [imapServer, setImapServer] = useState();
  const router = useRouter();

  const connectEmail = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/attach-support-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: supportEmail,
          password: supportPwd,
          server: imapServer,
        }),
      });

      if (response.ok) {
        setSaved(true);
        setLoading(false);
        router.refresh();
      } else {
        alert("Invalid credentials");
        setSaved(false);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error attavhing template:", error);
      setSaved(true);
      setLoading(false);
    }
  };

  const disconnectEmail = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to disconnect your support Email?"
    );
    if (confirmed) {
      try {
        const response = await axios.get(`/api/deactivate-support-email`);
        if (response.data) {
          router.refresh();
        }
      } catch (error) {
        console.error("Error deactivating Email:", error);
      }
    }
  };

  useEffect(() => {
    const fetchOrg = async () => {
      const response = await axios.get(`/api/get-org-details`);
      setOrg(response.data);
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
              <h1 className="title">Connect Support Email (IMAP)</h1>
            </div>

            <div className="header_bottom">
              {org && org.support_email ? (
                <div className="techwave_fn_user_profile">
                  <button
                    onClick={disconnectEmail}
                    className="techwave_fn_button"
                  >
                    <span>Disconnect Email</span>
                  </button>
                  <br />
                  <div className="user__profile">
                    <div className="user_details">
                      <ul>
                        <li>
                          <div className="item">
                            <h4 className="subtitle">Server</h4>
                            <h3 className="title">
                              *******************************
                            </h3>
                          </div>
                        </li>
                        <li>
                          <div className="item">
                            <h4 className="subtitle">Support Email</h4>
                            <h3 className="title">{org.support_email}</h3>
                          </div>
                        </li>
                        <li>
                          <div className="item">
                            <h4 className="subtitle">Port</h4>
                            <h3 className="title">****</h3>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <form>
                  <div className="form_group">
                    <input
                      type="text"
                      className="full_width"
                      value={supportEmail}
                      placeholder={"Email"}
                      onChange={(e) => setSupportEmail(e.target.value)}
                    />
                  </div>
                  <br />
                  <div className="form_group">
                    <input
                      type="password"
                      className="full_width"
                      value={supportPwd}
                      placeholder={"Password"}
                      onChange={(e) => setSupportPwd(e.target.value)}
                    />
                  </div>
                  <br />
                  <div className="form_group">
                    <input
                      type="text"
                      className="full_width"
                      value={imapServer}
                      placeholder={"Server (imap.domain.com)"}
                      onChange={(e) => setImapServer(e.target.value)}
                    />
                  </div>
                  <br />
                  <button
                    className="techwave_fn_button"
                    type="button"
                    aria-readonly={loading}
                    onClick={() => connectEmail()}
                  >
                    <span>
                      Connect Support Email{" "}
                      {loading && (
                        <FontAwesomeIcon icon={faSpinner} spin={true} />
                      )}{" "}
                      {saved && <FontAwesomeIcon icon={faCheckCircle} />}
                    </span>
                  </button>
                </form>
              )}
            </div>
          </div>
          {/* !Generation Header */}
        </div>
      </div>
    </>
  );
}
