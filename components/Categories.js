import React, { useState, useEffect } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCancel, faCheck, faComment, faDeleteLeft, faEdit, faPen, faTrash, faX } from "@fortawesome/free-solid-svg-icons";

export default function Categories({ handleCat }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const columns = [
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
      name: "Products Count",
      selector: (row) => row._count.products,
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
          <a href="#" onClick={() => handleCat(row.name, row.id)}><FontAwesomeIcon icon={faEdit} /></a>
          {row._count.products > 0?
          <a href="#" onClick={() => alert("Categories with products cannot be deleted!")}><FontAwesomeIcon icon={faTrash} /></a>
          :<a href="#" onClick={() => delCat(row.id)}><FontAwesomeIcon icon={faTrash} /></a>}
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

  const delCat = async (id) => {

    if (!window.confirm('Are you sure you want to delete this category? This cannot be undone')) {
      return
    }

    const response = await axios.get(
      `/api/catalog/delete-cat?id=${id}`
    );

    fetchCats(1)
  };

  const fetchCats = async (page) => {
    setLoading(true);

    const response = await axios.get(
      `/api/catalog/get-cat-list?page=${page}&per_page=${perPage}`
    );

    setData(response.data.data);
    setTotalRows(response.data.count);
    setLoading(false);
  };

  const handlePageChange = (page) => {
    fetchCats(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);

    const response = await axios.get(
      `/api/catalog/get-cat-list?page=${page}&per_page=${perPage}`
    );

    setData(response.data.data);
    setPerPage(newPerPage);
    setLoading(false);
  };

  useEffect(() => {
    fetchCats(1); // fetch page 1 of users
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
