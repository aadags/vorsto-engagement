'use client';
import React, { useState, useEffect } from 'react';
import { getUser } from '@/services/userService';
import { useRouter } from 'next/navigation';

export default function DataSources() {
  const [user, setUser] = useState();
  const [datasources, setDatasources] = useState([]);
  const [newSourceUrl, setNewSourceUrl] = useState('');
  const [newSourceLabel, setNewSourceLabel] = useState('');
  const [maskState, setMaskState] = useState({});
  const [error, setError] = useState('');

  const router = useRouter();

  const getSources = async () => {
    try {
      const response = await fetch('/api/get-sources', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const sources = await response.json();
        setDatasources(sources);

        setMaskState((prevMaskState) => {
          const newMaskState = datasources.reduce((acc, source) => {
            acc[source] = false;
            return acc;
          }, {});
        
          return {
            ...prevMaskState,
            ...newMaskState,
          };
        });
      }
    } catch (error) {
      console.error('Error fetching sources:', error);
    }
  };

  const saveSource = async (source) => {
    try {
      const response = await fetch('/api/save-source', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(source),
      });

      if (response.ok) {
        await getSources();
        setNewSourceUrl('');
        setNewSourceLabel('');
      }
    } catch (error) {
      console.error('Error saving source:', error);
    }
  };

  const deleteSource = async (id) => {
    try {
      const response = await fetch('/api/del-source', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        await getSources();
      } else {
        setError('An error occurred while deleting the source.');
      }
    } catch (error) {
      setError('An error occurred: ' + error);
      console.error('Error deleting source:', error);
    }
  };

  const handleCreateSource = () => {
    if (newSourceUrl && newSourceLabel) {
      saveSource({ url: newSourceUrl, label: newSourceLabel });
    } else {
      setError('Please provide both a URL and a label.');
    }
  };

  const toggleMask = (sourceId) => {
    setMaskState({ ...maskState, [sourceId]: !maskState[sourceId] });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getSources();
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
        <h2 className="title">Data Source</h2>
      </div>

      <div className="contactpage">
        <div className="container small">
            <h3>Add New Data Source</h3>
            <div className="fn_contact_form">
              <div className="input_list">
                <input
                  type="text"
                  placeholder="Data Source URL (CSV)"
                  value={newSourceUrl}
                  onChange={(e) => setNewSourceUrl(e.target.value)}
                />
                <br/>
                <select
                  value={newSourceLabel}
                  onChange={(e) => setNewSourceLabel(e.target.value)}
                >
                  <option value="">Select Label</option>
                  <option value="Sales">Sales Analysis & Prediction</option>
                  <option value="Customer Analysis">Customer Analysis</option>
                  <option value="Demand Forecasting">Demand Forecasting</option>
                  <option value="Suppliers">Suppliers Performance</option>
                  <option value="Inventory">Inventory</option>
                </select>
                <br/>
                <button
                  className="techwave_fn_button"
                  type="button"
                  onClick={handleCreateSource}
                >
                  Add Data Source
                </button>
                {error && <p className="error-message">{error}</p>}
              </div>
            </div>
          <br/><br/>
          <div className="input_list">
            <h3>Current Data Sources:</h3>
            <ul>
              {datasources.map((source) => (
                <li key={source.id} className="input_wrapper list_item">
                  <input
                    type={!maskState[source.id] ? 'password' : 'text'}
                    value={`${source.job}: `+source.path}
                    readOnly
                  />
                  <span className="label">{source.label}</span>
                  <button onClick={() => toggleMask(source.id)}>
                    {maskState[source.id] ? (
                      <i className="fa fa-eye"></i>
                    ) : (
                      <i className="fa fa-eye-slash"></i>
                    )}
                  </button>
                  <button onClick={() => deleteSource(source.id)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
