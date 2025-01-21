"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Device } from "@twilio/voice-sdk";
import { socket } from '@/app/socket'
import { getUser } from '@/services/userService';

export default function Sip() {
  const [user, setUser] = useState();
  const [currentAgentId, setCurrentAgentId] = useState(null);
  const [currentCall, setCurrentCall] = useState(null);
  const [callStatus, setCallStatus] = useState("Offline");
  const [isConnected, setIsConnected] = useState(false);
  const [deviceToken, setDeviceToken] = useState();

  const fetchToken = async () => {
    try {
      const res = await fetch(`/api/twilio-token`, { method: "GET" });
      const data = await res.json();
      setCurrentAgentId(data.userId);
      connectClient(data.token);
    } catch (error) {
      setCallStatus(`Error fetching token: ${error.message}`);
    }
  };

  const connectClient = (token) => {
    
    const device = new Device(token);
    setDeviceToken(token);
    device.register();

    socket.emit('call-agents', user.id);

    device.addListener('registered', device => {
      setCallStatus("Ready");
      setIsConnected(true);
      console.log('The device is ready to receive incoming calls.')
    });

    device.on('incoming', (call) => {
      setCallStatus("Incoming support call");
      setCurrentCall(call);

      call.on('accept', call => {
        setCallStatus("The incoming call was accepted");
      });

      call.on('cancel', () => {
        setCallStatus("The call has been canceled.");
       });
      
    });

    device.on('error', (twilioError, call) => {
      setCallStatus(`Error: ${twilioError}`);
     });
  };

  const handleAnswerCall = () => {
    if (currentCall) {
      currentCall.accept();
      setCallStatus("In call with customer");
    }
  };

  const handleHangUp = () => {
    const device = new Device(deviceToken);
    device.disconnectAll();
    setCallStatus('Call has ended.');
  };

  const transferCall = async () => {
    if (currentAgentId) {
      await fetch(`/api/conference/call-transfer`, {
        method: "POST",
        body: JSON.stringify({
          agentId: 2,
        }),
      });
    }
  };

  const handleConnectAgent = () => {
    setCallStatus("Connecting...");
    fetchToken();
  };

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
      <div className="techwave_fn_aichatbot_page fn__chatbot">
        <div className="chat__page">
          <div className="font__trigger">
            <span />
          </div>
          <div className="container" style={{  display: "flex", gap: "20px" }}>
            <div className="box">
              <h1>My Call Center</h1>
              <p>Status: {callStatus}</p>
              {!isConnected && (
                <div>
                  <button onClick={() => handleConnectAgent()} className="techwave_fn_button">
                    Connect Phone
                  </button>
                </div>
              )}
              {isConnected && (
                <div>
                  <button onClick={handleAnswerCall} className="techwave_fn_button">Answer Call</button>
                  <br/>
                  <button onClick={handleHangUp} className="techwave_fn_button">Hang Up</button>
                  <br/>
                  <button onClick={transferCall} className="techwave_fn_button">Transfer Call</button>
                </div>
              )}
            </div>
            <div className="box" style={{ backgroundImage: "url('/img/blank_smartphone_mockup_isolate_on_background.jpg')",
              backgroundSize: "cover", // Ensures the image covers the div area
              backgroundPosition: "center", // Centers the image
              backgroundRepeat: "no-repeat", // Prevents repeating
              height: "100vh", }}>
                <div style={{ padding: "50px 25px" }}>

                  all

                </div>
            </div>
          </div>
        </div>
        <div className="chat__sidebar">
        <div className="sidebar_content">
                    
                        <div style={{ width: "100%", padding: "20px" }}>
                            <h5>Create New Ticket</h5>
                            <form>
                                    <div className="form_group">
                                    <input
                                        type="text"
                                        id="bot_name"
                                        className="full_width"
                                        placeholder="Title"
                                        required
                                    />
                                    </div>
                                    <br/>
                                    <div className="form_group">
                                    <input
                                        type="text"
                                        id="bot_name"
                                        className="full_width"
                                        placeholder="Category"
                                        required
                                    />
                                    </div>
                                    <br/>
                                    <div className="form_group">
                                    <select
                                        className="full_width"
                                        required
                                    
                                        >
                                            <>
                                            <option value="">Select Priority</option>
                                            <option value="">Critical</option>
                                            <option value="">High</option>
                                            <option value="">Medium</option>
                                            <option value="">Low</option>
                                            </>
                                        </select><br/>
                                    </div>
                                    <br/>
                                    <div className="form_group">
                                        <textarea
                                        id="system_bio"
                                        className="full_width"
                                        rows={10} // Increased height
                                        style={{
                                            resize: 'vertical', // Allows vertical resizing by user
                                            overflow: 'auto', // Adds scroll when content overflows
                                        }}
                                        placeholder="Ticket Description"
                                        required
                                        />
                                    </div>
                                    <br/>
                                    <div className="generate_section">
                                    {/* <button type="submit" className="techwave_fn_button" aria-readonly={loading}><span>Create User {loading && <FontAwesomeIcon icon={faSpinner} spin={true} />}</span></button> */}
                                    <button type="submit" className="techwave_fn_button"><span>Create Ticket</span></button>
                                    </div>
                                </form>
                        </div>
                    </div>
        </div>
      </div>
    </>
  );
}
