import React from 'react'
import '../../globals.css'
import '../../../public/css/style.css'
import Signup from '@/components/Signup'

export const metadata = {
  title:'Vorsto AI - Sign Up',
  content:'text/html',
  openGraph: {
    title:'Vorsto AI - Sign Up',
    content:'text/html',
  },
}

export default function page() {
  return (
    <>
      <Signup />
    </>
  )
}
