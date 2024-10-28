"use client"
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from "../../../firebaseConfig/FirebaseClient";


export default function Logout() {
  const router = useRouter();
  useEffect(() => {
    auth.signOut();
    router.push('/login');
     
  }, [router]);

  return (
    <>
    </>
  )
}
