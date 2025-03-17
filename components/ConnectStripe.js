
"use client"
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useRouter, useSearchParams } from 'next/navigation';

const ConnectStripe = () => {

  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code'); 

  useEffect(() => {

    const getMetric = async () => {
        const response = await fetch(`/api/connect-stripe`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code })
        });

        if (response.ok) {
          const res = await response.json();
          if(res.status)
          {
            router.push("/integration/payments");
          }
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

              <FontAwesomeIcon icon={faSpinner} spin={true} />
         
           </div>
        </div>
    </div>
    </>
  );
};

export default ConnectStripe;
