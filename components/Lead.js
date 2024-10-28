import React, { useState } from 'react';
import DataTable from 'react-data-table-component';

export default function Lead() {

  const columns = [
    {
      name: 'Title',
      selector: row => row.title,
      sortable: true,
    },
    {
      name: 'Year',
      selector: row => row.year,
      sortable: true,
    },
  ];
  
  const data = [
    {
      id: 1,
      title: 'Beetlejuice',
      year: '1988',
    },
    {
      id: 2,
      title: 'Ghostbusters',
      year: '1984',
    },
  ];

  const customStyles = {
    rows: {
      style: {
        backgroundColor: 'transparent',
        color: 'white',
        borderBottom: '1px solid white',
      },
    },
    headCells: {
      style: {
        color: 'white',
        borderBottom: '1px solid white',
      },
    },
    cells: {
      style: {
        color: 'white',
      },
    },
  };

  import React, { useState } from 'react';
import DataTable from 'react-data-table-component';

export default function Lead() {

  const columns = [
    {
      name: 'Title',
      selector: row => row.title,
      sortable: true,
    },
    {
      name: 'Year',
      selector: row => row.year,
      sortable: true,
    },
  ];
  
  const data = [
    {
      id: 1,
      title: 'Beetlejuice',
      year: '1988',
    },
    {
      id: 2,
      title: 'Ghostbusters',
      year: '1984',
    },
  ];

  const customStyles = {
    rows: {
      style: {
        backgroundColor: 'transparent',
        color: 'white',
        borderBottom: '1px solid white',
      },
    },
    headCells: {
      style: {
        color: 'white',
        borderBottom: '1px solid white',
      },
    },
    cells: {
      style: {
        color: 'white',
      },
    },
  };

  return (
    <div className="techwave_fn_user_profile_page">
      <div className="container">
        <div className="techwave_fn_user_profile">
          <div className="user__profile">
            <div className="user_details">
              <div style={{ width: '100%', margin: '0 auto' }}>
                <DataTable
                  columns={columns}
                  data={data}
                  customStyles={customStyles}
                  theme="dark"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


  return (
    <div className="techwave_fn_user_profile_page">
      <div className="container">
        <div className="techwave_fn_user_profile">
          <div className="user__profile">
            <div className="user_details">
              <div style={{ width: '100%', margin: '0 auto' }}>
                <DataTable
                  columns={columns}
                  data={data}
                  customStyles={customStyles}
                  theme="dark"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
