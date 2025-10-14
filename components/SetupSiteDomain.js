'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function SetupSiteDomain({ org }) {
  const [mode, setMode] = useState('');
  const [domain, setDomain] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showDNS, setShowDNS] = useState(false);

  // 🧠 Detect if org already has a domain/subdomain configured
  useEffect(() => {
    if (org?.subdomain) {
      setMode('existing');
      setDomain(
        org.subdomain.startsWith('http')
          ? org.subdomain
          : `https://${org.subdomain}`
      );
      setShowDNS(true);
    }
  }, [org]);

  const handleOptionSelect = (option) => {
    setMode(option);
    setSuccess('');
    setError('');
    setShowDNS(false);
    if (option === 'buy') {
      window.open('https://www.namecheap.com/', '_blank');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/update-domain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain }),
      });
      const data = await response.json();

      if (data.status) {
        setSuccess(`Domain saved successfully: ${data.domain}`);
        setShowDNS(true);
      } else {
        setError('An error occurred while saving the domain.');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: '650px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Inter, Arial, sans-serif',
        color: '#333',
      }}
    >
      <h2
        style={{
          textAlign: 'center',
          fontSize: '1.8rem',
          marginBottom: '20px',
          color: '#000',
        }}
      >
        Set Up Your Store Domain
      </h2>

      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <p style={{ fontSize: '1rem', marginBottom: '12px' }}>
          Choose an option below to configure your domain:
        </p>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '12px',
          }}
        >
          <button
            onClick={() => handleOptionSelect('existing')}
            style={{
              backgroundColor: mode === 'existing' ? '#7EFF00' : '#222',
              color: mode === 'existing' ? '#000' : '#fff',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.2s',
            }}
          >
            I already have a domain
          </button>
          <button
            onClick={() => handleOptionSelect('buy')}
            style={{
              backgroundColor: mode === 'buy' ? '#7EFF00' : '#222',
              color: mode === 'buy' ? '#000' : '#fff',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.2s',
            }}
          >
            I want to buy a domain
          </button>
        </div>
      </div>

      {mode === 'existing' && (
        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: '#f9f9f9',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          }}
        >
          <label style={{ fontWeight: 600, display: 'block', marginBottom: '8px' }}>
            Enter your domain name:
          </label>
          <input
            type="text"
            placeholder="www.domain.com"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #ccc',
              borderRadius: '6px',
              marginBottom: '8px',
              fontSize: '1rem',
            }}
          />
          <p
            style={{
              fontSize: '0.9rem',
              color: '#555',
              marginBottom: '16px',
            }}
          >
            Example: <strong>www.domain.com</strong> or <strong>shop.domain.com</strong>
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              backgroundColor: '#000',
              color: '#fff',
              padding: '10px 16px',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 600,
              cursor: 'pointer',
              width: '100%',
              transition: 'opacity 0.2s',
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            {isSubmitting ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin /> Saving...
              </>
            ) : (
              'Save Domain'
            )}
          </button>
        </form>
      )}

      {/* ✅ Show DNS config either on success OR if subdomain exists */}
      {showDNS && (
        <div
          style={{
            marginTop: '24px',
            backgroundColor: '#e8f9ed',
            border: '1px solid #9ee6b0',
            borderRadius: '10px',
            padding: '20px',
          }}
        >
          {success && <p style={{ color: '#1b7a1b', fontWeight: 600 }}>{success}</p>}

          <div style={{ marginTop: success ? '15px' : '0', fontSize: '0.95rem' }}>
            <h4 style={{ fontWeight: 600, marginBottom: '8px' }}>
              DNS Configuration
            </h4>
            <ul style={{ marginLeft: '20px', lineHeight: '1.6' }}>
              <li>
                Add a <strong>CNAME</strong> record:
                <ul style={{ marginLeft: '20px' }}>
                  <li><strong>Host:</strong> www</li>
                  <li><strong>Value:</strong> <code>cname.vercel-dns.com</code></li>
                </ul>
              </li>
              <li style={{ marginTop: '8px' }}>
                Add an <strong>A</strong> record:
                <ul style={{ marginLeft: '20px' }}>
                  <li><strong>host:</strong> @</li>
                  <li><strong>Value:</strong> <code>76.76.21.21</code></li>
                </ul>
              </li>
            </ul>
            <p style={{ marginTop: '8px', color: '#555' }}>
              After updating we will automatically detect the domain and propagate.
            </p>
            <p
              style={{
                marginTop: '14px',
                fontSize: '0.85rem',
                color: '#444',
                textAlign: 'right',
              }}
            >
              Powered by{' '}
              <a
                href="https://vercel.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#000',
                  fontWeight: 600,
                  textDecoration: 'underline',
                }}
              >
                Vercel
              </a>
            </p>
          </div>
        </div>
      )}

      {error && (
        <div
          style={{
            marginTop: '24px',
            backgroundColor: '#fdeaea',
            border: '1px solid #f5a6a6',
            borderRadius: '10px',
            padding: '20px',
          }}
        >
          <p style={{ color: '#b91c1c', fontWeight: 600 }}>{error}</p>
        </div>
      )}
    </div>
  );
}
