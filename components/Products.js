import React, { useState, useEffect } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCancel, faComment, faEye, faEdit, faX } from "@fortawesome/free-solid-svg-icons";

export default function Products({ viewProduct, handleProduct }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const columns = [
    {
      name: "Image",
      selector: (row) => <img height="36px" src={row.image || "/no-image.jpg"} alt="img" />,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row.category.name,
      sortable: true,
    },
    {
      name: "Last Updated",
      selector: (row) =>
        new Date(row.updated_at).toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", paddingBottom: "0.5em", width: "100%" }}>
          <a href="#" onClick={() => viewProduct(row.name, row.id)}><FontAwesomeIcon icon={faEye} /> View</a>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "",
      cell: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", paddingBottom: "0.5em", width: "100%" }}>
          <a href="#" onClick={() => handleProduct(row.name, row.id)}><FontAwesomeIcon icon={faEdit} /> Edit</a>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "",
      cell: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", paddingBottom: "0.5em", width: "100%" }}>
          <a href="#" onClick={() => deactivateProduct(row.id)}><FontAwesomeIcon icon={faX} /> Deactivate</a>
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

  const deactivateProduct = async (id) => {

    if (!window.confirm('Are you sure you want to deactivate this item? Customers will not be able to buy this item after deactivation.')) {
      return
    }

    const response = await axios.get(
      `/api/catalog/delete-product?id=${id}`
    );

    fetchProducts(1)
  };

  const fetchProducts = async (page) => {
    setLoading(true);

    const response = await axios.get(
      `/api/catalog/get-list?page=${page}&per_page=${perPage}`
    );

    setData(response.data.data);
    setTotalRows(response.data.count);
    setLoading(false);
  };

  const handlePageChange = (page) => {
    fetchProducts(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);

    const response = await axios.get(
      `/api/catalog/get-list?page=${page}&per_page=${perPage}`
    );

    setData(response.data.data);
    setPerPage(newPerPage);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts(1); // fetch page 1 of users
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
