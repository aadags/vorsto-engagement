'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faEye, faChartSimple } from '@fortawesome/free-solid-svg-icons'
import OrderList from './OrderList';
import ViewOrder from './ViewOrder';
import CustomersList from './CustomersList';
import CustomerMetric from './CustomerMetric';

export default function Customers() {

    const [activeIndex, setActiveIndex] = useState(1);
    const [customer, setCustomer] = useState();

    const handleOnClick = (index) => {
        setActiveIndex(index);
    };
    
    const handleViewCustomer = async (id) => {
        setCustomer({id});
        setActiveIndex(2)
    };

    return (
        <>
            <div className="techwave_fn_models_page">
                <div className="fn__title_holder">
                    <div className="container">
                        <h1 className="title">Customers</h1>
                    </div>
                </div>
                {/* Models */}
                <div className="techwave_fn_models">
                    <div className="fn__tabs">
                        <div className="container">
                            <div className="tab_in">
                                <a className={activeIndex === 1 ? "active" : ""} onClick={() => handleOnClick(1)}>All Customers</a>
                                {customer && <a className={activeIndex === 2 ? "active" : ""} onClick={() => handleOnClick(2)}>Customer: {customer.id}</a>}
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
                                    {/* <div id="tab1" className={activeIndex === 1 ? "tab__item active" : "tab__item"}>
                                        
                                    </div> */}
                                    <div id="tab1" className={activeIndex === 1 ? "tab__item active" : "tab__item"}>
                                        <CustomersList viewCustomer={handleViewCustomer} />
                                    </div>
                                    <div id="tab2" className={activeIndex === 2 ? "tab__item active" : "tab__item"}>
                                        {customer && <CustomerMetric contactId={customer.id} />}
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