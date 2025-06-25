"use client"
import Layout from '@/layouts/layout'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Web from '@/components/Web';


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
      {org && <Web org={org} />}
    </Layout>
  )
}
