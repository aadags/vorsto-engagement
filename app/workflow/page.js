"use client"
import Workflow from '@/components/Workflow'
import Layout from '@/layouts/layout'
import React from 'react'

export default function page() {
  return (
    <Layout leftMenu={true}>
      <Workflow />
    </Layout>
  )
}
