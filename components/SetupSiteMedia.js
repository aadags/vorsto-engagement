'use client'

import React, { useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

export default function SetupSiteMedia({ org }) {
  const [file, setFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [uploaded, setUploaded] = useState({})
  const fileInputRef = useRef(null)

  const mediaStructure = {
    simple: [],
    'simple-res': [
      {
        landing: '',
        banner: '',
      },
    ],
  }

  const handleImageSubmit = async (e, key) => {
    e.preventDefault()
    if (!file) {
      setMessage('Please select a file.')
      return
    }

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('template', org.template)
    formData.append('key', key)

    const res = await fetch('/api/upload-site-media', {
      method: 'POST',
      body: formData,
    })

    const result = await res.json()

    if (res.ok) {
      setMessage(`Uploaded successfully to key "${key}"`)
      setUploaded((prev) => ({ ...prev, [key]: result.url }))
      if (fileInputRef.current) {
        (fileInputRef.current).value = null
      }
    } else {
      setMessage(result.error || 'Upload failed')
    }

    setIsSubmitting(false)
  }

  return (
    <div className="techwave_fn_image_generation_page">
      <div className="generation__page">
        <div className="generation_header">
          <div className="header_bottom">
            <span style={{ color: 'green' }}>800kb max per image</span>

            {Object.entries(mediaStructure[org.template]?.[0] || {}).map(([key]) => (
              <form key={key} onSubmit={(e) => handleImageSubmit(e, key)} style={{ marginBottom: '1rem' }}>
                <label style={{ fontWeight: 'bold' }}>{key}</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    ref={fileInputRef}
                  />
                  <button type="submit" className="techwave_fn_button" disabled={isSubmitting}>
                    {isSubmitting ? <FontAwesomeIcon icon={faSpinner} spin /> : `Upload ${key}`}
                  </button>
                </div>
                {uploaded[key] && (
                  <div>
                    <img src={uploaded[key]} alt={key} width="200px" />
                  </div>
                )}
              </form>
            ))}

            {message && <p style={{ color: message.includes('successfully') ? 'green' : 'red' }}>{message}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
