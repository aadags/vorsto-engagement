import React, { useState, useEffect } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import axios from "axios";
import formatCurrency from "@/utils/formatCurrency";

export default function CostAnalysis({ org }) {
  const [data, setData]         = useState([]);
  const [loading, setLoading]   = useState(false);
  const [totalRows, setTotal]   = useState(0);
  const [perPage, setPerPage]   = useState(10);
  const [currentPage, setPage]  = useState(1);

  const fetchAnalysis = async (page = 1) => {
    setLoading(true);
    const resp = await axios.get(
      `/api/catalog/get-cost-analysis-list?page=${page}&per_page=${perPage}`
    );
    setData(resp.data.data);
    setTotal(resp.data.count);
    setLoading(false);
  };

  useEffect(() => {
    fetchAnalysis(1);
  }, []);

  const columns = [
    {
      name: "Inventory",
      selector: (r) => r.name,
      sortable: true,
    },
    {
      name: "Cost to Prepare",
      selector: (r) => formatCurrency((r.totalCost * 100), org.currency),
      sortable: true,
    },
    {
      name: "Current Selling Price",
      selector: (r) => formatCurrency((r.salePrice), org.currency),
      sortable: true,
    },
    {
      name: "Current markup",
      selector: (r) => formatCurrency(r.salePrice - (r.totalCost * 100), org.currency),
      sortable: true,
    }
  ];

  createTheme("dark", {
    background: { default: "transparent", color: "#000" },
  });

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
        onChangeRowsPerPage={(newPer, page) => {
          setPerPage(newPer);
          fetchAnalysis(page);
        }}
        onChangePage={(page) => {
          setPage(page);
          fetchAnalysis(page);
        }}
        theme="light"
      />
    </div>
  );
}
