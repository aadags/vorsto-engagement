
"use client"
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useRouter, useSearchParams } from 'next/navigation';

const ConnectSquare = () => {

  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code'); 

  useEffect(() => {

    const getMetric = async () => {
        const response = await fetch(`/api/connect-square`, {
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

    if(code) {
      getMetric();
    }

  }, [code])

  return (
    <>
    <div className="techwave_fn_image_generation_page">
        <div className="generation__page">
          {/* Generation Header */}
          <div className="generation_header">

              <h1><FontAwesomeIcon icon={faSpinner} spin={true} /> Loading...</h1>
         
           </div>
        </div>
    </div>
    </>
  );
};

export default ConnectSquare;
