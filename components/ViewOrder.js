import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import formatCurrency from "@/utils/formatCurrency";
import { useStripeConnect } from "../hooks/useStripeConnect";
import {
  ConnectPaymentDetails,
  ConnectComponentsProvider,
} from "@stripe/react-connect-js";

const ViewOrder = ({ orderId }) => {
  const router = useRouter();

  const [org, setOrg] = useState();
  const [order, setOrder] = useState();
  const [connectedAccountId, setConnectedAccountId] = useState();
  const stripeConnectInstance = useStripeConnect(connectedAccountId);
  const [visible, setVisible] = useState(false);
  const onOpen = () => { 
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

const fetchOrg = async () => {
      
    const response = await axios.get(`/api/get-org-details`);
    const org = response.data;
    setConnectedAccountId(org.stripe_account_id);
};

const fetchOrder = async (id) => {
    
    const response = await axios.get(
    `/api/order/get-order?id=${id}`
    );

    return response.data;
};

const acceptOrder = async (id) => {

  if (!window.confirm('Do you want to accept and proceed with this order?')) {
    return
  }
    
  const response = await axios.get(
  `/api/order/accept-order?id=${id}`
  );

  if(response.data.status){
      const order = await fetchOrder(orderId);
      setOrder(order);
  };
};

const shipOrder = async (id) => {

  if (!window.confirm('Do you want to proceed to shipping this order?')) {
    return
  }
    
  const response = await axios.get(
  `/api/order/ship-order?id=${id}`
  );

  if(response.data.status){
      const order = await fetchOrder(orderId);
      setOrder(order);
  };
};

useEffect(() => {
  fetchOrg();
  if (orderId) {
    const fetchData = async () => {
      try {
        const order = await fetchOrder(orderId);
        setOrder(order);
  
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };

    fetchData();
  }
}, [orderId]);


  return (
    <div className="form_container" style={{ width: "70%" }}>
      

      {order && <form>
        {/* Product Name */}
        <div
          className="form_group"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: "1.5rem",
            fontSize: "clamp(0.9rem, 2.2vw, 1rem)",
            marginBottom: "1.5rem",
          }}
        >
          {/* Left Column */}
          <div style={{ flex: "1 1 300px", minWidth: "250px" }}>
            <h6>
              <code>Order ID: {order.id}</code>
            </h6>
            <br/>
            <h6>
              Order Date & Time:<b>{" "}
              {new Date(order.created_at).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })}</b>
            </h6>
            <br/>
            <h6>Transaction ID: <a href onClick={onOpen} style={{ color: "blue" }}>{order.stripeTransactionId}</a></h6>
            {stripeConnectInstance && (<ConnectComponentsProvider connectInstance={stripeConnectInstance}>
              {visible && <ConnectPaymentDetails
                payment={order.stripeTransactionId}
                onClose={onClose}
              />}
            </ConnectComponentsProvider>)}
          </div>

          {/* Right Column */}
          <div style={{ flex: "1 1 300px", minWidth: "250px" }}>
            <h6>
              <code>Customer Information</code>
            </h6>
            <h6>
              Name: <b>Ayoola Adagunodo</b>
            </h6>
            <h6>
              Email: <b>aadags@yahoo.com</b>
            </h6>
            <h6>
              Phone: <b>6049064701</b>
            </h6>
            <h6>
              Delivery Address: <b>15082 60 Avenue, Surrey, BC</b>
            </h6>
          </div>
        </div>

        {/* Status & Total */}
        <div
          className="form_group"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            fontSize: "clamp(0.9rem, 2.2vw, 1rem)",
          }}
        >
          <div style={{ flex: "1 1 200px" }}>
          <h6>
            Status:{' '}
            <b
              style={{
                color:
                  order.status === 'Pending'
                    ? 'orange'
                    : order.status === 'Preparing'
                    ? 'blue'
                    : order.status === 'Ready For Shipping'
                    ? 'purple'
                    : order.status === 'In transit'
                    ? 'teal'
                    : order.status === 'Delivered'
                    ? 'green'
                    : 'black',
              }}
            >
              {order.status}
            </b>
          </h6>

          {order.status == "Pending" && <button type="button" onClick={() => acceptOrder(order.id)} className="techwave_fn_button">
              Accept Order
          </button>}
          {order.status == "Preparing" && <button type="button" onClick={() => shipOrder(order.id)} className="techwave_fn_button">
              Ready For Shipping
          </button>}
          {order.status == "Ready For Shipping" && <h6><b>To be picked up by delivery personel</b></h6>}

          </div>
          <div style={{ flex: "1 1 200px" }}>
            <h6>
              Total Paid:{" "}
              <b>{formatCurrency(order.total_price, order.org.currency)}</b>
            </h6>
          </div>
        </div>

      
        <br/>
        <hr/>
        <h6><b>Order Items</b></h6>
        <br/>
        {order.order_items.map((o, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
              padding: "0.75rem 0",
              width: "100%",
              borderBottom: "1px solid #eee",
              fontSize: "clamp(0.875rem, 2.2vw, 1rem)",
            }}
          >
            <img
              src={o.inventory.product.images[0].url}
              alt={`Product ${idx}`}
              style={{
                width: "50px",
                height: "auto",
                borderRadius: "4px",
                objectFit: "cover",
                flexShrink: 0,
              }}
            />
            <div style={{ flex: "1 1 150px" }}>{o.inventory.product.name}</div>
            <div style={{ flex: "1 1 120px" }}>{o.inventory.name}</div>
            <div style={{ flex: "1 1 100px" }}>Qty: {o.quantity}</div>
            <div style={{ flex: "1 1 160px" }}>
              Charge: {formatCurrency(o.price, order.org.currency)}{" "}
              <sup style={{ fontSize: "0.75em" }}>
                +{formatCurrency(o.tax, order.org.currency)} tax
              </sup>
            </div>
          </div>
        ))}

    
      <br />
      {order.status == "Pending" && (
        <button
          type="button"
          style={{
            backgroundColor: 'red',
            color: 'white',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Cancel & Refund Order
        </button>
      )}

      <br />

      </form>}

    
    </div>
  );
};

export default ViewOrder;
