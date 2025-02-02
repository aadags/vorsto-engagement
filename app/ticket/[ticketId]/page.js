"use client"
import ManageTicket from '@/components/ManageTicket'
import Layout from '@/layouts/layout'
import React from 'react'

export default function page({ params }) {
  return (
    <Layout>
      <ManageTicket ticketId={params.ticketId} />
    </Layout>
  )
}
