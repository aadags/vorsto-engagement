"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import formatCurrency from "@/utils/formatCurrency";

export default function OrderTracker({ org }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  // ✅ Fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    const res = await axios.get(`/api/order/get-new-orders`);
    setOrders(res.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
    // ⏱️ Auto-refresh every 5 minutes
    const interval = setInterval(fetchOrders, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const updateOrder = async (url, id) => {
    if (url === "/api/order/pickup-order") {
      if (!window.confirm("Confirm this action?")) return;
    }
    setProcessing(id);
    try {
      const res = await axios.get(`${url}?id=${id}`);
      if (res.data.status) fetchOrders();
    } catch (err) {
      console.error("Order update failed", err);
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="orders-container">
      <div className="header">
        <button className="back-btn" onClick={() => window.history.back()}>
          ⬅ Back
        </button>
        <h2>📦 Incoming Orders</h2>
      </div>

      {loading && <p className="loading">Loading orders...</p>}

      <div className="orders-grid">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <span className="order-id">#{order.id.slice(-6)}</span>
              <span className={`badge ${order.status.toLowerCase().replace(/\s+/g, "-")}`}>
                {order.status}
              </span>
            </div>

            <p className="datetime">
              {new Date(order.created_at).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>

            <div className="customer">
              <strong>{order.contact?.name}</strong>
              <br />
              {order.contact?.phone}
            </div>

            {!order.pickup && order.address && (
              <p className="address">{order.address}</p>
            )}
            {order.pickup && <p className="address">Pickup in Store</p>}

            <div className="items">
              {order.order_items.map((item, idx) => (
                <div key={idx} className="item">
                  <img
                    src={item.inventory.product.image || "/no-image.jpg"}
                    alt={item.inventory.product.name}
                  />
                  <div>
                    <div>{item.inventory.product.name}</div>
                    <small>
                      Qty: {item.quantity}{" "}
                      {item.price_unit !== "unit" && item.price_unit}
                    </small>
                  </div>
                  <div className="price">
                    {formatCurrency(item.price, org.currency)}
                  </div>
                </div>
              ))}
            </div>

            <div className="totals">
              <span>Total:</span>
              <b>{formatCurrency(order.total_price, org.currency)}</b>
            </div>

            <div className="actions">
              {order.status === "Pending" && (
                <button
                  className="btn accept"
                  disabled={processing === order.id}
                  onClick={() =>
                    updateOrder("/api/order/accept-order", order.id)
                  }
                >
                  {processing === order.id ? "Processing..." : "Accept"}
                </button>
              )}
              {order.status === "Preparing" && (
                <button
                  className="btn ship"
                  disabled={processing === order.id}
                  onClick={() =>
                    updateOrder("/api/order/ship-order", order.id)
                  }
                >
                  {processing === order.id ? "Processing..." : "Ready to Ship"}
                </button>
              )}
              {order.status === "Ready For Pickup" && (
                <button
                  className="btn deliver"
                  disabled={processing === order.id}
                  onClick={() =>
                    updateOrder("/api/order/pickup-order", order.id)
                  }
                >
                  {processing === order.id ? "Processing..." : "Mark Delivered"}
                </button>
              )}
              {order.status === "Ready For Shipping" && (
                <p className="pickup-note">
                  To be picked up by driver <br />
                  Pickup code:{" "}
                  <b className="pickup-code">
                    {order.shipping_id?.slice(-5)}
                  </b>
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .orders-container {
          padding: 1rem;
          font-family: system-ui, sans-serif;
          background: #000; /* 🔥 Black background */
          min-height: 100vh;
          color: #fff;
        }
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        .back-btn {
          background: #fff;
          color: #000;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
        }
        h2 {
          margin: 0;
          color: #fff;
        }
        .loading {
          color: #ddd;
        }
        .orders-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 1rem;
        }
        .order-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 1rem;
          background: #fff; /* keep cards white */
          color: #000; /* ensure card text is dark */
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .order-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }
        .order-id {
          font-weight: bold;
          color: #333;
        }
        .badge {
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: capitalize;
        }
        .badge.pending {
          background: #fff3cd;
          color: #856404;
        }
        .badge.preparing {
          background: #cce5ff;
          color: #004085;
        }
        .badge.ready-for-shipping {
          background: #e2d9f3;
          color: #4b0082;
        }
        .badge.ready-for-pickup {
          background: #d1ecf1;
          color: #0c5460;
        }
        .badge.delivered {
          background: #d4edda;
          color: #155724;
        }
        .badge.cancelled {
          background: #f8d7da;
          color: #721c24;
        }

        .datetime {
          font-size: 0.8rem;
          color: #666;
        }
        .customer {
          margin: 0.5rem 0;
          font-size: 0.9rem;
        }
        .address {
          font-size: 0.85rem;
          color: #444;
        }
        .items {
          border-top: 1px solid #eee;
          margin-top: 0.5rem;
          padding-top: 0.5rem;
        }
        .item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 0.3rem 0;
        }
        .item img {
          width: 40px;
          height: 40px;
          border-radius: 4px;
          object-fit: cover;
          margin-right: 0.5rem;
        }
        .price {
          font-weight: 600;
          font-size: 0.9rem;
        }
        .totals {
          display: flex;
          justify-content: space-between;
          font-size: 1rem;
          margin-top: 0.8rem;
          padding-top: 0.5rem;
          border-top: 1px solid #eee;
        }
        .actions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 1rem;
        }
        .btn {
          padding: 0.5rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          color: #fff;
        }
        .btn.accept {
          background: orange;
        }
        .btn.ship {
          background: #007bff;
        }
        .btn.deliver {
          background: green;
        }
        .btn:hover:not(:disabled) {
          opacity: 0.9;
        }
        .btn:disabled {
          background: #ccc;
          color: #666;
          cursor: not-allowed;
          opacity: 0.7;
        }

        .pickup-note {
          font-size: 0.9rem;
          color: #333;
          margin-top: 0.5rem;
          background: #fff3cd;
          padding: 0.5rem;
          border-radius: 6px;
        }
        .pickup-code {
          color: red;
          font-size: 1rem;
        }
        @media (max-width: 500px) {
          .order-card {
            padding: 0.8rem;
          }
          .actions button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}