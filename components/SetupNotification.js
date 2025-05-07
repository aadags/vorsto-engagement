'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { getUser } from '@/services/userService'
import { getBots } from '@/services/botService'


export default function SetupNotification() {
  const [name, setName] = useState('');
  const [systemBio, setSystemBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const botData = { name, systemBio };

    try {
      const response = await fetch('/api/update-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(botData),
      });

      if (response.ok) {

        router.push('/notification')
        
      } else {
        // Handle error
        setLoading(false);
        setError("An error occurred");
      }
    } catch (error) {
      setLoading(false);
      setError("An error occurred: " + error);
      console.error('Error creating agent:', error);
    }
  };

  useEffect(() => {
        
    const fetchUser = async () => {
      try {
        const user = await getUser();
        const bots = await getBots();
        console.log({user, bots})
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
  }, [])

  return (
    <>
      <div className="techwave_fn_image_generation_page">
        <div className="generation__page">
          {/* Generation Header */}
          <div className="generation_header">
            <div className="header_top">
              <h1 className="title">Setup Notification</h1>
              <p>Update your preferred contacts for push notifications</p>
            </div>
            <div className="header_bottom">
              <form onSubmit={handleSubmit} style={{ width: "70%" }}>
                <div className="form_group">
                  <input
                    type="text"
                    id="bot_name"
                    className="full_width"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <br/>
                <div className="form_group">
                  <textarea
                    id="system_bio"
                    className="full_width"
                    value={systemBio}
                    onChange={(e) => setSystemBio(e.target.value)}
                    rows={4}
                    placeholder="General information about your agent, what your agent can do"
                    required
                  />
                </div>
                <br/>
                <p className="text-red">{error}</p>
                <br/>
                <div className="generate_section">
                  <button type="submit" className="techwave_fn_button" aria-readonly={loading}><span>Update Contacts {loading && <FontAwesomeIcon icon={faSpinner} spin={true} />}</span></button>
                </div>
              </form>
            </div>
          </div>
          {/* !Generation Header */}
        </div>
      </div>
    </>
  );
}
