
"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { auth } from "@/firebaseConfig/FirebaseClient";

const CallMetric = () => {

  const [iframeUrl, setIframeUrl] = useState();

  useEffect(() => {

    const getMetric = async () => {
        const response = await fetch('/api/get-call-metric', {
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

export default CallMetric;
