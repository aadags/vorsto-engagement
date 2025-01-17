"use client"
import Sip from '@/components/Sip'
import Layout from '@/layouts/layout'
import React from 'react'

export default function page() {
  return (
    <Layout leftMenu={true}>
      <Sip />
    </Layout>
  )
}
