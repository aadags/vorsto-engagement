'use client'
import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js'; 
import { socket } from '@/app/socket'
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);


export default function Index() {

  const [users, setUsers] = useState({});

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      console.log('....conn')
      socket.on('presence-update', ({users}) => {
        setUsers(users);
        console.log({ users });
      });

    }

    socket.on("connect", onConnect);

    return () => {
      socket.off("connect", onConnect);
    };
  }, []);

  const data = {
    labels: ['18 Oct', '19 Oct', '20 Oct', '21 Oct', '22 Oct', '23 Oct', '24 Oct', '25 Oct', '26 Oct'],
    datasets: [
      {
        label: 'Visits History',
        data: [30, 100, 87, 22, 38, 73, 74, 23, 109],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const livedata = {
    labels: ['18', '19', '20', '21', '22', '23', '24', '25', '26'],
    datasets: [
      {
        label: 'Live Visits',
        data: [30, 100, 87, 22, 38, 73, 74, 23, 109],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };
  
  return (
    <>
      <div className="techwave_fn_user_profile_page">
        {users && <div className="techwave_fn_pagetitle">
          <h2 className="title">{users.length}</h2>
          {Object.values(users).map((user, index) => (
            <div key={index}>{user.name}</div>
          ))}
        </div>}
        {/* !Page Title */}
        <div className="container">
          <div className="techwave_fn_user_profile">

            <div className="user__profile">
              <div className="user_details">
                <div style={{ width: '100%', margin: '0 auto' }}>
                  <Line data={data} options={options} />
                </div>
              </div>
            </div>

            <div className="user__profile">
              <div className="user_details">
                <div style={{ width: '100%', margin: '0 auto' }}>
                  <Line data={livedata} options={options} />
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>

    </>
  )
}