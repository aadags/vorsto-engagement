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
  const [showOverlay, setShowOverlay] = useState(true); // 👈 overlay state

  const fetchData = async (page) => {
    const response = await axios.get(`/api/get-dashboard`);
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
    fetchData();

    const getMetric = async () => {
      const response = await fetch("/api/get-dashboard-metric", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const res = await response.json();
        setIframeUrl(res.iframeUrl);
      }
    };

    getMetric();

    // 👇 Show overlay only when page is at the very top
    const handleScroll = () => {
      if (window.scrollY <= 0) {
        setShowOverlay(true);
      } else {
        setShowOverlay(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  

  return (
    <>
      <div className="techwave_fn_user_profile_page">
        {/* !Page Title */}
        <div style={{ position: "relative", width: "100%", height: "100vh" }}>
          {showOverlay && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "60px", // adjust to match Metabase toolbar height
                backgroundColor: "white",
                zIndex: 10,
              }}
            />
          )}

          {iframeUrl && (
            <iframe
              src={iframeUrl}
              frameBorder="0"
              allowTransparency="true"
              style={{ border: "none", width: "100%", height: "100%" }}
            />
          )}
        </div>

        <div className="container">
          <div className="techwave_fn_user_profile">
            {/* Your chart sections are still commented out here */}
          </div>
        </div>
      </div>
    </>
  );
}
