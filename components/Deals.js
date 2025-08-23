import React, { useState, useEffect } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCancel, faAdd, faEye, faEdit, faX } from "@fortawesome/free-solid-svg-icons";
import formatCurrency from "@/utils/formatCurrency";

export default function Deals({ org, handleEditDeal, setShowAddForm }) {
  const [data, setData]         = useState([]);
  const [loading, setLoading]   = useState(false);
  const [totalRows, setTotal]   = useState(0);
  const [perPage, setPerPage]   = useState(10);
  const [currentPage, setPage]  = useState(1);

  const fetchDeals = async (page = 1) => {
    setLoading(true);
    const resp = await axios.get(
      `/api/catalog/get-deals-list?page=${page}&per_page=${perPage}`
    );
    setData(resp.data.data);
    setTotal(resp.data.count);
    setLoading(false);
  };

  useEffect(() => {
    fetchDeals(1);
  }, [handleEditDeal]);

  const columns = [
    {
      name: "Title",
      selector: (r) => r.title,
      sortable: true,
    },
    {
      name: "Type",
      selector: (r) => r.type,
      sortable: true,
    },
    {
      name: "Discount",
      selector: (r) => r.discountType,
      sortable: true,
    },
    {
      name: "Status",
      selector: (r) => r.isActive ? "✅ Active" : "❌ In active",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", paddingBottom: "0.5em", width: "100%" }}>
          <a href="#" onClick={() => handleEditDeal(row.id, row.title)}><FontAwesomeIcon icon={faEye} /> Manage Deal</a>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    }
  ];

  createTheme("dark", {
    background: { default: "transparent", color: "#000" },
  });

  return (
    <div style={{ width: "100%", margin: "0 auto" }}>

      <div style={{ marginBottom: "1em", textAlign: "right" }}>
          <button
            onClick={() => setShowAddForm(true)}
            style={{ padding: "0.5em 1em" }}
          >
            <FontAwesomeIcon icon={faAdd} /> Add Deal
          </button>
      </div>

      <DataTable
        title=""
        columns={columns}
        data={data}
        progressPending={loading}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        onChangeRowsPerPage={(newPer, page) => {
          setPerPage(newPer);
          fetchDeals(page);
        }}
        onChangePage={(page) => {
          setPage(page);
          fetchDeals(page);
        }}
        theme="light"
      />
    </div>
  );
}
