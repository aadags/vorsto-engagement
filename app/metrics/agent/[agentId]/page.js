"use client"
import AgentMetric from '@/components/AgentMetric'
import Layout from '@/layouts/layout'
import React from 'react'

export default function page({ params }) {
  return (
    <Layout>
      <AgentMetric agentId={params.agentId} />
    </Layout>
  )
}
