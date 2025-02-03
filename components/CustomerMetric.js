
"use client"
import { useEffect, useState } from 'react'

const CustomerMetric = ({ contactId }) => {

  const [name, setName] = useState();
  const [sentiment, setSentiment] = useState();
  const [iframeUrl, setIframeUrl] = useState();

  useEffect(() => {

    const getMetric = async () => {
        const response = await fetch(`/api/get-contact-metric?contactId=${contactId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          const res = await response.json();
          setName(res.name);
          setSentiment(res.sentiment);
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
              {name && <h1 className="title">{name} Dashboard</h1>}
            </div>

            {iframeUrl && <iframe
              src={iframeUrl}
              frameBorder="0"
              allowTransparency="true"
              style={{ border: 'none', width: "100%", height: "38vh" }}
            />}
              
           <div className="header_bottom">
             <p>Summary from the last conversation</p>
             {sentiment && <p>{sentiment}</p>}
           </div>
           </div>
        </div>
    </div>
    </>
  );
};

export default CustomerMetric;
