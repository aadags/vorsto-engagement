import Terms from '@/components/Terms'
import Layout from '@/layouts/layout'
import React from 'react'

export const metadata = {
  title:'Terms',
  content:'text/html',
  openGraph: {
    title:'Terms',
    content:'text/html',
  },
}

export default function page() {
  return (
    <Layout>
      <Terms />
    </Layout>
  )
}
