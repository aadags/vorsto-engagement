'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faShoppingCart, faCheck, faCancel, faEdit, } from '@fortawesome/free-solid-svg-icons'
import DataTable, { createTheme } from "react-data-table-component";
import { getUser } from '@/services/userService';
import ManageAgent from './ManageAgent';
import EditAgent from './EditAgent';
import PreModels from './PreModels';


export default function AgentSetup() {

  const router = useRouter();

    const [activeIndex, setActiveIndex] = useState(1);
    const [selectedTag, setSelectedTag] = useState('');
    const [addAgent, setAddAgent] = useState(false);
    const [edditAgent, setEdditAgent] = useState(false);
    const [edditAgentData, setEdditAgentData] = useState(false);
    const [addPreAgent, setAddPreAgent] = useState(false);
    const [agentsList, setAgentsList] = useState();
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [user, setUser] = useState();

    
    useEffect(() => {
          
      const fetchUser = async () => {
        try {
          const user = await getUser();
          setUser(user);
        } catch (error) {
          console.log(error);
        }
      };

      fetchUser();
      fetchAgents(1);
    }, [])



    const columns = [
      {
        name: "Name",
        selector: (row) => row.name,
        sortable: true,
      },
      {
        name: "Type",
        selector: (row) => row.category,
        sortable: true,
      },
      {
        name: "Actions",
        cell: (row) => (
          <div>
            <a href={`#`} onClick={() => editAgent(row)}>
              <FontAwesomeIcon icon={faEdit} /> Update
            </a>
            <br />
          </div>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
      },
      {
        name: "",
        cell: (row) => (
          <div>
            <a href={`#`} onClick={() => deleteAgent(row)}>
              <FontAwesomeIcon icon={faCancel} /> Delete
            </a>
            <br />
          </div>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
      }
    ];

    const handleOnClick = (index) => {
        setActiveIndex(index);
        setSelectedTag('');
    };

    const addAiAgent = () => {
      setAddAgent(true);
      handleOnClick(2);
      
    };    
    
    const addPreAiAgent = () => {
      handleOnClick(4);
      setAddPreAgent(true);
    };

    const editAgent = (row) => {
      setEdditAgent(true);
      setEdditAgentData(row);
      handleOnClick(3);
    };

    createTheme("dark", {
      background: {
        default: "transparent",
        color: "#000",
      },
    });

  const fetchAgents = async (page) => {

    setLoading(true);

    const response = await axios.get(
      `/api/get-installed-agents?page=${page}&per_page=${perPage}`
    );

    setAgentsList(response.data.data);
    setTotalRows(response.data.count);
    setLoading(false);
  };

  const handlePageChange = (page) => {
    fetchAgents(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);

    const response = await axios.get(
      `/api/get-installed-agents?page=${page}&per_page=${perPage}`
    );

    setAgentsList(response.data.data);
    setPerPage(newPerPage);
    setLoading(false);
  };

  const deleteAgent = async (agent) => {
    const confirmAction = window.confirm(`Confirm you want to delete ${agent.name}?`);
    if (!confirmAction) return;

    try {
      const response = await axios.post(`/api/delete-bot`, { id: agent.id });
      if(response.data.status)
      {
        router.refresh();
      }
    } catch (error) {
      console.error("Error delete agent:", error);
      alert("Error delete agent");
    }
  };
  

    return (
        <>
            <div className="techwave_fn_models_page">
                <div className="fn__title_holder">
                    <div className="container">
                        <h1 className="title">AI Agents</h1>
                        <p className="description">Activate and configure the appropriate agents for your business</p>
                    </div>
                </div>
                {/* Models */}
                <div className="techwave_fn_models">
                    <div className="fn__tabs">
                        <div className="container">
                            <div className="tab_in">
                                <a className={activeIndex === 1 ? "active" : ""} onClick={() => handleOnClick(1)}>Installed Agents</a>
                                {addAgent && <a className={activeIndex === 2 ? "active" : ""} onClick={() => handleOnClick(2)}>Add Custom Agent</a>}
                                {edditAgent && edditAgentData && <a className={activeIndex === 3 ? "active" : ""} onClick={() => handleOnClick(2)}>Edit {edditAgentData.name}</a>}
                                {addPreAgent && <a className={activeIndex === 4 ? "active" : ""} onClick={() => handleOnClick(4)}>Preconfigured Agents</a>}
                            </div>
                        </div>
                    </div>
                   
                    <div className="container">
                        {/* models content */}
                        <div className="models__content">
                            <div className="models__results">
                                <div className="fn__preloader">
                                    <div className="icon" />
                                    <div className="text">Loading</div>
                                </div>
                                <div className="fn__tabs_content">
                                    <div id="tab1" className={activeIndex === 1 ? "tab__item active" : "tab__item"}>
                      
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "flex-end",
                                          marginBottom: "10px",
                                        }}
                                      >
                                        <Link href="#" onClick={addPreAiAgent} className="techwave_fn_button"><span><FontAwesomeIcon icon={faPlus} /> PreConfigured Agents</span></Link>{' '}
                                        <Link href="#" onClick={addAiAgent} className="techwave_fn_button"><span><FontAwesomeIcon icon={faPlus} /> Custom Agent</span></Link>
                                      </div>

                                      {agentsList && <DataTable
                                      title={``}
                                      columns={columns}
                                      data={agentsList}
                                      progressPending={loading}
                                      pagination
                                      paginationServer
                                      paginationTotalRows={totalRows}
                                      onChangeRowsPerPage={handlePerRowsChange}
                                      onChangePage={handlePageChange}
                                      theme="light"
                                    />}
        
                                    </div>
                                    <div id="tab1" className={activeIndex === 2 ? "tab__item active" : "tab__item"}>
                                      <ManageAgent />
                                    </div>
                                    <div id="tab1" className={activeIndex === 3 ? "tab__item active" : "tab__item"}>
                                      {edditAgentData && <EditAgent agent={edditAgentData} />}
                                    </div>
                                    <div id="tab1" className={activeIndex === 4 ? "tab__item active" : "tab__item"}>
                                      {addPreAgent && <PreModels />}
                                    </div>
                                   
                                </div>
                            </div>
                        </div>
                        {/* !models content */}
                    </div>
                </div>
                {/* !Models */}
            </div>

        </>
    )
}