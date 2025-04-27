
"use client"
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useRouter, useSearchParams } from 'next/navigation';

const ConnectSquare = ({ org }) => {

  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code'); 
  const [connected, setConnected] = useState(false);
  const [locations, setLocations] = useState();
  const [defaultLocation, setDefaultLocation] = useState("");

  const setDefLoc = (id) => {
    const location = locations.find(loc => loc.id === id);
    if(location.country !== org.country)
    {
      alert("Location does not match your business country of operation")
      return
    }
    setDefaultLocation(id)
  };

  useEffect(() => {

    const connectSquare = async () => {
        const response = await fetch(`/api/connect-square`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code })
        });

        if (response.ok) {
          const res = await response.json();
          if(res.status)
          {
            setConnected(true)
          }
        } 
    };

    if(code) {
      connectSquare();
    }

  }, [code])

  useEffect(() => {

    const getLocations = async () => {
        const response = await fetch(`/api/square/get-locations`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          const res = await response.json();
          if(res.locations.length < 2){
              setLocations(res.locations)
          } else {
              router.push("/integration/payments");
          }
        
        } 
    };

    if(connected) {
      getLocations();
    }

  }, [connected])

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await fetch('/api/square/update-location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          defaultLocation,
        }),
      });
  
      const data = await res.json();
  
      if (!res.ok) throw new Error(data.error || 'Failed to update business location');
  
      router.push("/integration/payments");

    } catch (err) {
      console(err.message);
      alert("An error occurred")
    } 
  };

  return (
    <>
    <div className="techwave_fn_image_generation_page">
        <div className="generation__page">
          {/* Generation Header */}
          <div className="generation_header">

              {!connected && <h1><FontAwesomeIcon icon={faSpinner} spin={true} /> Loading...</h1>}
              {connected && locations &&
              
              <form onSubmit={handleSubmit}>
                  <p>Select your default location. (This should march your configured business country - {org.country})</p>
                  <div className="form_group" style={{ width: "30%" }}>
                      <select
                          value={defaultLocation}
                          onChange={(e) =>
                                      setDefLoc(e.target.value)
                                    }>
                          <option value="">Select your location</option>
                          { locations.map((loc, i) => ( <option key={i} value={loc.id}>{loc.name} ({loc.status})</option> ))}
                      </select>
                  </div>
                  <br/>
                  <button className="techwave_fn_button" type="submit">Confirm Location</button>

              </form>
              }
         
           </div>
        </div>
    </div>
    </>
  );
};

export default ConnectSquare;
