"use client"
import Catalog from '@/components/Catalog'
import Layout from '@/layouts/layout'
import React, { useEffect, useState } from 'react'
import axios from 'axios';

export default function page() {

  const [org, setOrg] = useState();
  const [cat, setCat] = useState();

  const fetchOrg = async () => {
      
    const response = await axios.get(`/api/get-org-details`);
    const org = response.data;
    setOrg(org)
  };

  const fetchCat = async () => {
      
    const response = await axios.get(`/api/get-categories`);
    const cat = response.data;
    setCat(cat)
  };

  useEffect(() => {
    fetchOrg();
    fetchCat();
  }, []);

  return (
    <Layout>
      {org && cat && <Catalog org={org} cat={cat} />}
    </Layout>
  )
}
