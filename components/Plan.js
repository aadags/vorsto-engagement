
"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { auth } from "@/firebaseConfig/FirebaseClient";

const Plan = () => {

  const router = useRouter();
  const [user, setUser] = useState();

  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const pricingTableId = process.env.NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID;

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
              if(res.data.organizations.plan !== "free")
              {
                router.push(`/billing/${res.data.organizations.stripe_id}`);
              }
            } 

          } catch (error) {
            console.log(error);
          }
    });

  }, [router])

  return (
    <>
    <div className="techwave_fn_image_generation_page">
        <div className="generation__page">
          {/* Generation Header */}
          <div className="generation_header">
            <div className="header_top">
              <h1 className="title">Choose a Plan</h1>
            </div>
                {user && <stripe-pricing-table pricing-table-id={pricingTableId}
                    publishable-key={publishableKey}
                    client-reference-id={user.organizations.id}
                    customer-email={user.email}
                >
                </stripe-pricing-table>}
           </div>
        </div>
    </div>
    </>
  );
};

export default Plan;
