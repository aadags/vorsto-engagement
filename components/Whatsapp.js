"use client";
import React, { useState, useEffect } from "react";
import axios from 'axios';
import EmbeddedSignup from "./WhatsappEmbedded";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faCheckCircle } from '@fortawesome/free-solid-svg-icons'

export default function Whatsapp() {

  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const createTemplates = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/create-whatsapp-template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ waba_id: org.waba_id, token: org.wa_token }),
      });

      if(response.ok)
      {
        setSaved(true);
        setLoading(false);
      }

    } catch (error) {
      console.error('Error creating template:', error);
      setSaved(true);
      setLoading(false);
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
              { org && org.wa_phone_id && org.waba_id?
                <h1 className="title">Whatsapp Business Settings</h1>
                :
                <h1 className="title">Connect to Whatsapp Business</h1>}
            </div>

            <div className="header_bottom">
            { org && org.wa_phone_id && org.waba_id?
              <div className="">
                {org.template_exist? <span></span>
                : 
                <form>
                  <p style={{ fontStyle: "italic", fontWeight: "bold" }}>To use  whatsapp business messaging, Vorsto requires custom whatsapp messaging templates for your business</p>
                  <p>name: vorsto_support_enquiry</p>
                  <p>description: Messaging format when a human agent connects to a live chat</p>
                  <div className="form_group">
                    <input
                      type="text"
                      className="full_width"
                      value={"Support Representative Connected (header)"}
                      placeholder={"header"}
                      readOnly={true}
                    />   
                  </div>
                  <br/>
                  <div className="form_group">
                    <textarea
                      className="full_width"
                      value={"{{agent_name}} has joined this conversation and will be assisting you with your enquiry."}
                      rows={4}
                      readOnly={true}
                    />
                  </div>
                  <br/>
                  <p>name: vorsto_support_check_in</p>
                  <p>description: Messaging format when a human agent responds to an enquiry on a live chat after 1 hour</p>
                  <div className="form_group">
                    <textarea
                      className="full_width"
                      value={"Hello, Thank you for your patience on your enquiry. {{custom_message}}"}
                      rows={4}
                      readOnly={true}
                    />
                  </div>
                  <br/>
                  <button className="techwave_fn_button" type="button" aria-readonly={loading} onClick={() => createTemplates()}>
                    <span>Complete Templates Setup {loading && <FontAwesomeIcon icon={faSpinner} spin={true} />} {saved && <FontAwesomeIcon icon={faCheckCircle} />}</span>
                  </button>
                </form>
                
                }
              </div>
              :
              <EmbeddedSignup />}
            </div>
          </div>
          {/* !Generation Header */}
        </div>
      </div>
    </>
  );
}
