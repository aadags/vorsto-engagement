import Changelog from '@/components/Changelog'
import Layout from '@/layouts/layout'
import React from 'react'

export const metadata = {
  title:'Change Log',
  content:'text/html', 
  openGraph: {
    title:'Change Log',
    content:'text/html', 
  },
}

export default function page() {
  return (
    <Layout>
      <Changelog />
    </Layout>
  )
}
