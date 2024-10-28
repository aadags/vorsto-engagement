
"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { auth } from "@/firebaseConfig/FirebaseClient";

const Plan = () => {

  const router = useRouter();
  const [user, setUser] = useState();
  const [countryCode, setCountryCode] = useState();
  const [emailKey, setEmailKey] = useState();

  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const pricingTableId = process.env.NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID;

  async function getCountryCode() {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return data.country_code; // Returns the country code, e.g., "US"
  }

  useEffect(() => {

    auth.onAuthStateChanged(async (user) => {
        try {

            const response = await fetch('/api/get-user', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email: user.email }),
            });
      
            if (response.ok) {
              const res = await response.json();
              setUser(res.data);
            } 

          } catch (error) {
            console.log(error);
          }
    });

  }, [router])

  
  useEffect(() => {

    const fetchCc = async () => {
      let cc = user.location || localStorage.getItem("cc");
      if(!cc)
      {
        cc = await getCountryCode();
        localStorage.setItem("cc", cc);
      }
      setCountryCode(cc);
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
    <>
    <div className="techwave_fn_image_generation_page">
        <div className="generation__page">
          {/* Generation Header */}
          <div className="generation_header">
            <div className="header_top">
              <h1 className="title">Choose a Plan</h1>
            </div>
                {emailKey && <stripe-pricing-table pricing-table-id={pricingTableId}
                    publishable-key={publishableKey}
                    client-reference-id={user.id}
                    customer-email={emailKey}
                >
                </stripe-pricing-table>}
           </div>
        </div>
    </div>
    </>
  );
};

export default Plan;
