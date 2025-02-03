"use client"
import CustomerMetric from '@/components/CustomerMetric'
import Layout from '@/layouts/layout'
import React from 'react'

export default function page({ params }) {
  return (
    <Layout>
      <CustomerMetric contactId={params.contactId} />
    </Layout>
  )
}
