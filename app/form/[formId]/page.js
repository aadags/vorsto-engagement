"use client"
import DynamicForm from '@/components/DynamicForm'
import React from 'react'


export default function page({ params }) {
  return (
    <DynamicForm formId={params.formId} />
  )
}
