'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faShoppingCart, faCheck, faCancel, } from '@fortawesome/free-solid-svg-icons'
import DataTable, { createTheme } from "react-data-table-component";
import { getUser } from '@/services/userService';
import ActiveNumbers from './ActiveNumbers';


export default function VoiceSetup() {

  const router = useRouter();

    const [activeIndex, setActiveIndex] = useState(1);
    const [selectedTag, setSelectedTag] = useState('');
    const [addPhone, setAddPhone] = useState(false);
    const [myPhoneList, setMyPhoneList] = useState(false);
    const [phoneList, setPhoneList] = useState();
    const [country, setCountry] = useState("");
    const [state, setState] = useState("");
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [user, setUser] = useState();
    const [numberPlans, setNumberPlans] = useState();

    
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
    }, [])



    const columns = [
      {
        name: "Phone Number",
        selector: (row) => row.friendlyName,
        sortable: true,
      },
      {
        name: "Locality",
        selector: (row) => row.locality
      },
      {
        name: "Voice",
        selector: (row) => (
          <div>
            {row.capabilities.voice? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faCancel} />}
          </div>
        )
      },
      {
        name: "SMS",
        selector: (row) => (
          <div>
            {row.capabilities.SMS? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faCancel} />}
          </div>
        )
      },
      {
        name: "Monthly Fee",
        selector: (row) => numberPlans && (numberPlans.plan=="free" || numberPlans.free > 0)? "$1.50" : "free"
      },
      {
        name: "Actions",
        cell: (row) => (
          <div>
            {numberPlans && (numberPlans.plan=="free" || numberPlans.free > 0)?
             user && <a href={`https://buy.stripe.com/${process.env.NEXT_PUBLIC_NUMBER_BUY_LINK}?client_reference_id=${user.organization_id}${row.phone_number}&prefilled_email=${user.email}`}>
              <FontAwesomeIcon icon={faShoppingCart} /> Buy
            </a> :
            <a href={`#`} onClick={()=>activateNumber(row)}>
              <FontAwesomeIcon icon={faShoppingCart} /> Activate
            </a>}
            <br />
          </div>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
      },
    ];

    const handleOnClick = (index) => {
        setActiveIndex(index);
        setSelectedTag('');
    };

    const addPhoneNumber = () => {
      setAddPhone(true);
      handleOnClick(2);
      
    };

    createTheme("dark", {
      background: {
        default: "transparent",
        color: "#000",
      },
    });

  const fetchPhoneNumbers = async (page) => {

    if(!country)
    {
      alert("country is required!");
      return false;
    }
    setPhoneList([]);
    setLoading(true);

    const response = await axios.get(
      `/api/get-phone-numbers?code=${country}&state=${state}&page=${page}&per_page=${perPage}`
    );

    setPhoneList(response.data);
    setTotalRows(5000);
    setLoading(false);
    fetchNumberPlans();
  };

  const handlePageChange = (page) => {
    fetchPhoneNumbers(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);

    const response = await axios.get(
      `/api/get-phone-numbers?code=${country}&state=${state}&page=${page}&per_page=${perPage}`
    );

    setPhoneList(response.data);
    fetchNumberPlans();
    setPerPage(newPerPage);
    setLoading(false);
  };

  const fetchNumberPlans = async () => {
    const response = await axios.get(`/api/get-number-plans`);
    setNumberPlans(response.data);
  };

  const activateNumber = async (numberData) => {
    const confirmAction = window.confirm(`Are you sure you want to activate ${numberData.friendlyName}?`);
    if (!confirmAction) return;
  
    try {
      const response = await axios.post(`/api/activate-number`, { numberData });
      if(response.data.status)
      {
        router.refresh();
      }
      
    } catch (error) {
      console.error("Error activating number:", error);
      alert("Error activating number");
    }
  };
  

    return (
        <>
            <div className="techwave_fn_models_page">
                <div className="fn__title_holder">
                    <div className="container">
                        <h1 className="title">Voice Setup</h1>
                    </div>
                </div>
                {/* Models */}
                <div className="techwave_fn_models">
                    <div className="fn__tabs">
                        <div className="container">
                            <div className="tab_in">
                                <a className={activeIndex === 1 ? "active" : ""} onClick={() => handleOnClick(1)}>Phone Numbers</a>
                                {addPhone && <a className={activeIndex === 2 ? "active" : ""} onClick={() => handleOnClick(2)}>Add Phone Number</a>}
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
                                        {numberPlans && (numberPlans.plan=="free" || numberPlans.free > 0)?
                                        <Link href="#" onClick={addPhoneNumber} className="techwave_fn_button"><span><FontAwesomeIcon icon={faPlus} /> Buy Phone Number</span></Link>
                                        :
                                        <Link href="#" onClick={addPhoneNumber} className="techwave_fn_button"><span><FontAwesomeIcon icon={faPlus} /> Get Free Phone Number</span></Link>
                                        }
                                      </div>

                                      <ActiveNumbers />
                                      
                                        
                                    </div>
                                    <div id="tab1" className={activeIndex === 2 ? "tab__item active" : "tab__item"}>
                                      
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "80%" }}>
                                      <select 
                                        style={{ width: "35%" }}
                                        onChange={(e) => setCountry(e.target.value)}
                                      >
                                        <option value="">Select Country</option>
                                        <option value="CA">Canada</option>
                                        <option value="US">United States of America</option>
                                      </select>
                                      <input style={{ width: "35%" }} type="text" placeholder="region" onChange={(e) => setState(e.target.value)} />
                                      <Link 
                                        href="#" 
                                        onClick={fetchPhoneNumbers}
                                        className="techwave_fn_button" 
                                      >
                                        <span>Search</span>
                                      </Link>
                                    </div>
                                    <br/><br/>
                                   {phoneList && country && <DataTable
                                      title={`Available Phone Numbers`}
                                      columns={columns}
                                      data={phoneList}
                                      progressPending={loading}
                                      pagination
                                      paginationServer
                                      paginationTotalRows={totalRows}
                                      onChangeRowsPerPage={handlePerRowsChange}
                                      onChangePage={handlePageChange}
                                      theme="light"
                                    />}

                                      
                                        
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