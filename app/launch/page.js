import React from 'react'
import Home2 from '@/components/Home2'
import Layout from '@/layouts/layout'


export const metadata = {
  title:'Vorsto AI - LaunchPad',
  content:'text/html',
  openGraph: {
    title:'Vorsto AI - LaunchPad',
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
