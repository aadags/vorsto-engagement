"use client"
import Payments from '@/components/Payments'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Layout from '@/layouts/layout'
import OrderTracker from '@/components/OrderTracker';

export default function page() {

  const [org, setOrg] = useState();

  const fetchOrg = async () => {
      
    const response = await axios.get(`/api/get-org-details`);
    const org = response.data;
    setOrg(org)
  };

  useEffect(() => {
    fetchOrg();
  }, []);


  return (
    <>
      {org && <OrderTracker org={org} />}
    </>
  )
}
