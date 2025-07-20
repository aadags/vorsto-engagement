import React, { useState, useEffect } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faCheck,
  faCancel,
} from "@fortawesome/free-solid-svg-icons";

export default function Ingredients({ handleIng }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  // New state
  const [editingId, setEditingId] = useState(null);
  const [restockValue, setRestockValue] = useState("");

  const fetchIngredients = async (page) => {
    setLoading(true);
    const response = await axios.get(
      `/api/catalog/get-ingredients-list?page=${page}&per_page=${perPage}`
    );
    setData(response.data.data);
    setTotalRows(response.data.count);
    setLoading(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchIngredients(page);
  };

  useEffect(() => {
    fetchIngredients(1);
  }, []);

  const handleStartEdit = (id) => {
    setEditingId(id);
    setRestockValue("");
  };

  const handleConfirm = async (row) => {
    const amount = row.unit_type === "unit"
      ? parseInt(restockValue, 10)
      : parseFloat(restockValue);
    if (isNaN(amount) || amount <= 0) return;

    // 2️⃣ Send to your API
    try {
      setLoading(true);
      await axios.post("/api/catalog/restock-ingredient", {
        id: row.id,
        amount,
      });
      // 3️⃣ Re-fetch the ingredients for the current page
      await fetchIngredients(currentPage);
    } catch (err) {
      console.error("Failed to restock:", err);
      // you might show a toast here
    } finally {
      setLoading(false);
      setEditingId(null);
      setRestockValue("");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setRestockValue("");
  };

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Available Stock",
      selector: (row) =>
        row.unit_type === "unit" || row.unit_type === "ml"
          ? `${row.quantity} ${row.unit_type}`
          : `${row.weight_available} ${row.unit_type}`,
      sortable: true,
    },
    {
      name: "Actions",
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      cell: (row) => {
        const isUnit = row.unit_type === "unit";
        const suffix = isUnit ? "units" : row.unit_type;
        return editingId === row.id ? (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input
              type="number"
              step={isUnit ? "1" : "0.01"}
              min="0"
              placeholder={`Enter ${isUnit ? "quantity" : "weight"} (${suffix})`}
              value={restockValue}
              onChange={(e) => setRestockValue(e.target.value)}
              style={{ width: "80px" }}
            />
            <FontAwesomeIcon
              icon={faCheck}
              style={{ cursor: "pointer" }}
              onClick={() => handleConfirm(row)}
            />
            <FontAwesomeIcon
              icon={faCancel}
              style={{ cursor: "pointer" }}
              onClick={handleCancel}
            />
          </div>
        ) : (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleStartEdit(row.id);
            }}
          >
            <FontAwesomeIcon icon={faAdd} /> Restock
          </a>
        );
      },
    },
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
        onChangeRowsPerPage={(newPerPage, page) =>
          fetchIngredients(page).then(() => setPerPage(newPerPage))
        }
        onChangePage={fetchIngredients}
        theme="light"
      />
    </div>
  );
}
