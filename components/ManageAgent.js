'use client'
import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { replaceAccents } from '@/utils/helper'
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function ManageAgent() {
  const [name, setName] = useState('');
  const [model, setModel] = useState('vorsto-xa-2');
  const [key, setKey] = useState('');
  const [hook, setHook] = useState('');
  const [systemBio, setSystemBio] = useState('');
  const [humanTakeOver, setHumanTakeOver] = useState(true);
  const [autoEngage, setAutoEngage] = useState(true);
  const [autoFeedBack, setAutoFeedBack] = useState(true);
  const [autoMarketing, setAutoMarketing] = useState(true);
  const [outputType, setOutputType] = useState('');
  const [outputParameter, setOutputParameter] = useState([]);
  const [functions, setFunctions] = useState([]);
  const [pageLoad, setPageLoad] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [premium, setPremium] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();


  const handleFunctionChange = (index, key, value) => {
    const updatedFunctions = [...functions];
    updatedFunctions[index][key] = value;
    setFunctions(updatedFunctions);
  };

  const handleParameterChange = (funcIndex, paramIndex, key, value) => {
    const updatedFunctions = [...functions];
    const updatedParameters = { ...updatedFunctions[funcIndex].parameterConfig };
    updatedParameters[paramIndex] = {
      ...updatedParameters[paramIndex],
      [key]: value,
    };
    updatedFunctions[funcIndex].parameterConfig = updatedParameters;
    setFunctions(updatedFunctions);
  };

  const handleAddFunction = () => {
    setFunctions([...functions, { name: '', description: '', api: '', parameterConfig: {} }]);
  };

  const handleRemoveFunction = (index) => {
    const updatedFunctions = functions.filter((_, i) => i !== index);
    setFunctions(updatedFunctions);
  };

  const handleAddParameter = (funcIndex) => {
    const updatedFunctions = [...functions];
    const updatedParameters = { ...updatedFunctions[funcIndex].parameterConfig };
    const newParamIndex = Object.keys(updatedParameters).length;
    updatedParameters[newParamIndex] = { type: 'string', required: true, name: "", description: '', api: '' };
    updatedFunctions[funcIndex].parameterConfig = updatedParameters;
    setFunctions(updatedFunctions);
  };

  const handleRemoveParameter = (funcIndex, paramIndex) => {
    const updatedFunctions = [...functions];
    const updatedParameters = { ...updatedFunctions[funcIndex].parameterConfig };
    delete updatedParameters[paramIndex];
    updatedFunctions[funcIndex].parameterConfig = updatedParameters;
    setFunctions(updatedFunctions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const confirmation = window.confirm("Do you want to save the changes to your agent?");
  
    if (!confirmation) {
      return; // Exit the function if the user cancels the action
    }
  
    setLoading(true);
    const botData = { humanTakeOver, systemBio, autoEngage, autoFeedBack, autoMarketing };
  
    try {
      const response = await fetch('/api/create-bot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(botData),
      });
  
      if (response.ok) {
        // Handle success, e.g., show a success message or redirect
        setSaved(true);
      } else {
        // Handle error
        setError("An error occurred while saving your agent!");
        console.error('Error updating agent:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating agent:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    const fetchOrg = async () => {
      
      const response = await axios.get(`/api/get-org-details`);
      const org = response.data;
      setAutoEngage(org.ai_auto_engage);
      setSystemBio(org.ai_system_bio);
      setHumanTakeOver(org.ai_human_take_over);
      setAutoFeedBack(org.ai_auto_feedBack);
      setAutoMarketing(org.ai_auto_marketing);
      setPremium(org.plan !== "free");

    };
    fetchOrg();
  }, [])
  

  return (
    <>
      <div className="techwave_fn_image_generation_page">
      <div className="fn__title_holder">
                    <div className="container">
                      <br/>
                        <h1 className="title">AI Settings</h1>
                    </div>
                </div>
        <div className="generation__page">
          {/* Generation Header */}
          <div className="generation_header">
          <div className="container">
            <div className="header_bottom">
              <form onSubmit={handleSubmit}>
                
                
                <div className="form_group">
                <textarea
                  id="system_bio"
                  className="full_width"
                  value={systemBio}
                  onChange={(e) => setSystemBio(e.target.value)}
                  rows={10} // Increased height
                  style={{
                    resize: 'vertical', // Allows vertical resizing by user
                    overflow: 'auto', // Adds scroll when content overflows
                  }}
                  placeholder="Additional information about your business or frequently asked questions that you want your customers to know"
                  required
                />
                </div>
                <br/>

                <label className="fn__toggle">
                  <span className="t_in">
                    <input 
                      type="checkbox" 
                      checked={autoEngage} 
                      id="auto_engage" 
                      onChange={(e) => setAutoEngage(e.target.checked)} 
                      readOnly={premium}
                    />

                    <span className="t_slider" />
                    <span className="t_content" />
                  </span>
                  Enable auto engagement - AI handles all customer engagement.
                </label>

                <br/>

                <label className="fn__toggle">
                  <span className="t_in">
                    <input 
                      type="checkbox" 
                      checked={humanTakeOver} 
                      id="human_takeover" 
                      onChange={(e) => setHumanTakeOver(e.target.checked)} 
                      readOnly={premium}
                    />

                    <span className="t_slider" />
                    <span className="t_content" />
                  </span>
                  Enable human-AI collaboration - Conversations are automatically escalated if beyond AI functions
                </label>

                <br/>

                <label className="fn__toggle">
                  <span className="t_in">
                    <input 
                      type="checkbox" 
                      checked={autoFeedBack} 
                      id="auto_feedback" 
                      readOnly={premium}
                      onChange={(e) => setAutoFeedBack(e.target.checked)} 
                    />

                    <span className="t_slider" />
                    <span className="t_content" />
                  </span>
                  Enable feedback collection - collect customer feedback after a sale.
                </label>

                <br/>

                <label className="fn__toggle">
                  <span className="t_in">
                    <input 
                      type="checkbox" 
                      checked={autoMarketing} 
                      id="human_takeover" 
                      onChange={(e) => setAutoMarketing(e.target.checked)} 
                      readOnly={premium}
                    />

                    <span className="t_slider" />
                    <span className="t_content" />
                  </span>
                  Enable marketing - Auto targeted marketing and upsells.
                </label>

                <br/>
                
                  {outputType === "text" && (<div className="form_group">
                  {functions.map((func, index) => (
                    <div key={index} className="function_group">
                      <button type="button" className="techwave_fn_button" onClick={() => handleRemoveFunction(index)}>- Remove Function</button>
                      <br/>
                      <input
                        type="text"
                        className="full_width"
                        placeholder="Function Name"
                        value={func.name}
                        onChange={(e) => handleFunctionChange(index, 'name', replaceAccents(e.target.value))}
                        required
                      />
                      <br/><br/>
                      <textarea
                        className="full_width"
                        placeholder="Function Description - What the bot does with this function"
                        value={func.description}
                        onChange={(e) => handleFunctionChange(index, 'description', e.target.value)}
                        rows={2}
                        required
                      />
                      <br/>
                      <input
                        type="text"
                        className="full_width"
                        placeholder="Function Api - Your api to perform function on your application."
                        value={func.api}
                        onChange={(e) => handleFunctionChange(index, 'api', e.target.value)}
                        required
                      />
                      <br/><br/>
                      <div className="parameter_section">
                        <h4>Parameters</h4>
                        <p>The required data to perform this function successfully</p>
                        {Object.keys(func.parameterConfig).map((paramIndex) => (
                          <div key={paramIndex} className="parameter_group">
                            <input
                              type="text"
                              className="full_width"
                              placeholder="Parameter Name"
                              value={func.parameterConfig[paramIndex].name}
                              onChange={(e) =>
                                handleParameterChange(index, paramIndex, 'name', replaceAccents(e.target.value).toLowerCase())
                              }
                              required
                            />
                            <br/><br/>
                            <input
                              type="text"
                              className="full_width"
                              placeholder="Parameter Description"
                              value={func.parameterConfig[paramIndex].description}
                              onChange={(e) =>
                                handleParameterChange(index, paramIndex, 'description', e.target.value)
                              }
                              required
                            />
                            <br/><br/>
                            <select
                              className="full_width"
                              value={func.parameterConfig[paramIndex].type}
                              onChange={(e) =>
                                handleParameterChange(index, paramIndex, 'type', e.target.value)
                              }
                            >
                              <option value="string">String</option>
                              <option value="number">Number</option>
                              <option value="boolean">Boolean</option>
                            </select>
                            <br/>
                           
                            <button type="button" className="techwave_fn_button" onClick={() => handleRemoveParameter(index, paramIndex)}>- Remove Parameter</button>
                            <br/>
                          </div>
                        ))}
                        <br/>
                        <button type="button" className="techwave_fn_button" onClick={() => handleAddParameter(index)}>+ Add Parameter</button>
                        <br/>
                      </div>
                      <br/>
                      
                    </div>
                  ))}
                  <br/>
                  
                  <button type="button" className="techwave_fn_button" onClick={handleAddFunction}>+ Add Function</button>
              
                  <br/>
                </div>)}
                <br/>
                <p style={{ color: "red"}}>{error}</p>
                <br/>
                <div className="generate_section">
                  <button type="submit" className="techwave_fn_button" aria-readonly={loading}>
                    <span>Update AI {loading && <FontAwesomeIcon icon={faSpinner} spin={true} />} {saved && <FontAwesomeIcon icon={faCheckCircle} />}</span>
                  </button>
                </div>
              </form>
            </div>
            </div>
          </div>
          {/* !Generation Header */}
        </div>
      </div>
    </>
  );
}
