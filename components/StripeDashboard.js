'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

export default function StripeDashboard() {
  const [balance, setBalance] = useState(null)
  const [pending, setPending] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [payouts, setPayouts] = useState([])
  const [selectedTx, setSelectedTx] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get('/api/stripe/dashboard')
      setBalance(res.data.availableBalance)
      setPending(res.data.pendingBalance)
      setTransactions(res.data.transactions)
      setPayouts(res.data.payouts)
    }
    fetchData()
  }, [])

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Payment Dashboard</h1>

      <div className="summary-cards">
        <div className="card">
          <h2>Balance</h2>
          <p>${(balance ?? 0) / 100}</p>
        </div>
        <div className="card">
          <h2>Pending</h2>
          <p>${(pending ?? 0) / 100}</p>
        </div>
        <div className="card">
          <h2>Transactions</h2>
          <p>{transactions.length}</p>
        </div>
        <div className="card">
          <h2>Payouts</h2>
          <p>{payouts.length}</p>
        </div>
      </div>

      <div className="lists">
        <div className="list-section">
          <h3>Transactions</h3>
          <ul className="list">
            {transactions.map(tx => (
              <li key={tx.id} className="list-item" onClick={() => setSelectedTx(tx)}>
                <div className="list-item-row">
                  <span>{tx.description || 'No description'}</span>
                  <span>${(tx.amount - tx.application_fee_amount) / 100}</span>
                </div>
                <div className="list-item-sub">
                  {new Date(tx.created * 1000).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="list-section">
          <h3>Payouts</h3>
          <ul className="list">
            {payouts.map(po => (
              <li key={po.id} className="list-item">
                <div className="list-item-row">
                  <span>Payout #{po.id.slice(-6)}</span>
                  <span>${po.amount / 100}</span>
                </div>
                <div className="list-item-sub">
                  {new Date(po.arrival_date * 1000).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {selectedTx && (
        <div className="modal-overlay" onClick={() => setSelectedTx(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Transaction Details</h2>
            <p><strong>ID:</strong> {selectedTx.id}</p>
            <p><strong>Amount:</strong> ${(selectedTx.application_fee_amount / 100).toFixed(2)}</p>
            <p><strong>Status:</strong> {selectedTx.status}</p>
            <p><strong>Description:</strong> {selectedTx.description || 'N/A'}</p>
            <p><strong>Created:</strong> {new Date(selectedTx.created * 1000).toLocaleString()}</p>
            <button className="close-button" onClick={() => setSelectedTx(null)}>Close</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .dashboard-container {
          padding: 20px;
          max-width: 1200px;
          margin: auto;
          font-family: sans-serif;
        }

        .dashboard-title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
        }

        .summary-cards {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          margin-bottom: 30px;
        }

        .card {
          flex: 1;
          min-width: 200px;
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 0 10px rgba(0,0,0,0.05);
        }

        .card h2 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }

        .card p {
          font-size: 20px;
          margin-top: 8px;
        }

        .lists {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .list-section {
          flex: 1;
          min-width: 300px;
        }

        .list {
          background: #fff;
          border-radius: 10px;
          overflow: hidden;
          max-height: 400px;
          overflow-y: auto;
          box-shadow: 0 0 8px rgba(0,0,0,0.03);
        }

        .list-item {
          padding: 15px;
          border-bottom: 1px solid #eee;
          cursor: pointer;
        }

        .list-item:hover {
          background-color: #f9f9f9;
        }

        .list-item-row {
          display: flex;
          justify-content: space-between;
        }

        .list-item-sub {
          font-size: 12px;
          color: gray;
          margin-top: 5px;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal {
          background: #fff;
          padding: 20px;
          border-radius: 12px;
          width: 100%;
          max-width: 400px;
        }

        .close-button {
          margin-top: 20px;
          color: red;
          background: none;
          border: none;
          cursor: pointer;
          font-weight: bold;
        }

        @media screen and (max-width: 768px) {
          .summary-cards, .lists {
            flex-direction: column;
          }

          .list-section {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}
