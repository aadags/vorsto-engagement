import React, { useState, useEffect } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBinoculars } from "@fortawesome/free-solid-svg-icons";

export default function Contacts() {
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
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
      sortable: true,
    },
    {
      name: "Instagram",
      selector: (row) => (row.username ? "@" + row.username : ""),
      sortable: true,
    },
    {
      name: "Satisfaction Score",
      selector: (row) => (row.satisfaction_score>=0 && row.satisfaction_score+"%"),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          <a href={`/contact/${row.id}`}>
            <FontAwesomeIcon icon={faBinoculars} /> Dashboard
          </a>
          <br />
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  createTheme("dark", {
    background: {
      default: "transparent",
      color: "#000",
    },
  });

  const fetchUsers = async (page) => {
    setLoading(true);

    const response = await axios.get(
      `/api/get-contacts?page=${page}&per_page=${perPage}`
    );

    setData(response.data.data);
    setTotalRows(response.data.count);
    setLoading(false);
  };

  const handlePageChange = (page) => {
    fetchUsers(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);

    const response = await axios.get(
      `/api/get-contacts?page=${page}&per_page=${newPerPage}`
    );

    setData(response.data.data);
    setPerPage(newPerPage);
    setLoading(false);
  };

  const handleExport = async () => {
    try {
      const response = await fetch("/api/export-contact");
      if (!response.ok) {
        throw new Error("Failed to export data");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "contacts.xlsx"); // File name
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  useEffect(() => {
    fetchUsers(1); // fetch page 1 of users
  }, []);

  return (
    <div className="techwave_fn_user_profile_page">
      <div className="container">
        <div className="techwave_fn_user_profile">
          <div className="user__profile">
            <div style={{ width: "100%", margin: "0 auto" }}>
              {/* Export Button */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginBottom: "10px",
                }}
              >
                <button
                  onClick={handleExport}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Download Contacts
                </button>
              </div>
              {/* Data Table */}
              <DataTable
                title="Contacts"
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
          </div>
        </div>
      </div>
    </div>
  );
}
