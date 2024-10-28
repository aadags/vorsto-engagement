"use client"
import ManageAgent from '@/components/ManageAgent'
import Layout from '@/layouts/layout'
import React from 'react'


export default function page({ params }) {
  console.log(params)
  return (
    <Layout>
      <ManageAgent agentId={params.agentId} />
    </Layout>
  )
}
