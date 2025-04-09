import React, { useState, useEffect, useMemo } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import axios from "axios";
import Link from 'next/link'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

export default function PaymentsList({ handlePayment }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const [cursorStack, setCursorStack] = useState([]); // stores previous cursors
  const [currentCursor, setCurrentCursor] = useState(null);
  const [prevCursor, setPrevCursor] = useState(null);
  const [nextCursor, setNextCursor] = useState(null);

  const formatLocalDate = (date) => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().split('T')[0];
  };

  const end = new Date(); // today
    const start = new Date();
    start.setMonth(start.getMonth() - 1); // one month ago

  const [startDate, setStartDate] = useState(formatLocalDate(start));
  const [endDate, setEndDate] = useState(formatLocalDate(end));

  const columns = [
    {
      name: "Customer",
      selector: (row) => row?.contact?.name || "Guest",
      sortable: true,
    },
    {
      name: "Transaction Date",
      selector: (row) =>
        new Date(row.createdAt).toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
          timeZone: "UTC"
        }),
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row) => (row.approvedMoney.amount/100)+ " " + row.approvedMoney.currency,
      sortable: true,
    },
    {
      name: "Receipt",
      selector: (row) => (<a href={row.receiptUrl} style={{ color: "blue" }}>{row.receiptNumber}</a>),
      sortable: false,
    },
    {
      name: "Status",
      selector: (row) => (
        <div>
          <code>{row.status}</code>
        </div>
      ),
      sortable: true,
    },
    {
      name: 'Actions',
      cell: row => (
          <div>
              <a href="#" onClick={() => handlePayment(row.id)}><FontAwesomeIcon icon={faEye} /> Details</a><br/>
          </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
    },
  ];

  createTheme("dark", {
    background: {
      default: "transparent",
      color: "#000",
    },
  });

  const fetchPayments = async (cursor = null, direction = "next") => {
    setLoading(true);
  
    const response = await axios.get(
      `/api/integration/payments/get-payments-history?from=${startDate}&to=${endDate}${cursor ? `&cursor=${cursor}` : ""}&per_page=${perPage}`
    );
  
    setData(response.data.payments);
  
    // Update cursors
    if (direction === "next") {
      setCursorStack((prev) => [...prev, currentCursor]); // push currentCursor to stack
    } else if (direction === "prev") {
      setCursorStack((prev) => prev.slice(0, -1)); // pop from stack
    }
  
    setPrevCursor(nextCursor);
    setCurrentCursor(cursor);
    setNextCursor(response.data.cursor || null);
  
    setLoading(false);
  };

  const handleNext = () => {
    if (nextCursor) {
      fetchPayments(nextCursor, "next");
    }
  };
  
  const handlePrevious = () => {
    const previousCursor = cursorStack[cursorStack.length - 1];
    if (previousCursor) {
      fetchPayments(previousCursor, "prev");
    } else {
      // If there's no previous cursor, you might want to go back to the first page
      fetchPayments(null, "prev");
    }
  };
  

  useEffect(() => {

    fetchPayments(); // fetch page 1 of users
  }, []);


  return (
            <div style={{ width: "100%", margin: "0 auto" }}>
              <div className="container">
                        <div className="models__filter">
                            <div className="filter__left">
                                <div className="filter__search">
                                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                                    <button type="button" onClick={() => fetchPayments()} className="techwave_fn_button"><span>Search</span></button>
                                </div>
                            </div>
                        </div>
                    </div>
              <DataTable
                title="Payments"
                columns={columns}
                data={data}
                progressPending={loading}
                
                theme="light"
              />
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                {prevCursor && (
                  <button 
                    type="button" 
                    onClick={handlePrevious} 
                    className="techwave_fn_button"
                  >
                    Previous Page
                  </button>
                )}

                {nextCursor && (
                  <button 
                    type="button" 
                    onClick={handleNext} 
                    className="techwave_fn_button"
                  >
                    Next Page
                  </button>
                )}
              </div>

            </div>
  );
}
