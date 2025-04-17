'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faEye, faChartSimple } from '@fortawesome/free-solid-svg-icons'
import Products from './Products';
import NewProduct from './NewProduct';


export default function Catalog() {

    const [activeIndex, setActiveIndex] = useState(1);
    const [viewProduct, setViewProduct] = useState();

    
    const fetchProduct = async (id) => {
    
        const response = await axios.get(
        `/api/catalog/get-product`
        );
        setViewProduct(response.data)
    };

    const handleOnClick = (index) => {
        setActiveIndex(index);
    };

    const handleProduct = async (id) => {
        setActiveIndex(2)
    };

    const createProduct = async (id) => {
        await fetchProduct(id)
        setActiveIndex(2)
    };


    return (
        <>
            <div className="techwave_fn_models_page">
                <div className="fn__title_holder">
                    <div className="container">
                        <h1 className="title">Catalog</h1>
                    </div>
                </div>
                {/* Models */}
                <div className="techwave_fn_models">
                    <div className="fn__tabs">
                        <div className="container">
                            <div className="tab_in">
                                <a className={activeIndex === 1 ? "active" : ""} onClick={() => handleOnClick(1)}>All Items</a>
                                <a className={activeIndex === 2 ? "active" : ""} onClick={() => handleOnClick(2)}>New Item</a>
                                {viewProduct && <a className={activeIndex === 3 ? "active" : ""} onClick={() => handleOnClick(3)}>Details - {viewProduct.name}</a>}
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
                                       <Products handleProduct={handleProduct} />
                                    </div>
                                    <div id="tab2" className={activeIndex === 2 ? "tab__item active" : "tab__item"}>
                                        <NewProduct />
                                    </div>
                                    <div id="tab3" className={activeIndex === 3 ? "tab__item active" : "tab__item"}>
                                    {/* {viewPayment && <Payment viewPayment={viewPayment}  />} */}
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