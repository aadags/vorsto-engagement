"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { getBots } from '@/services/botService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog } from '@fortawesome/free-solid-svg-icons'

export default function Agents() {

    const [bots, setBots] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
        
      const fetchBots = async () => {
        try {
          setLoading(true);
          const bots = await getBots();
          setBots(bots);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchBots();
    }, [])

    // Initialize your component state
    const [activeIndex, setActiveIndex] = useState(1);
    const [selectedTag, setSelectedTag] = useState('');

    const handleOnClick = (index) => {
        setActiveIndex(index);
        setSelectedTag('');
    };




    return (
        <>
            <div className="techwave_fn_models_page">
                {/* Models */}
                <div className="techwave_fn_models">
                    <div className="fn__tabs">
                        <div className="container">
                            <div className="tab_in">
                                <a className={activeIndex === 1 ? "active" : ""} onClick={() => handleOnClick(1)}>My Agents</a>
                            </div>
                        </div>
                    </div>
                
                    <div className="container">
                        {/* models content */}
                        <div className="models__content">
                            <div className="models__results">
                                {loading &&
                                <div className="fn__preloader">
                                    <div className="icon" />
                                    <div className="text">Loading</div>
                                </div>}
                                <div className="fn__tabs_content">
                                    <div id="tab1" className={activeIndex === 1 ? "tab__item active" : "tab__item"}>
                                        <ul className="fn__model_items">
                                            {/*  model item goes here */}{
                                                bots.map((bot, index) => (
                                                    <li key={index} className="fn__model_item">
                                                        <div className="item">
                                                            <div className="item__info">
                                                                <h3 className="title">{bot.name}</h3>
                                                            </div>
                                                            <div className="item__author">
                                                                <h3 className="author_name"><a href={"/agent/"+bot.id}><FontAwesomeIcon icon={faCog} /> Configure</a></h3>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                        </ul>
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
