import React, { useState, useEffect } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faCheck,
  faCancel,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

export default function Ingredients({ handleIng }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Restock state
  const [editingId, setEditingId] = useState(null);
  const [restockValue, setRestockValue] = useState("");
  const [restockPrice, setRestockPrice] = useState("");

  // Add-ingredient form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newIng, setNewIng] = useState({
    name: "",
    unit_type: "unit",
    quantity: "",
    weight_available: "",
  });

  // Fetch list
  const fetchIngredients = async (page = 1) => {
    setLoading(true);
    const resp = await axios.get(
      `/api/catalog/get-ingredients-list?page=${page}&per_page=${perPage}`
    );
    setData(resp.data.data);
    setTotalRows(resp.data.count);
    setLoading(false);
  };

  useEffect(() => {
    fetchIngredients(1);
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchIngredients(page);
  };

  // === Restock Handlers ===
  const handleStartEdit = (row) => {
    setEditingId(row.id);
  };

  const handleConfirm = async (row) => {
    const isUnit = row.unit_type === "unit";
    const isVol = row.unit_type === "ml";
    const amount = isUnit || isVol
      ? parseInt(restockValue)
      : parseFloat(restockValue);

    const price = parseFloat(restockPrice);
    const unitPrice = parseFloat(price / amount)

    try {
      setLoading(true);
      await axios.post("/api/catalog/restock-ingredient", {
        id: row.id,
        amount,
        price: unitPrice,
      });
      await fetchIngredients(currentPage);
    } catch (err) {
      console.error("Failed to restock:", err);
    } finally {
      setLoading(false);
      setEditingId(null);
      setRestockValue("");
    }
  };

  const deleteRow = async (id) => {
    // 1) Ask for confirmation
    const ok = window.confirm("Are you sure you want to delete this ingredient? It will be removed from every product it is used in!");
    if (!ok) return; // user canceled
  
    try {
      setLoading(true);
      await axios.post("/api/catalog/delete-ingredient", { id });
      await fetchIngredients(currentPage);
    } catch (err) {
      console.error("Failed to delete:", err);
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

  // === Add-Ingredient Handler ===
  const handleAddSubmit = async (e) => {
    e.preventDefault();

    const unitPrice = parseFloat(parseFloat(newIng.price) / newIng.unit_type === "unit" || newIng.unit_type === "ml" ? parseInt(newIng.quantity) / parseFloat(newIng.price) : parseFloat(newIng.weight_available)  / parseFloat(newIng.price));

    const payload = {
      name: newIng.name,
      unit_type: newIng.unit_type,
      available_quantity:
        newIng.unit_type === "unit" || newIng.unit_type === "ml" ? newIng.quantity : 0,
      available_weight:
        newIng.unit_type !== "unit" ? newIng.weight_available : 0,
      price: unitPrice
    };

    try {
      setLoading(true);
      await axios.post("/api/catalog/create-ingredient", payload);
      await fetchIngredients(currentPage);
      setNewIng({
        name: "",
        unit_type: "unit",
        quantity: 0,
        weight_available: 0,
      });
      setShowAddForm(false);
    } catch (err) {
      console.error("Failed to add ingredient:", err);
    } finally {
      setLoading(false);
    }
  };

  // Columns
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
          ? `${row.quantity ?? 0} ${row.unit_type}`
          : `${row.weight_available ?? 0} ${row.unit_type}`,
      sortable: true,
    },
    {
      name: "Unit Price",
      cell: (row) => { 
        const isUnit = row.unit_type === "unit";
        const isVol = row.unit_type === "ml" || row.unit_type === "litre";
        const suffix = isUnit
          ? "units"
          : isVol
          ? row.unit_type
          : row.unit_type;

          return editingId === row.id ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", zIndex: "1000" }}>
               <input
                type="number"
                step={isUnit || isVol ? "1" : "0.01"}
                min="0"
                placeholder={`Enter ${isUnit ? "quantity" : isVol ? "volume" : "weight"} (${suffix})`}
                value={restockValue}
                onChange={(e) => setRestockValue(e.target.value)}
                style={{ width: "80px" }}
              />
              <input
                type="number"
                placeholder={`Enter Total Price`}
                value={restockPrice}
                onChange={(e) => setRestockPrice(e.target.value)}
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
          ) : 
          `${row.price}` },
    },
    {
      name: "Actions",
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      cell: (row) => {
        
        return editingId !== row.id && (<>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleStartEdit(row);
            }}
          >
            <FontAwesomeIcon icon={faAdd} /> Restock
          </a>
          
          </>
        );
      },
    },
    {
      name: "",
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      cell: (row) => {
        
        return editingId !== row.id && (<>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              deleteRow(row.id);
            }}
          >
            <FontAwesomeIcon icon={faTrash} />
          </a>
          
          </>
        );
      },
    },
  ];

  createTheme("dark", {
    background: { default: "transparent", color: "#000" },
  });

  return (
    <div style={{ width: "100%", margin: "0 auto" }}>
      {/* Add Ingredient */}
      <div style={{ marginBottom: "1em", textAlign: "right" }}>
        {showAddForm ? (
          <form
            onSubmit={handleAddSubmit}
            style={{
              display: "inline-flex",
              gap: "0.5rem",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              required
              placeholder="Name"
              value={newIng.name}
              onChange={(e) =>
                setNewIng({ ...newIng, name: e.target.value })
              }
            />
            <select
              value={newIng.unit_type}
              onChange={(e) =>
                setNewIng({ ...newIng, unit_type: e.target.value })
              }
            >
              <option value="unit">Unit</option>
              <option value="kg">kg</option>
              <option value="lb">lb</option>
              <option value="ml">ml</option>
            </select>
            {newIng.unit_type === "unit" || newIng.unit_type === "ml" ? (
              <input
                type="number"
                placeholder={newIng.unit_type === "unit"? "qty" : "vol"}
                value={newIng.quantity}
                onChange={(e) =>
                  setNewIng({
                    ...newIng,
                    quantity: parseInt(e.target.value),
                  })
                }
                style={{ width: "60px" }}
              />
            ) : (
              <input
                type="number"
                step="0.01"
                placeholder="weight"
                value={newIng.weight_available}
                onChange={(e) =>
                  setNewIng({
                    ...newIng,
                    weight_available: parseFloat(e.target.value),
                  })
                }
                style={{ width: "60px" }}
              />
            )}
            <input
                type="number"
                placeholder={`Total Price`}
                value={newIng.price}
                onChange={(e) =>
                  setNewIng({
                    ...newIng,
                    price: parseFloat(e.target.value),
                  })
                }
                style={{ width: "60px" }}
              />
            <button type="submit">
              <FontAwesomeIcon icon={faCheck} />
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
            >
              <FontAwesomeIcon icon={faCancel} />
            </button>
          </form>
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            style={{ padding: "0.5em 1em" }}
          >
            <FontAwesomeIcon icon={faAdd} /> Add Ingredient
          </button>
        )}
      </div>

      {/* Ingredients Table */}
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
          fetchIngredients(page);
        }}
        onChangePage={handlePageChange}
        theme="light"
      />
    </div>
  );
}
