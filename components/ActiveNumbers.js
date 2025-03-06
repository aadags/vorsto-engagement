import { useState, useEffect } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faShoppingCart, faCheck, faCancel, } from '@fortawesome/free-solid-svg-icons'

const ActiveNumbers = () => {
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const columns = [
    {
      name: "Phone Number",
      selector: (row) => row.number,
      sortable: true,
    },
    {
      name: "Locality",
      selector: (row) => row.locality
    },
    {
      name: "Voice",
      selector: (row) => (
        <div>
          {row.voice? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faCancel} />}
        </div>
      )
    },
    {
      name: "SMS",
      selector: (row) => (
        <div>
          {row.sms? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faCancel} />}
        </div>
      )
    },
    {
      name: "Monthly Fee",
      selector: (row) => row.plan=="free"? "free" : "$1.50"
    },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          <a href={`#`}>
            <FontAwesomeIcon icon={faCancel} /> Deactivate
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

  const fetchResult = async (page) => {
    setLoading(true);

    const response = await axios.get(
      `/api/get-active-numbers?page=${page}&per_page=${perPage}`
    );

    setData(response.data.data);
    setTotalRows(response.data.count);
    setLoading(false);
  };

  const handlePageChange = (page) => {
    fetchResult(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);

    const response = await axios.get(
      `/api/get-active-numbers?page=${page}&per_page=${perPage}`
    );

    setData(response.data.data);
    setPerPage(newPerPage);
    setLoading(false);
  };

  useEffect(() => {
    fetchResult(1); // fetch page 1 of result
  }, []);


  return (
    <div className="techwave_fn_user_profile_page">
      <div className="container">
        <div className="techwave_fn_user_profile">
          <div className="user__profile">
            <div style={{ width: "100%", margin: "0 auto" }}>
              <DataTable
                title={`Active Numbers`}
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
};

export default ActiveNumbers;