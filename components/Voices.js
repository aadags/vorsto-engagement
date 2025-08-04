'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Voice from '@/components/Voice'
import VoiceLog from './VoiceLog';
import Sip from './Sip';


export default function Voices({ org }) {

    const [activeIndex, setActiveIndex] = useState(1);

    const handleOnClick = (index) => {
        setActiveIndex(index);
    };

    return (
        <>
            <div className="techwave_fn_models_page">
                <div className="fn__title_holder">
                    <div className="container">
                        <h1 className="title">Chats</h1>
                    </div>
                </div>
                {/* Models */}
            
                <div className="techwave_fn_models">
                    <div className="fn__tabs">
                        <div className="container">
                            <div className="tab_in">
                                <a className={activeIndex === 3 ? "active" : ""} onClick={() => handleOnClick(3)}>Phone Device</a>
                                <a className={activeIndex === 1 ? "active" : ""} onClick={() => handleOnClick(1)}>Queue</a>
                                <a className={activeIndex === 2 ? "active" : ""} onClick={() => handleOnClick(2)}>Log</a>
                                {/* <a className={activeIndex === 2 ? "active" : ""} onClick={() => handleOnClick(2)}>Media</a>
                                <a className={activeIndex === 3 ? "active" : ""} onClick={() => handleOnClick(3)}>Site Settings</a> */}
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
                                        {activeIndex === 1 && <Voice org={org} />}
                                    </div>
                                    <div id="tab2" className={activeIndex === 2 ? "tab__item active" : "tab__item"}>
                                        {activeIndex === 2 && <VoiceLog org={org} />}
                                    </div>
                                    <div id="tab3" className={activeIndex === 3 ? "tab__item active" : "tab__item"}>
                                        {activeIndex === 3 && <Sip org={org} />}
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