"use client"
import Users from '@/components/Users'
import Layout from '@/layouts/layout'
import React from 'react'

export default function page() {
  return (
    <Layout leftMenu={true}>
      <Users />
    </Layout>
  )
}
