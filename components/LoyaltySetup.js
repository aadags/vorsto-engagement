'use client'
import { useEffect, useState } from 'react'

export default function LoyaltySetup() {
  const [loyaltyProgram, setLoyaltyProgram] = useState({
    name: '',
    point_rate: 1,
    redeem_rate: 100,
  });

  const [membershipPlans, setMembershipPlans] = useState([
    { name: '', price: 10, duration_days: 30, benefits: '' }
  ]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/loyalty/setup');
      if (!res.ok) return;

      const data = await res.json();
      if (data.loyaltyProgram) setLoyaltyProgram(data.loyaltyProgram);
      if (data.membershipPlans?.length > 0) setMembershipPlans(data.membershipPlans);
    }

    fetchData();
  }, []);

  const addMembershipPlan = () => {
    setMembershipPlans([...membershipPlans, { name: '', price: 1000, duration_days: 30, benefits: '' }]);
  };

  const updatePlan = (index, field, value) => {
    const newPlans = [...membershipPlans];
    newPlans[index][field] = field === 'price' || field === 'duration_days' ? +value : value;
    setMembershipPlans(newPlans);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch('/api/loyalty/setup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ loyaltyProgram, membershipPlans }),
    });

    if (res.ok) alert('Loyalty setup saved!');
    else alert('Error setting up loyalty');
  }

  return (
    <div className="container">
      <h2>Loyalty & Membership Setup</h2>
      <form onSubmit={handleSubmit}>
        <section className="card">
          <h3>Loyalty Points Program</h3>
          <div className="form-group">
            <label>Program Name</label>
            <input type="text" value={loyaltyProgram.name}
              onChange={e => setLoyaltyProgram({ ...loyaltyProgram, name: e.target.value })} />
          </div>

          <div className="form-group">
            <label>Point Rate (e.g. 1 pt per $)</label>
            <input type="number" value={loyaltyProgram.point_rate}
              onChange={e => setLoyaltyProgram({ ...loyaltyProgram, point_rate: +e.target.value })} />
          </div>

          <div className="form-group">
            <label>Redeem Rate (e.g. 100 pts = $1)</label>
            <input type="number" value={loyaltyProgram.redeem_rate}
              onChange={e => setLoyaltyProgram({ ...loyaltyProgram, redeem_rate: +e.target.value })} />
          </div>
        </section>

        <section className="card">
          <h3>Membership Plans</h3>
          {membershipPlans.map((plan, index) => (
            <div key={index} className="plan-block">
              <div className="form-group">
                <label>Plan Name</label>
                <input type="text" value={plan.name}
                  onChange={e => updatePlan(index, 'name', e.target.value)} />
              </div>

              <div className="form-group">
                <label>Price</label>
                <input type="number" value={plan.price}
                  onChange={e => updatePlan(index, 'price', e.target.value)} />
              </div>

              <div className="form-group">
                <label>Duration (in days)</label>
                <input type="number" value={plan.duration_days}
                  onChange={e => updatePlan(index, 'duration_days', e.target.value)} />
              </div>

              <div className="form-group">
                <label>Benefits</label>
                <textarea value={plan.benefits}
                  onChange={e => updatePlan(index, 'benefits', e.target.value)} />
              </div>

              <hr />
            </div>
          ))}

          <button type="button" className="techwave_fn_button" onClick={addMembershipPlan}>
            + Add Another Plan
          </button>
        </section>

        <button className="techwave_fn_button" type="submit">Save Settings</button>
      </form>

      <style>{`
        .container {
          max-width: 800px;
          margin: auto;
          padding: 24px;
        }

        h2 {
          text-align: center;
          margin-bottom: 32px;
          font-size: 24px;
        }

        .card {
          background-color: #f7f7f7;
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 24px;
          margin-bottom: 24px;
        }

        .plan-block {
          margin-bottom: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          margin-bottom: 16px;
        }

        label {
          font-weight: 600;
          margin-bottom: 6px;
        }

        input, textarea {
          padding: 10px;
          font-size: 16px;
          border-radius: 4px;
          border: 1px solid #ccc;
        }

        textarea {
          resize: vertical;
          min-height: 80px;
        }

        button {
          background-color: black;
          color: white;
          padding: 14px;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          width: 100%;
          cursor: pointer;
          margin-top: 20px;
        }

        .secondary {
          background-color: #eee;
          color: black;
          font-weight: bold;
          margin-top: 10px;
        }

        button:hover {
          background-color: #222;
        }

        @media (max-width: 600px) {
          .card {
            padding: 16px;
          }
          h2 {
            font-size: 20px;
          }
          input, textarea {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  )
}
