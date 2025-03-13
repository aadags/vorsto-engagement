import { useState, useEffect } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/navigation';
import { faPlus, faShoppingCart, faCheck, faCancel, faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons'

const ActiveNumbers = () => {
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const router = useRouter();

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
      name: "Incoming Calls",
      cell: (row) => (
        <div>
          <a href={`#`} onClick={()=>deactivateNumber(row)}>
            <FontAwesomeIcon icon={faScrewdriverWrench} /> Incoming
          </a>
          <br />
        </div>
      ),
      button: true,
      grow: 10
    },
    {
      name: "Deactivate",
      cell: (row) => (
        <div>
          <a href={`#`} onClick={()=>deactivateNumber(row)}>
            <FontAwesomeIcon icon={faCancel} /> Deactivate
          </a>
          <br />
        </div>
      ),
      button: true,
      grow: 10
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

  const deactivateNumber = async (numberData) => {
    const confirmAction = window.confirm(`Do you confirm to deactivate ${numberData.number}? This action immediately disables your phone number permanently. You may not be able to repurchase it back after 7 days of deactivation.`);
    if (!confirmAction) return;

    try {
      const response = await axios.post(`/api/deactivate-number`, { numberData });
      if(response.data.status)
      {
        router.refresh();
      }
    } catch (error) {
      console.error("Error deactivating number:", error);
      alert("Error deactivating number");
    }
  };

  useEffect(() => {
    fetchResult(1); // fetch page 1 of result
  }, []);


  return (
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
  );
};

export default ActiveNumbers;