"use client";

import { useEffect, useRef, useState } from 'react';

const CustomerMetric = ({ contactId }) => {
  const [name, setName] = useState('');
  const [sentiment, setSentiment] = useState('');
  const [iframeUrl, setIframeUrl] = useState('');
  const [loyalty, setLoyalty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState([]);
  const [showPlanSelect, setShowPlanSelect] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [cardCode, setCardCode] = useState('');
  const [cardCodeInput, setCardCodeInput] = useState('');
  const [updatingCode, setUpdatingCode] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const [metricRes, loyaltyRes, plansRes] = await Promise.all([
          fetch(`/api/get-contact-metric?contactId=${contactId}`),
          fetch(`/api/get-contact-loyalty?contactId=${contactId}`),
          fetch(`/api/get-membership-plans`)
        ]);

        if (metricRes.ok) {
          const data = await metricRes.json();
          setName(data.name);
          setSentiment(data.sentiment);
          setIframeUrl(data.iframeUrl);
        }

        if (loyaltyRes.ok) {
          const data = await loyaltyRes.json();
          setLoyalty(data);
          setCardCode(data.card_code ?? '');
          setCardCodeInput(data.card_code ?? '');
        }

        if (plansRes.ok) {
          const data = await plansRes.json();
          setPlans(data);
        }
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [contactId]);

  const assignMembership = async () => {
    if (!selectedPlanId) return alert('Please select a membership plan');

    const res = await fetch('/api/assign-loyalty-membership', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contactId, membershipPlanId: selectedPlanId }),
    });

    if (res.ok) {
      const data = await res.json();
      setLoyalty(data);
      setShowPlanSelect(false);
    }
  };

  const cancelMembership = async () => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this membership?");
    if (!confirmCancel) return;
  
    const res = await fetch('/api/cancel-loyalty-membership', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contactId }),
    });
  
    if (res.ok) {
      setLoyalty(null);
    }
  };  

  const updateCardCode = async () => {
    if (!cardCodeInput) return alert("Card code cannot be empty.");
    setUpdatingCode(true);
  
    try {
      const res = await fetch('/api/update-card-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactId, cardCode: cardCodeInput }),
      });
  
      if (res.ok) {
        setCardCode(cardCodeInput);
        alert('Card code updated.');
      } else {
        alert('Failed to update card code');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating card code.');
    } finally {
      setUpdatingCode(false);
    }
  };
  

  // const printCard = async () => {
  //   const domNode = cardRef.current;
  //   if (!domNode) return;

  //   const html2canvas = (await import('html2canvas')).default;

  //   const canvas = await html2canvas(domNode, {
  //     useCORS: true,
  //     backgroundColor: '#fff',
  //     scale: 2,
  //   });

  //   const link = document.createElement('a');
  //   link.download = `${name}-membership-card.png`;
  //   link.href = canvas.toDataURL('image/png');
  //   link.click();
  // };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ marginBottom: '1rem' }}>{name && `${name}'s Dashboard`}</h2>

      {iframeUrl && (
        <iframe
          src={iframeUrl}
          frameBorder="0"
          allowTransparency="true"
          style={{ border: '1px solid #eee', width: '100%', height: '40vh', marginBottom: '1rem' }}
        />
      )}

      {sentiment && (
        <div style={{ marginBottom: '1rem' }}>
          <strong>Summary from the last conversation:</strong>
          <p>{sentiment}</p>
        </div>
      )}

    {!loading && loyalty && (
      <div style={{ marginTop: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div
            ref={cardRef}
            style={{
              background: '#f7f8fa',
              border: '1px solid #ddd',
              borderRadius: '10px',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              maxWidth: '700px',
              margin: 'auto'
            }}
          >
            <div style={{ flex: 1 }}>
              <p style={{ margin: '0.5rem 0' }}>
                Customer: <strong>{name}</strong>
              </p>
              <p style={{ margin: '0.5rem 0' }}>
                Points: <strong>{loyalty.points}</strong>
              </p>
              {loyalty.planName ? (
                <p style={{ margin: '0.5rem 0' }}>
                  Membership: <strong>{loyalty.planName}</strong>
                </p>
              ) : (
                <p style={{ margin: '0.5rem 0', fontStyle: 'italic', color: '#888' }}>
                  No membership assigned
                </p>
              )}
              {cardCode && (
                <div style={{ marginTop: '1rem' }}>
                  <img
                    src={`https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(
                      cardCode
                    )}&scale=3&includetext=true`}
                    alt="Barcode"
                    style={{ maxWidth: '80%', height: 'auto' }}
                  /> 
                </div>
              )}
            </div>
            {/* Add card code form */}
            <div style={{ marginLeft: '2rem', flex: 1 }}>
              <label>
                Update Card Code:
                <input
                  type="text"
                  value={cardCodeInput}
                  onChange={(e) => setCardCodeInput(e.target.value)}
                  placeholder="Enter new card code"
                  style={{
                    marginTop: '0.5rem',
                    width: '100%',
                    padding: '0.5rem',
                    fontSize: '1rem',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                  }}
                />
              </label>
              <button
                onClick={updateCardCode}
                disabled={updatingCode}
                style={{
                  marginTop: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#007bff',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                {updatingCode ? 'Updating...' : 'Save'}
              </button>
            </div>
            
          </div>

          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            {!loyalty.planName && (
              <button
                onClick={() => setShowPlanSelect(!showPlanSelect)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  borderRadius: '5px',
                  marginRight: '1rem'
                }}
              >
                Assign Membership
              </button>
            )}
            {loyalty.planName && (
              <button
                onClick={cancelMembership}
                style={{
                  backgroundColor: '#f44336',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '5px'
                }}
              >
                Cancel Membership
              </button>
            )}
          </div>
        </div>

        {showPlanSelect && (
          <div style={{ textAlign: 'center' }}>
            <label>Select a plan:</label>
            <br />
            <select
              value={selectedPlanId}
              onChange={(e) => setSelectedPlanId(e.target.value)}
              style={{ padding: '0.5rem', marginTop: '0.5rem' }}
            >
              <option value="">-- Choose a plan --</option>
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} (${(plan.price / 100).toFixed(2)})
                </option>
              ))}
            </select>
            <br />
            <button
              onClick={assignMembership}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                background: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Confirm
            </button>
          </div>
        )}
      </div>
    )}

      
    </div>
  );
};

export default CustomerMetric;