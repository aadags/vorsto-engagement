"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Device } from "@twilio/voice-sdk";
import { socket } from '@/app/socket'
import { getUser } from '@/services/userService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPowerOff, faPhoneSquareAlt, faPhoneVolume, faPhoneSlash } from '@fortawesome/free-solid-svg-icons'

export default function Sip() {
  const [user, setUser] = useState();
  const [currentAgentId, setCurrentAgentId] = useState(null);
  const [currentCall, setCurrentCall] = useState(null);
  const [callStatus, setCallStatus] = useState("Offline");
  const [deviceStatus, setDeviceStatus] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [deviceToken, setDeviceToken] = useState();
  const [callParams, setCallParams] = useState();
  const [callFrom, setCallFrom] = useState();

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
    setDeviceToken(device);
    device.register();

    socket.emit('call-agents', user.id);

    device.addListener('registered', device => {
      setCallStatus("Ready");
      setIsConnected(true);
      setDeviceStatus(1);
      console.log('The device is ready to receive incoming calls.')
    });

    device.on('incoming', (call) => {
      setCallStatus("Incoming call");
      setCallParams(call.parameters)
      setCurrentCall(call);
      setDeviceStatus(2);

      call.on('accept', call => {
        setCallStatus("The incoming call was accepted");
        setDeviceStatus(3);
      });

      call.on('cancel', () => {
        setCallStatus("The call has been cancelled.");
        setDeviceStatus(1);
        setCurrentCall(null);
        setCallParams(null)
       });

       call.on('disconnect', call => {
        setCallStatus('The call has been disconnected.');
        setDeviceStatus(1);
        setCurrentCall(null);
        setCallParams(null)
       });

       call.on('reconnecting', (twilioError) => {
        setCallStatus('The call is trying to reconnect.');
        setDeviceStatus(4);
      });
       
       call.on('reconnected', () => {
        setCallStatus('The call has regained connectivity.')
        setDeviceStatus(3);
      });
      
    });

    device.on('error', (twilioError, call) => {
        deviceToken.destroy();
        setCallStatus("Offline");
        setIsConnected(false);
        setDeviceStatus(0);
    });
  };

  const disconnectDevice = () => {
    const confirmation = window.confirm("Are you sure you want to disconnect this device?");
    if (confirmation) {
      if (deviceToken) {
        deviceToken.destroy();
        setCallStatus("Offline");
        setIsConnected(false);
        setDeviceStatus(0);
      }
    }
  };
  
  
  const handleAnswerCall = () => {
    if (currentCall) {
      currentCall.accept();
    }
  };

  const handleHangUp = () => {
    if(currentCall)
    {
      currentCall.disconnect();
      setC
    }
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

  useEffect(() => {
        
    const fetchCallData = async () => {
      try {

        const resp = await fetch(`/api/get-call-data`, {
          method: "POST",
          body: JSON.stringify({
            conferenceId: callParams.CallSid,
          }),
        });
        const call = await resp.json();
        setCallFrom(call.from);

      } catch (error) {
        console.log(error);
      }
    };

    if(callParams)
    {
      fetchCallData();
    }
  }, [callParams])

  return (
    <>
      <div className="techwave_fn_aichatbot_page fn__chatbot">
        <div className="chat__page">
          <div className="font__trigger">
            <span />
          </div>
          <div className="container">
            <p>Device Status: {callStatus}</p>
            {callFrom && <p>{callFrom}</p>}
            <p><img src="/img/blank_smartphone_mockup_isolate_on_background.jpg" alt="" style={{ width: "150px" }} /></p>
            <span style={{ position: "absolute", left: "85px", top: "200px" }}>
                {deviceStatus==0? 
                <FontAwesomeIcon icon={faPowerOff} size={"4x"} color={"darkOrange"} />:
                deviceStatus==1?
                <div style={{ textAlign: 'center' }}>
                  <FontAwesomeIcon icon={faPowerOff} size={"4x"} color={"green"} />
                  <p style={{ fontSize: '10px' }}>Ready...</p>
                </div>
                :
                deviceStatus==2?
                <div style={{ textAlign: 'center' }}>
                  <FontAwesomeIcon icon={faPhoneSquareAlt} size={"4x"} color={"green"} pulse />
                  {callFrom && <p style={{ fontSize: '10px' }}>{callFrom}</p>}
                </div>
                :
                deviceStatus==3?
                <div style={{ textAlign: 'center' }}>
                  <FontAwesomeIcon icon={faPhoneVolume} size={"4x"} color={"green"} />
                  {callFrom && <p style={{ fontSize: '10px' }}>{callFrom}</p>}
                </div>
                :
                <FontAwesomeIcon icon={faPhoneSlash} size={"4x"} color={"red"} />}
            </span>
            {!isConnected && (
                <div>
                  <button onClick={() => handleConnectAgent()} className="techwave_fn_button">
                    Connect Phone
                  </button>
                </div>
              )}
              {isConnected && currentCall && (
                <div>
                  <button onClick={handleAnswerCall} className="techwave_fn_button">Answer Call</button>
                  <br/>
                  <button onClick={handleHangUp} className="techwave_fn_button">Hang Up</button>
                  {/* <br/>
                  <button onClick={transferCall} className="techwave_fn_button">Transfer Call</button> */}
                  <br/>
                </div>
              )}
              {isConnected && (
                <div>
                  <button onClick={disconnectDevice} className="techwave_fn_button">Disconnect Phone</button>
                  <br/>
                </div>
              )}
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
