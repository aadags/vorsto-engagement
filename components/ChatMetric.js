
"use client"
import { useEffect, useState } from 'react'

const ChatMetric = () => {

  const [iframeUrl, setIframeUrl] = useState();

  useEffect(() => {

    const getMetric = async () => {
        const response = await fetch('/api/get-chat-metric', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          const res = await response.json();
          setIframeUrl(res.iframeUrl);
        } 
    };

    getMetric();

  }, [])

  return (
    <>
    <div className="techwave_fn_image_generation_page">
        <div className="generation__page">
          {/* Generation Header */}
          <div className="generation_header">
          <div className="header_top">
              <h1 className="title">Chat Metrics </h1>
            </div>
            {iframeUrl && <iframe
              src={iframeUrl}
              frameBorder="0"
              allowTransparency="true"
              style={{ border: 'none', width: "100%", height: "100vh" }}
            />}
              
           </div>
        </div>
    </div>
    </>
  );
};

export default ChatMetric;
