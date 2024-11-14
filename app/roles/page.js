"use client"
import Roles from '@/components/Roles'
import Layout from '@/layouts/layout'
import React from 'react'

export default function page() {
  return (
    <Layout leftMenu={true}>
      <Roles />
    </Layout>
  )
}
