import React, { useState, useEffect } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faPhoneFlip } from "@fortawesome/free-solid-svg-icons";

export default function VoiceLog() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const columns = [
    {
      name: "Caller ID",
      selector: (row) => row.from,
      sortable: true,
    },
    {
      name: "Call Started",
      selector: (row) =>
        new Date(row.created_at).toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
      sortable: true,
    },
    {
      name: "Duration",
      selector: (row) => convertSecondsToMinSec(row.duration),
      sortable: true,
    },
    {
      name: "Agent",
      selector: (row) => row?.user?.name,
      sortable: true,
    },
    // {
    //   name: 'Actions',
    //   cell: row => (
    //       <div>
    //           <a href="#"><FontAwesomeIcon icon={faPhoneFlip} /> Transfer to Me</a><br/>
    //       </div>
    //   ),
    //   ignoreRowClick: true,
    //   allowOverflow: true,
    // },
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
      `/api/get-call-log?page=${page}&per_page=${perPage}`
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
      `/api/get-call-log?page=${page}&per_page=${perPage}`
    );

    setData(response.data.data);
    setPerPage(newPerPage);
    setLoading(false);
  };

  function convertSecondsToMinSec(seconds) {
    if (seconds < 0) {
      throw new Error("Seconds cannot be negative.");
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return minutes > 0
      ? `${minutes}m ${remainingSeconds}s`
      : `${remainingSeconds}s`;
  }

  useEffect(() => {
    fetchUsers(1); // fetch page 1 of users
  }, []);

  return (
    
            <div style={{ width: "100%", margin: "0 auto" }}>
              <DataTable
                title="Call Log"
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
