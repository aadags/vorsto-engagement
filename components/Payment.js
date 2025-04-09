import React from 'react';

const Payment = ({ viewPayment }) => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: '20px', color: '#333', fontSize: '14px' }}>

      {/* Main Details Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Left: Payment Provider and Customer */}
        <div style={{ width: '48%' }}>
            <div>
            <div><strong>Transaction ID</strong><br />{viewPayment.id}</div>
            </div>
          <div style={{ marginTop: '20px', marginBottom: '8px' }}><strong>Customer</strong></div>
          {viewPayment.contact?
            <span>
                <div><strong>Name:</strong>{viewPayment.contact.name}</div>
                <div><strong>Email:</strong>{viewPayment.contact.email}</div>
                <div><strong>Phone:</strong>{viewPayment.contact.phone}</div>
            </span> : 
            <span>
                <div><strong>Name:</strong> Guest</div>
            </span>
            }
        </div>

        {/* Right: Source and Gateway */}
        <div style={{ width: '48%' }}>
            <div>
                <code>{viewPayment.status}</code>
            </div><br/><br/>
            <div><strong>Transaction Date</strong><br />{new Date(viewPayment.createdAt).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
            timeZone: "UTC"
            })}</div><br/>
            <div><strong>Total Amount</strong><br />{(viewPayment.approvedMoney.amount/100)+ " " + viewPayment.approvedMoney.currency}</div>
            <a href={viewPayment.receiptUrl} style={{ fontSize: '12px', color: '#4a90e2' }}>View Receipt</a>
        </div>
      </div>
    </div>
  );
};

export default Payment;
