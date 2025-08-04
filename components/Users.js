import React, { useState, useEffect } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartArea, faChartBar, faChartPie, faDeleteLeft, faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function Users() {
  const [data, setData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(0);

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
      name: "Role",
      selector: (row) => row.role?.title || "Admin",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) =>
        row.role_id? (
          <div>
            <a target="_blank" href={`/metrics/agent/${row.id}`}>
              <FontAwesomeIcon icon={faChartPie} /> KPI
            </a>
            <br />
            <a href onClick={() => deleteUser(row.id)}>
              <FontAwesomeIcon icon={faDeleteLeft} /> Deactivate
            </a>
            <br />
          </div>
        ) : 
        (
          <div>
            <a target="_blank" href={`/metrics/agent/${row.id}`}>
              <FontAwesomeIcon icon={faChartPie} /> KPI
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmation = window.confirm(
      "Are you sure you want to create this user?"
    );

    if (!confirmation) {
      return; // Exit the function if the user cancels the action
    }

    setLoading(true);

    try {
      const response = await fetch("/api/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (response.ok) {
        fetchUsers(1);
      } else {
        // Handle error
        console.error("Error creating user:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating agent:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmation) {
      return; // Exit the function if the user cancels the action
    }

    setLoading(true);

    try {
      const response = await fetch("/api/delete-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        fetchUsers(1);
      } else {
        // Handle error
        alert("error delete user");
        console.error("Error deleting user:", response.statusText);
      }
    } catch (error) {
      alert("error delete user");
      console.error("Error deleting user:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async (page) => {
    setLoading(true);

    const response = await axios.get(
      `/api/get-users?page=${page}&per_page=${perPage}`
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
      `/api/get-users?page=${page}&per_page=${perPage}`
    );

    setData(response.data.data);
    setRoles(response.data.roles);
    setPerPage(newPerPage);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers(1); // fetch page 1 of users
  }, []);

  return (
    <div className="techwave_fn_image_generation_page">
      <div className="generation__page">
        {/* Generation Header */}
        <div className="generation_header">
          <div className="header_bottom">
            <div style={{ width: "100%", margin: "0 auto" }}>
              <DataTable
                title="Users"
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
        {/* !Generation Header */}
      </div>
      <div className="generation__sidebar">
        <div className="sidebar_content">
          <div style={{ width: "100%", padding: "20px" }}>
            <h5>Add a New User</h5>
            <form onSubmit={handleSubmit}>
              <div className="form_group">
                <input
                  type="text"
                  id="bot_name"
                  className="full_width"
                  placeholder="Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <br />
              <div className="form_group">
                <input
                  type="text"
                  id="bot_email"
                  className="full_width"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <br />
              <div className="form_group">
                <input
                  type="text"
                  id="bot_pwd"
                  className="full_width"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <br />
              <div className="form_group">
                <select
                  className="full_width"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <>
                    <option value="">Select Role</option>
                    <option value="0">Admin</option>
                    {roles &&
                      roles.map((role) => (
                        <option value={role.id}>{role.title}</option>
                      ))}
                  </>
                </select>
                <br />
              </div>
              <br />
              <p className="text-red">{""}</p>
              <br />
              <div className="generate_section">
                <button
                  type="submit"
                  className="techwave_fn_button"
                  aria-readonly={loading}
                >
                  <span>
                    Create User{" "}
                    {loading && (
                      <FontAwesomeIcon icon={faSpinner} spin={true} />
                    )}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
