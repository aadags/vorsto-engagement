import React, { useState, useEffect } from 'react';
import DataTable, { createTheme } from 'react-data-table-component';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBinoculars } from '@fortawesome/free-solid-svg-icons'

export default function Ticket() {
  const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [totalRows, setTotalRows] = useState(0);
	const [perPage, setPerPage] = useState(10);

  const columns = [
    {
      name: 'Name',
      selector: row => row.name || row.username,
      sortable: true,
    },
    {
      name: 'Category',
      selector: row => "Billing",
      sortable: true,
    },
    {
      name: 'Priority',
      selector: row => "High",
      sortable: true,
    },
    {
      name: 'Contact',
      selector: row => row.email || row.phone || row.username,
      sortable: true,
    },
    {
      name: 'Created',
      selector: row => new Date(row.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
      sortable: true,
    },
    {
      name: 'Actions',
      cell: row => (
          <div>
              <a href="#"><FontAwesomeIcon icon={faBinoculars} /> Open</a><br/>
          </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
  },
  ];

  createTheme('dark', {
    background: {
      default: 'transparent',
      color: '#FFFFFF',
    },
  });

	const fetchUsers = async page => {
		setLoading(true);

		const response = await axios.get(`/api/get-convos?page=${page}&per_page=${perPage}&`);

		setData(response.data.data);
		setTotalRows(response.data.total);
		setLoading(false);
	};

	const handlePageChange = page => {
		fetchUsers(page);
	};

	const handlePerRowsChange = async (newPerPage, page) => {
		setLoading(true);

		const response = await axios.get(`/api/get-convos?page=${page}&per_page=${perPage}`);

		setData(response.data.data);
		setPerPage(newPerPage);
		setLoading(false);
	};

	useEffect(() => {
		fetchUsers(1); // fetch page 1 of users
		
	}, []);

  return (
    <div className="techwave_fn_user_profile_page">
      <div className="container">
        <div className="techwave_fn_user_profile">
          <div className="user__profile">
              <div style={{ width: '100%', margin: '0 auto' }}>
                <DataTable
                  title="Open Tickets"
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