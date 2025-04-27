'use client'; // if using Next.js App Router

import { useEffect, useState } from 'react';

export default function SquareDetails() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLocation() {
      try {
        const response = await fetch('/api/square/get-location'); // your backend route
        const data = await response.json();
        setLocation(data);
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

  if (!location) {
    return <div style={{ fontSize: '0.9rem', textAlign: 'center', color: 'red' }}>Failed to load.</div>;
  }

  return (
    <div style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
      <div><strong>Name:</strong> {location.name}</div>
      <div><strong>Country:</strong> {location.country}</div>
      <div><strong>Currency:</strong> {location.currency}</div>
      <div><strong>Status:</strong> {location.status}</div>
    </div>
  );
}
