'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import '../../globals.css'
import '../../../public/css/style.css'
import Validate from '@/components/Validate'

export default function Page() {
  const router = useRouter()
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkValidation = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/get-user-details')
        const data = await res.json()

        if (data?.is_validated) {
          router.push('/launch')
        }

        setLoading(false)
      } catch (error) {
        console.error('Validation check failed:', error)
        setLoading(false)
      }
    }

    checkValidation()
  }, [])

  return <>{!loading && <Validate />}</>
}
