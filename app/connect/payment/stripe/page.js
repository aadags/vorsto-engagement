"use client"
import ConnectStripe from '@/components/ConnectStripe'
import Layout from '@/layouts/layout'
import React from 'react'

export default function page() {
  return (
    <Layout>
      <ConnectStripe />
    </Layout>
  )
}
