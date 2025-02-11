import React from 'react'
import '../../globals.css'
import '../../../public/css/style.css'
import ForgotPwd from '@/components/ForgotPwd'

export const metadata = {
  title:'Vorsto AI - Forgot Password',
  content:'text/html',
  openGraph: {
    title:'Vorsto AI - Forgot Password',
    content:'text/html',
  },
}

export default function page() {
  return (
    <>
      <ForgotPwd />
    </>
  )
}
