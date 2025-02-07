import React from 'react'
import Home2 from '@/components/Home2'
import Layout from '@/layouts/layout'


export const metadata = {
  title:'Home-2',
  content:'text/html',
  openGraph: {
    title:'Home-2',
    content:'text/html',
  },
}

export default function page() {
  return (
    <Layout>
      <Home2 />
    </Layout>
  )
}
