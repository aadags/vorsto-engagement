"use client"
import WebChat from '@/components/WebChat'
import Layout from '@/layouts/layout'
import React from 'react'


export default function page() {
  return (
    <Layout leftMenu={true}>
      <WebChat />
    </Layout>
  )
}
