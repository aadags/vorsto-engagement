import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import axios from "axios";
import timezones from '../utils/timezone.json';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const BusinessHoursForm = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [timezone, setTimezone] = useState('');
  const [businessHours, setBusinessHours] = useState(
    daysOfWeek.map(day => ({
      day,
      open: false,
      blocks: [{ start: '', end: '' }],
    }))
  );

  const handleTimeZoneChange = (e) => {
    setTimezone(e.target.value);
  };

  const handleToggleOpen = (index) => {
    const updated = [...businessHours];
    updated[index].open = !updated[index].open;
    setBusinessHours(updated);
  };

  const updateBlock = (dayIndex, blockIndex, field, value) => {
    const updated = [...businessHours];
    updated[dayIndex].blocks[blockIndex][field] = value;
    setBusinessHours(updated);
  };

  const addBlock = (dayIndex) => {
    const updated = [...businessHours];
    updated[dayIndex].blocks.push({ start: '', end: '' });
    setBusinessHours(updated);
  };

  const removeBlock = (dayIndex, blockIndex) => {
    const updated = [...businessHours];
    updated[dayIndex].blocks.splice(blockIndex, 1);
    setBusinessHours(updated);
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const data = { timezone, businessHours };

    try {
      const response = await fetch('/api/update-business-hours', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {

        setLoading(false);
        setSuccess("Hours updated");
        
      } else {
        // Handle error
        setLoading(false);
        setError("An error occurred");
      }
    } catch (error) {
      setLoading(false);
      setError("An error occurred: " + error);
      console.error('Error updating business:', error);
    }
  };

  const fetchOrg = async () => {
      
    const response = await axios.get(`/api/get-org-details`);
    const org = response.data;
    setBusinessHours(org.hours || daysOfWeek.map(day => ({
      day,
      open: false,
      blocks: [{ start: '', end: '' }],
    })))
    const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimezone(org.timezone || browserTimezone);
  };

  useEffect(() => {
   
    fetchOrg();
    if (Intl.supportedValuesOf) {
      setTimezone(Intl.supportedValuesOf('timeZone'));
    }

  }, []);

  return (
    <form onSubmit={handleSubmit} className="business-hours-container">
      <h1>Set Business Hours</h1>
      <div>
        <label>Timezone</label>

        <select id="timezone" value={timezone} onChange={handleTimeZoneChange}>
          {timezones.map((tz) => (
            <option key={tz} value={tz}>
              {tz.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </div>
      <br/>
      {businessHours.map((day, dayIndex) => (
        <div key={day.day} className="day-row">
          <label className="day-toggle">
            <input
              type="checkbox"
              checked={day.open}
              onChange={() => handleToggleOpen(dayIndex)}
            />
            {day.day}
          </label>

          {day.open && (
            <div className="time-blocks">
              {day.blocks.map((block, blockIndex) => (
                <div className="time-input-wrapper" key={blockIndex}>
                  <label className="time-label">
                    <span>Start</span>
                    <input
                      required
                      type="time"
                      value={block.start}
                      onChange={(e) =>
                        updateBlock(dayIndex, blockIndex, 'start', e.target.value)
                      }
                    />
                  </label>

                  <label className="time-label">
                    <span>End</span>
                    <input
                      required
                      type="time"
                      value={block.end}
                      onChange={(e) =>
                        updateBlock(dayIndex, blockIndex, 'end', e.target.value)
                      }
                    />
                  </label>

                  {day.blocks.length > 1 && (
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeBlock(dayIndex, blockIndex)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="techwave_fn_button"
                onClick={() => addBlock(dayIndex)}
              >
                + Add Time Block
              </button>
            </div>
          )}
        </div>
      ))}
      <p style={{ color: "green" }}>{success}</p>
      <button type="submit" className="techwave_fn_button" aria-readonly={loading}><span>Update Hours {loading && <FontAwesomeIcon icon={faSpinner} spin={true} />}</span></button>
    </form>
  );
};

export default BusinessHoursForm;
