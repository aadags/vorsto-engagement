"use client"
import PaymentIntegration from '@/components/PaymentIntegration'
import Layout from '@/layouts/layout'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import StripeDashboard from '@/components/StripeDashboard';


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
    <Layout>
      {org && (org.paymentProcessor? <StripeDashboard /> : <PaymentIntegration org={org} />)}
    </Layout>
  )
}
