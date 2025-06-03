'use client'; // if using Next.js App Router

import { useEffect, useState } from 'react';

export default function StripeDetails() {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLocation() {
      try {
        const response = await fetch('/api/stripe/get-account'); // your backend route
        const data = await response.json();
        setBusiness(data);
      } catch (error) {
        console.error('Error fetching location:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchLocation();
  }, []);

  if (loading) {
    return <div style={{ fontSize: '0.9rem', textAlign: 'center' }}>Loading...</div>;
  }

  if (!business) {
    return <div style={{ fontSize: '0.9rem', textAlign: 'center', color: 'red' }}>Failed to load.</div>;
  }

  return (
    <div style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
      <div><strong>Country:</strong> {business.country}</div>
      <div><strong>Currency:</strong> {business.currency}</div>
      <div><strong>Status:</strong> {business.status}</div>
    </div>
  );
}
