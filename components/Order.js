'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faEye, faChartSimple } from '@fortawesome/free-solid-svg-icons'
import OrderList from './OrderList';
import OrderListTwo from './OrderListTwo';
import ViewOrder from './ViewOrder';

export default function Order({org}) {

    const [activeIndex, setActiveIndex] = useState(1);
    const [viewOrder, setViewOrder] = useState();
    const [paymentProcessors, setPaymentprocessors] = useState(org?.payment_processors);
    const [isZuppr] = useState(window.location.hostname.includes(process.env.NEXT_PUBLIC_ZUPPR_API));

    const handleOnClick = (index) => {
        setActiveIndex(index);
    };
    
    const handleViewOrder = async (id) => {
        setViewOrder({id});
        setActiveIndex(2)
    };

    return (
        <>
            <div className="techwave_fn_models_page">
                <div className="fn__title_holder">
                    <div className="container">
                        <h1 className="title">Orders</h1>
                    </div>
                </div>
                {/* Models */}
                <div className="techwave_fn_models">
                    <div className="fn__tabs">
                        <div className="container">
                            <div className="tab_in">
                                <a className={activeIndex === 1 ? "active" : ""} onClick={() => handleOnClick(1)}>{isZuppr? 'All Orders' : 'Online Orders'}</a>
                                {!isZuppr && <a className={activeIndex === 3 ? "active" : ""} onClick={() => handleOnClick(3)}>In-Person Orders</a>}
                                {viewOrder && <a className={activeIndex === 2 ? "active" : ""} onClick={() => handleOnClick(2)}>Order Id: {viewOrder.id}</a>}
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
                                        {paymentProcessors && paymentProcessors.length < 1 && <p>Payments is not setup for your business. <br/><br/><a href="/integration/payments" className="techwave_fn_button" type="submit">Activate Payments</a></p>}
                                        {paymentProcessors && paymentProcessors.length > 0 && activeIndex === 1 && <OrderList viewOrder={handleViewOrder} />}
                                    </div>
                                    <div id="tab2" className={activeIndex === 2 ? "tab__item active" : "tab__item"}>
                                        {viewOrder && <ViewOrder orderId={viewOrder.id} />}
                                    </div>
                                    <div id="tab3" className={activeIndex === 3 ? "tab__item active" : "tab__item"}>
                                        {paymentProcessors && paymentProcessors.length < 1 && <p>Payments is not setup for your business. <br/><br/><a href="/integration/payments" className="techwave_fn_button" type="submit">Activate Payments</a></p>}
                                        {paymentProcessors && paymentProcessors.length > 0 && activeIndex === 3 && <OrderListTwo viewOrder={handleViewOrder} />}
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