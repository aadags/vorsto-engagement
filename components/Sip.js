"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Device } from "@twilio/voice-sdk";

export default function Sip() {
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

  return (
    <>
      <div className="techwave_fn_aichatbot_page fn__chatbot">
        <div className="chat__page">
          <div className="font__trigger">
            <span />
          </div>
          <div className="container">
            <div>
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
          </div>
        </div>
        <div className="chat__sidebar">
          <div className="sidebar_content">
            <div className="chat__group new">
            <span className="text">Call Info</span><br/>
                    <span className="text">Call Info</span><br/>
                    <span className="text">Call Info</span><br/>
                    <span className="text">Call Info</span><br/>
                    <span className="text">Call Info</span><br/>
                    <span className="text">Call Info</span><br/>
                    <span className="text">Call Info</span><br/>
                    <span className="text">Call Info</span><br/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
