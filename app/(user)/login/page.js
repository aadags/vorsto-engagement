import React from 'react'
import '../../globals.css'
// import '../../../public/css/style.css'
import Signin from '@/components/Signin'

export const metadata = {
  title:'Vorsto AI - Login',
  content:'text/html',
  openGraph: {
    title:'Vorsto AI - Login',
    content:'text/html',
  },
}

export default function page() {
  return (
    <>
      <Signin />
    </>
  )
}
