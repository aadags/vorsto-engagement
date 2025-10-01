import React, { useState, useEffect } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCancel, faComment, faEye, faEdit, faX } from "@fortawesome/free-solid-svg-icons";
import formatCurrency from "@/utils/formatCurrency";

export default function OrderList({ viewOrder }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [org, setOrg] = useState();

  const columns = [
    {
      name: "Order Id",
      selector: (row) => row.id.slice(-6),
      sortable: true,
    },
    {
      name: "Channel",
      selector: (row) => row.channel,
      sortable: true,
    },
    {
      name: "Payment Id",
      selector: (row) => row.transactionId,
      sortable: true,
    },
    {
      name: "Amount Received",
      selector: (row) => formatCurrency(row.total_price - row.shipping_commission, org?.currency),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (
        <b
          style={{
            color:
              row.status === 'Pending'
                ? 'orange'
                : row.status === 'Preparing'
                ? 'blue'
                : row.status === 'Ready For Shipping'
                ? 'purple'
                : row.status === 'In transit'
                ? 'teal'
                : row.status === 'Delivered'
                ? 'green'
                : 'red',
          }}
        >
          {row.status}
        </b>
      ),
      sortable: true,
    },    
    {
      name: "Created",
      selector: (row) =>
        new Date(row.created_at).toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", paddingBottom: "0.5em", width: "100%" }}>
          <a href="#" onClick={() => viewOrder(row.id)}><FontAwesomeIcon icon={faEye} /> Manage</a>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    }
  ];

  createTheme("dark", {
    background: {
      default: "transparent",
      color: "#000",
    },
  });

  const fetchOrders = async (page) => {
    setLoading(true);

    const response = await axios.get(
      `/api/order/get-list?page=${page}&per_page=${perPage}`
    );

    setData(response.data.data);
    setTotalRows(response.data.count);
    setOrg(response.data.org);
    setLoading(false);
  };

  const handlePageChange = (page) => {
    fetchOrders(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);

    const response = await axios.get(
      `/api/order/get-list?page=${page}&per_page=${perPage}`
    );

    setData(response.data.data);
    setPerPage(newPerPage);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders(1); // fetch page 1 of users
  }, []);

  return (
            <div style={{ width: "100%", margin: "0 auto" }}>
              <DataTable
                title=""
                columns={columns}
                data={data}
                progressPending={loading}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
                theme="light"
              />
            </div>
          
  );
}
