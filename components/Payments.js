'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faEye, faChartSimple } from '@fortawesome/free-solid-svg-icons'
import PaymentsList from './PaymentsList';
import Payment from './Payment';


export default function Payments({ org }) {
    const [paymentProcessors] = useState(org?.payment_processors);
    const [activeIndex, setActiveIndex] = useState(2);
    const [viewPayment, setViewPayment] = useState();

    
    const fetchPayment = async (id) => {
    
        const response = await axios.get(
        `/api/integration/payments/get-payment-info?id=${id}`
        );
        setViewPayment(response.data)
    };

    const handleOnClick = (index) => {
        setActiveIndex(index);
    };

    const handlePayment = async (id) => {
        await fetchPayment(id)
        setActiveIndex(3)
    };

    return (
        <>
            <div className="techwave_fn_models_page">
                <div className="fn__title_holder">
                    <div className="container">
                        <h1 className="title">Payments</h1>
                    </div>
                </div>
                {/* Models */}
                <div className="techwave_fn_models">
                    <div className="fn__tabs">
                        
                        <div className="container">
                            <div className="tab_in">
                                {/* <a className={activeIndex === 1 ? "active" : ""} onClick={() => handleOnClick(1)}>Summary</a> */}
                                {/* <a className={activeIndex === 1 ? "active" : ""} onClick={() => handleOnClick(1)}>Account</a> */}
                                <a className={activeIndex === 2 ? "active" : ""} onClick={() => handleOnClick(2)}>Transactions</a>
                                {viewPayment && <a className={activeIndex === 3 ? "active" : ""} onClick={() => handleOnClick(3)}>Payment Details - {viewPayment.id}</a>}
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
                 
                                        {stripeConnectInstance && (
                                            <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
                                                <ConnectNotificationBanner />
                                            </ConnectComponentsProvider>
                                            )}

                                        {stripeConnectInstance && (
                                        <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
                                            <ConnectBalances />
                                        </ConnectComponentsProvider>
                                        )}
                                    </div> */}
                                    <div id="tab2" className={activeIndex === 2 ? "tab__item active" : "tab__item"}>
                                       {paymentProcessors && paymentProcessors.length < 1 && <PaymentsList handlePayment={handlePayment} />}
                                       {paymentProcessors && paymentProcessors.length < 1 && <p>Payments is not setup for your business. <br/><br/><a href="/integration/payments" className="techwave_fn_button" type="submit">Activate Payments</a></p>}
                                    </div>
                                    <div id="tab3" className={activeIndex === 3 ? "tab__item active" : "tab__item"}>
                                    {paymentProcessors && paymentProcessors.length > 0 &&  viewPayment && <Payment viewPayment={viewPayment}  />}
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