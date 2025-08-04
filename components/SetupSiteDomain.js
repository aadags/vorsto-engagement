'use client'

import React, { useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

export default function SetupSiteDomain({ org }) {
  const [file, setFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  function slugify(name = '') {
    return name
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '');
  }

  const [domain] = useState('https://'+org.subdomain)

  // const handleSubmit = async (e) => {
  //   setLoading(true);
  //   e.preventDefault();
  //   const data = { domain };

  //   try {
  //     const response = await fetch('/api/update-business-domain', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(data),
  //     });

  //     if (response.ok) {

  //       setLoading(false);
  //       setSuccess("Information updated");
        
  //     } else {
  //       // Handle error
  //       setLoading(false);
  //       setError("An error occurred");
  //     }
  //   } catch (error) {
  //     setLoading(false);
  //     setError("An error occurred: " + error);
  //     console.error('Error creating agent:', error);
  //   }
  // };


  return (
    <div className="techwave_fn_image_generation_page">
      <div className="generation__page">
        <div className="generation_header">
          <div className="header_bottom">
            <p>{domain}</p>
            {domain && <a
                  href={domain}
                  target="_blank"
                  className="techwave_fn_button"
                >
                  <span>
                    See Store Front
                  </span>
                </a>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
