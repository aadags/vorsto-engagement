'use client'
import React, { useState, useEffect } from 'react';
import { getUser } from '@/services/userService';
import { useRouter } from 'next/navigation';

export default function Settings() {
  const [form, setForm] = useState({ ip: "" });
  const [user, setUser] = useState();
  const [whitelistedIPs, setWhitelistedIPs] = useState([]);
  const [generatedKeys, setGeneratedKeys] = useState([]);
  const [active, setActive] = useState(null);
  const [maskState, setMaskState] = useState({}); // Control the mask/unmask state of each key
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [emailKey, setEmailKey] = useState();

  const router = useRouter();
  const BUY_BTN = process.env.NEXT_PUBLIC_IP_BUY_BTN
  const ENTERPISE_PLAN = process.env.NEXT_PUBLIC_ENTERPRISE_PLAN;
  const PREMIUM_PLAN = process.env.NEXT_PUBLIC_PREMIUM_PLAN;

  const NG_PREMIUM_PLAN = process.env.NEXT_PUBLIC_PAYSTACK_PREMIUM_PLAN;
  const NG_ENTERPRISE_PLAN = process.env.NEXT_PUBLIC_PAYSTACK_ENTERPRISE_PLAN

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const { ip } = form;

  const saveIp = async (ip) => {
    try {
      const response = await fetch('/api/save-ip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ip
        }),
      });

      if (response.ok) {

        await getIps();
        
      } else {
        // Handle error
        setError("An error occurred");
      }
    } catch (error) {
      setError("An error occurred: " + error);
      console.error('Error whitelisting ip:', error);
    }
  };

  const saveKey = async (key) => {
    try {
      const response = await fetch('/api/save-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key
        }),
      });

      if (response.ok) {

        await getKeys();
        
      } else {
        // Handle error
        setError("An error occurred");
      }
    } catch (error) {
      setError("An error occurred: " + error);
      console.error('Error creating key:', error);
    }
  };

  const delIp = async (id) => {
    try {
      const response = await fetch('/api/del-ip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id
        }),
      });

      if (response.ok) {

        await getIps();
        
      } else {
        // Handle error
        setError("An error occurred");
      }
    } catch (error) {
      setError("An error occurred: " + error);
      console.error('Error deleting agent:', error);
    }
  };

  const delKey = async (id, code) => {
    try {
      const response = await fetch('/api/del-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          code
        }),
      });

      if (response.ok) {

        await getKeys();
        
      } else {
        // Handle error
        setError("An error occurred");
      }
    } catch (error) {
      setError("An error occurred: " + error);
      console.error('Error deleting key:', error);
    }
  };

  const getIps = async () => {
    try {
      const response = await fetch('/api/get-ips', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {

        const ips = await response.json();
        setWhitelistedIPs(ips);
        
      } else {
        // Handle error
        setError("An error occurred");
      }
    } catch (error) {
      setError("An error occurred: " + error);
      console.error('Error creating agent:', error);
    }
  };

  const getKeys = async () => {
    try {
      const response = await fetch('/api/get-keys', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {

        const keys = await response.json();
        setGeneratedKeys(keys);

        setMaskState((prevMaskState) => {
          const newMaskState = keys.reduce((acc, key) => {
            return { ...acc, [key.code.toLowerCase()]: true };
          }, {});
        
          return {
            ...prevMaskState,
            ...newMaskState,
          };
        });
        
      } else {
        // Handle error
        setError("An error occurred");
      }
    } catch (error) {
      setError("An error occurred: " + error);
      console.error('Error creating apikey:', error);
    }
  };

  const handleWhitelist = async (e) => {
    e.preventDefault();
    if (ip) {
      await saveIp(ip);
      setForm({ ip: "" });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  function generateRandomString(length) {
    let result = '';
    while (result.length < length) {
        result += Math.random().toString(36).substr(2);
    }
    return result.substr(0, length);
  }

  const handleGenerateApiKey = async () => {
    const newKey = `api_${generateRandomString(32)}`;
    await saveKey(newKey.toLocaleLowerCase());
  };

  const toggleMask = (key) => {
    setMaskState({ ...maskState, [key]: !maskState[key] });
  };

  const deleteApiKey = async (keyToDelete, code) => {
    await delKey(keyToDelete, code);
    const updatedMaskState = { ...maskState };
    delete updatedMaskState[keyToDelete];
    setMaskState(updatedMaskState);
  };

  const deleteIP = async (idToDelete) => {
    await delIp(idToDelete);
  };
  
  async function getCountryCode() {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return data.country_code; // Returns the country code, e.g., "US"
  }

  useEffect(() => {
        
    const fetchData = async () => {
      try {
        await getIps();
        await getKeys();
        const user = await getUser();
        setUser(user);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [])

  useEffect(() => {

    const fetchCc = async () => {
      let cc = user.location || localStorage.getItem("cc");
      if(!cc)
      {
        cc = await getCountryCode();
        localStorage.setItem("cc", cc);
      }
      const split = user.email.split("@");
      const u = split[0] + "+location_"+cc;
      setEmailKey(u+"@"+split[1]);
    }

    if(user)
    {
      fetchCc();
    }

  }, [user])

  return (
    <div className="techwave_fn_contact_page">
      {/* Page Title */}
      <div className="techwave_fn_pagetitle">
        <h2 className="title">Settings</h2>
      </div>
      {/* Whitelist IP Addresses */}
      <div className="contactpage">
        <div className="container small">
          <div className="fn_contact_form">
            <form onSubmit={(e) => handleWhitelist(e)} className="contact_form" id="contact_form" autoComplete="off">
              <div className="input_list">
                <ul>
                  <li className={`input_wrapper ${active === "ip" || ip ? "active" : ""}`}>
                    <input
                      onFocus={() => setActive("ip")}
                      onBlur={() => setActive(null)}
                      onChange={(e) => onChange(e)}
                      value={ip}
                      name="ip"
                      id="ip"
                      type="text"
                      placeholder="IP Address"
                    />
                  </li>
                  <li>
                    <div>
                      <button
                        className="techwave_fn_button"
                        type="submit"
                      >
                        Whitelist IP Address
                      </button>
                    </div>
                  </li>
                </ul>
              </div>
            </form>
          </div>
          {/* List of whitelisted IPs */}
          <div className="fn__space__30" />
          <div>
            <h3>Whitelisted IPs:</h3>
            <ul>
              {whitelistedIPs.map((whiteList, index) => (
                <p key={index} className="list_item">{whiteList.ip_address} <button onClick={() => deleteIP(whiteList.id)}>X</button></p>
              ))}
            </ul>
          </div>

          <hr data-h={2} />
          <div className="fn__space__10" />

          {/* Generate API Key */}
          <div className="fn_contact_form">
            <button
              className="techwave_fn_button"
              type="button"
              onClick={handleGenerateApiKey}
            >
              Generate API Key
            </button>
          </div>

          {/* List of generated API Keys */}
          <div className="fn__space__30" />
            <div className="fn_contact_form">
              <div className="input_list">
                <h3>Generated API Keys:</h3>
                <ul>
                  {generatedKeys.map((key, index) => (
                    <li key={index} className="input_wrapper list_item">
                      <input
                        type={maskState[key.code] ? "password" : "text"}
                        value={key.code}
                        readOnly
                      />
                      <button onClick={() => toggleMask(key.code)}>
                        {maskState[key.code] ? <i className="fa fa-eye"></i> : <i className="fa fa-eye-slash"></i>}
                      </button>
                      <button onClick={() => deleteApiKey(key.id, key.code)}>X</button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
