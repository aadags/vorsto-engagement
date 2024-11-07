"use client"
import Conversation from '@/components/Conversation'
import Layout from '@/layouts/layout'
import React from 'react'


export default function page({ params }) {
  return (
    <Layout leftMenu={true}>
      <Conversation conversationId={params.conversationId} />
    </Layout>
  )
}
