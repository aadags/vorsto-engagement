'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import '../../globals.css'
import '../../../public/css/style.css'
import Validate from '@/components/Validate'

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    const checkValidation = async () => {
      try {
        const res = await fetch('/api/get-user-details')
        const data = await res.json()

        if (data?.is_validated) {
          router.push('/launch')
        }
      } catch (error) {
        console.error('Validation check failed:', error)
      }
    }

    checkValidation()
  }, [router])

  return <Validate />
}
