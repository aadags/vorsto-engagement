"use client"
import Order from '@/components/Order'
import Layout from '@/layouts/layout'
import React, { useEffect, useState } from 'react'
import axios from 'axios';

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
      {org && <Order org={org} />}
    </Layout>
  )
}
