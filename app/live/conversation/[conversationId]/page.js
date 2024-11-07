"use client"
import MyConversation from '@/components/MyConversation'
import Layout from '@/layouts/layout'
import React from 'react'

export default function page({ params }) {
  return (
    <Layout leftMenu={true}>
      <MyConversation conversationId={params.conversationId} />
    </Layout>
  )
}
