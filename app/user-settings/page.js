import UserSettings from '@/components/UserSettings'
import Layout from '@/layouts/layout'
import React from 'react'

export const metadata = {
  title:'User Settings',
  content:'text/html',
  openGraph: {
    title:'User Settings',
    content:'text/html',
  },
}

export default function page() {
  return (
    <Layout>
      <UserSettings />
    </Layout>
  )
}
