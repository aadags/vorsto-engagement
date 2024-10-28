"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCustomerBilling } from '@/services/stripeService';
import { auth } from "@/firebaseConfig/FirebaseClient";

export default function Billing({ params }) {
  const router = useRouter();

  useEffect(() => {

    const fetchAndRedirect = async () => {
      try {
        auth.onAuthStateChanged(async (user) => {
          if (!user) {
            router.push('/login'); 
          } else {
            const session = await getCustomerBilling(params.id);
            const url = session.url;
            window.location.href = url;
          }
        });
      } catch (error) {
        console.error("Failed to fetch the billing URL:", error);
      }
    };

    fetchAndRedirect();
  }, [router]);

  return null;
}
