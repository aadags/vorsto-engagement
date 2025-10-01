"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from "next/navigation";
import Home2 from '@/components/Home2'
import Layout from '@/layouts/layout3'
import axios from 'axios';


export default function page() {
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const fetchOrg = async () => {
    setLoading(true)
      
    const response = await axios.get(`/api/get-org-details`);
    const org = response.data;
    if(org.onboarding){
      router.push('/');
    }
    setLoading(true)
  };

  useEffect(() => {
    fetchOrg();
  }, []);

  return (<>
    {!loading && (<Layout>
      <Home2 />
    </Layout>)}
  </>)
}
