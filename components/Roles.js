import React, { useState, useEffect } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDeleteLeft, faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function Roles() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [title, setTitle] = useState("");
  const [checkboxes, setCheckboxes] = useState({
    archivedChats: false,
    manageAiAgent: false,
    createUsers: false,
    viewUsers: false,
    createRoles: false,
    viewRoles: false,
    configureWebChat: false,
    configureWhatsapp: false,
  });

  const columns = [
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
      maxWidth: "20%",
    },
    {
      name: "Permissions",
      selector: (row) => decodePermissions(row.permissions),
      sortable: false,
      allowOverflow: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        row.users && row.users.length < 1 && <div>
          <a href onClick={() => deleteRole(row.id)}>
            <FontAwesomeIcon icon={faDeleteLeft} /> Deactivate
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
      "Are you sure you want to create this role?"
    );

    if (!confirmation) {
      return; // Exit the function if the user cancels the action
    }

    setLoading(true);

    try {
      const response = await fetch("/api/create-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, checkboxes }),
      });

      if (response.ok) {
        fetchUsers(1);
      } else {
        // Handle error
        console.error("Error creating role:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating role:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteRole = async (id) => {
   
  
    const confirmation = window.confirm("Are you sure you want to delete this role?");
  
    if (!confirmation) {
      return; // Exit the function if the user cancels the action
    }
  
    setLoading(true);
  
    try {
      const response = await fetch('/api/delete-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
  
      if (response.ok) {
        fetchUsers(1); 
      } else {
        // Handle error
        alert("error deleting role, ensure you have no users attached to role")
        console.error('Error deleting role:', response.statusText);
      }
    } catch (error) {
      alert("error delete user")
      console.error('Error deleting role:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async (page) => {
    setLoading(true);

    const response = await axios.get(
      `/api/get-roles?page=${page}&per_page=${perPage}`
    );

    setData(response.data.data);
    setTotalRows(response.data.total);
    setLoading(false);
  };

  const handlePageChange = (page) => {
    fetchUsers(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);

    const response = await axios.get(
      `/api/get-roles?page=${page}&per_page=${perPage}`
    );

    setData(response.data.data);
    setPerPage(newPerPage);
    setLoading(false);
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckboxes((prev) => ({ ...prev, [name]: checked }));
  };

  const decodePermissions = (perms) => {
    const prms = JSON.parse(perms);
    const result = Object.entries(prms)
      .filter(([key, value]) => value === true)
      .map(([key]) => key)
      .join(', ');
    return result;
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
                title="Roles"
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
            <h5>Add a New Role</h5>
            <form onSubmit={handleSubmit}>
              <div className="form_group">
                <input
                  type="text"
                  id="bot_name"
                  className="full_width"
                  placeholder="Title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <br />
              
                {Object.entries(checkboxes).map(([key, value]) => (
                  <div key={key}>
                    <label style={{ width: "100%", height: "20px", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        name={key}
                        checked={value}
                        onChange={handleCheckboxChange}
                      />
                      {` ${key
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/^./, str => str.toUpperCase())}`}
                    </label>
                    <br />
                  </div>
                ))}
              <p className="text-red">{""}</p>
              <br />
              <div className="generate_section">
                <button
                  type="submit"
                  className="techwave_fn_button"
                  aria-readonly={loading}
                >
                  <span>
                    Create Role{" "}
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
