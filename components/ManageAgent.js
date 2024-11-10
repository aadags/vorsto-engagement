'use client'
import React, { useState, useEffect } from 'react'
import { getBot } from '@/services/botService'
import { getTools } from '@/services/toolService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { replaceAccents } from '@/utils/helper'
import { getUser } from '@/services/userService';

export default function ManageAgent() {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [model, setModel] = useState('');
  const [key, setKey] = useState('');
  const [hook, setHook] = useState('');
  const [systemBio, setSystemBio] = useState('');
  const [outputType, setOutputType] = useState('');
  const [outputParameter, setOutputParameter] = useState([]);
  const [functions, setFunctions] = useState([]);
  const [pageLoad, setPageLoad] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBot = async () => {
      try {
        setPageLoad(true);
        const bot = await getBot();
        setId(bot.id);
        setName(bot.id);
        setModel(bot.model);
        setKey(bot.key);
        setHook(bot.api_hook);
        setSystemBio(bot.system_bio);
        setOutputType(bot.output_type);
        setOutputParameter([]);

        const tools = await getTools(bot.id);
        
        const transformedFunctions = tools.map(tool => ({
          name: tool.name,
          description: tool.description,
          api: tool.api,
          parameterConfig: Object.keys(tool.parameters || {}).reduce((acc, key, index) => {
            acc[index] = tool.parameters[key];
            return acc;
          }, {})
        }));

        setFunctions(transformedFunctions);
        setPageLoad(false);

      } catch (error) {
        console.log(error);
      } finally {
      }
    };

    fetchBot();
  }, []);

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
  
    const confirmation = window.confirm("Are you sure you want to update the changes to your agent?");
  
    if (!confirmation) {
      return; // Exit the function if the user cancels the action
    }
  
    setLoading(true);
    const botData = { id: id, name, systemBio, model, hook, key, functions, outputType, outputParameter };
  
    try {
      const response = await fetch('/api/update-bot', {
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
  

  return (
    <>
      <div className="techwave_fn_image_generation_page">
        <div className="generation__page">
          {/* Generation Header */}
          <div className="generation_header">
            <div className="header_top">
              <h1 className="title">Setup Agent</h1>
            </div>
            {!pageLoad &&
            <div className="header_bottom">
              <form onSubmit={handleSubmit}>
                <div className="form_group">
                  <textarea
                    id="system_bio"
                    className="full_width"
                    value={systemBio}
                    onChange={(e) => setSystemBio(e.target.value)}
                    rows={4}
                    placeholder="General information about your agent, what your agent can do"
                    required
                  />
                </div>
                <br/>
                
                {model !== "vorsto-xa-2" && ( <div className="form_group">
                  <input
                    type="text"
                    id="bot_key"
                    className="full_width"
                    placeholder="Model Api Key"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    required
                  />
                </div>)}
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
                    <span>Update Agent {loading && <FontAwesomeIcon icon={faSpinner} spin={true} />} {saved && <FontAwesomeIcon icon={faCheckCircle} />}</span>
                  </button>
                </div>
              </form>
            </div>}
          </div>
          {/* !Generation Header */}
        </div>
      </div>
    </>
  );
}
