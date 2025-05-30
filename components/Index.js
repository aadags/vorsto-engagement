"use client";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);


export default function Index() {

  const [allConv, setAllConv] = useState([]);
  const [leads, setLeads] = useState([]);
  const [closed, setClosed] = useState([]);
  const [ongoing, setOngoing] = useState([]);
  const [iframeUrl, setIframeUrl] = useState();

  const fetchData = async (page) => {
  
    const response = await axios.get(
      `/api/get-dashboard`
    );
  
    setAllConv(response.data.allConv);
    setLeads(response.data.leads);
    setClosed(response.data.closed);
    setOngoing(response.data.ongoing);
  };

  const fetchOrg = async () => {
      
    const response = await axios.get(`/api/get-org-details`);
    const org = response.data;
  };

  function getLastNDays(n) {
    const days = [];
    const today = new Date();

    for (let i = n; i > 0; i--) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);

      const dayString = day.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      });

      days.push(dayString);
    }

    return days;
  }

  const data = {
    labels: getLastNDays(10),
    datasets: [
      {
        label: "New Conversations",
        data: allConv,
        borderColor: "#000",
        backgroundColor: "transparent",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const leadData = {
    labels: getLastNDays(10),
    datasets: [
      {
        label: "New Leads",
        data: leads,
        borderColor: "#000",
        backgroundColor: "transparent",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const closedData = {
    labels: getLastNDays(10),
    datasets: [
      {
        label: "Closed Conversations",
        data: closed,
        borderColor: "#000",
        backgroundColor: "transparent",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const ongoingData = {
    labels: getLastNDays(10),
    datasets: [
      {
        label: "Activity",
        data: closed,
        borderColor: "#000",
        backgroundColor: "transparent",
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
        position: "top",
      },
    },
  };
  

  useEffect(() => {
    fetchData(); // fetch page 1 of users
    const getMetric = async () => {
        const response = await fetch('/api/get-dashboard-metric', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          const res = await response.json();
          setIframeUrl(res.iframeUrl);
        } 
    };

    getMetric();

  }, []);

  return (
    <>
      <div className="techwave_fn_user_profile_page">
        {/* !Page Title */}
        {iframeUrl && <iframe
              src={iframeUrl}
              frameBorder="0"
              allowTransparency="true"
              style={{ border: 'none', width: "100%", height: "100vh" }}
            />}
        <div className="container">
          <div className="techwave_fn_user_profile">

            {/* <div className="user__profile">
              <div
                className="user_details"
                style={{ display: "flex", justifyContent: "center", width: "100%" }}
              >
                <div style={{ width: "50%", margin: "0" }}>
                  <Line data={data} options={options} />
                </div>
                <div style={{ width: "50%", margin: "0" }}>
                  <Line data={leadData} options={options} />
                </div>
              </div>
            </div> */}

            {/* <div className="user__profile">
              <div
                className="user_details"
                style={{ display: "flex", justifyContent: "center", width: "100%" }}
              >
                <div style={{ width: "50%", margin: "0" }}>
                  <Line data={closedData} options={options} />
                </div>
                <div style={{ width: "50%", margin: "0" }}>
                  <Line data={ongoingData} options={options} />
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}
