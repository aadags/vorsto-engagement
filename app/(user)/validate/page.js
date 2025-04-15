import React from 'react'
import '../../globals.css'
import '../../../public/css/style.css'
import Validate from '@/components/Validate'

export const metadata = {
  title:'Vorsto AI - Validate',
  content:'text/html',
  openGraph: {
    title:'Vorsto AI - Validate',
    content:'text/html',
  },
}

export default function page() {
  return (
    <>
      <Validate />
    </>
  )
}
