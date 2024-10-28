import UserBilling from '@/components/UserBilling'
import Layout from '@/layouts/layout'
import React from 'react'

export const metadata = {
  title:'User Billing',
  content:'text/html',
  openGraph: {
    title:'User Billing',
    content:'text/html',
  },
}

export default function page() {
  return (
    <Layout>
      <UserBilling />
    </Layout>
  )
}
