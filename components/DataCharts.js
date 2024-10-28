'use client';
import React, { useState, useEffect } from 'react';
import { getUser } from '@/services/userService';
import { useRouter } from 'next/navigation';

export default function DataCharts() {
  const [user, setUser] = useState();
  const [jobs, setJobs] = useState([]);
  const router = useRouter();

  const getJobs = async () => {
    try {
      const response = await fetch('/api/get-jobs', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const jobs = await response.json();
        setJobs(jobs);

      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getJobs();
        const user = await getUser();
        setUser(user);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="techwave_fn_contact_page">
      {/* Page Title */}
      <div className="techwave_fn_pagetitle">
        <h2 className="title">Data Charts</h2>
      </div>

      {user && <div className="contactpage">
        <div className="container small">
          {jobs.length < 1 && ( 
            <h2 className="title">No charts to display</h2>
          )}
          {jobs.map((job) => (
            <div className="fn_contact_form" key={job.id}>
              {job.imagefiles.split(',').map((url, index) => (
                <img 
                  key={index} 
                  src={`https://cdn.vorsto.io/analysis/${user?.id}/output/`+url.trim()} 
                  alt={`chart-image-${index}`} 
                />
              ))}
              <br />
              <p>{job.description}</p> {/* Example for additional content */}
              <br />
            </div>
          ))}
        </div>
      </div>}
    </div>
  );
}
