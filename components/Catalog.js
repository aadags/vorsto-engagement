'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faEye, faChartSimple } from '@fortawesome/free-solid-svg-icons'
import Products from './Products';
import ProductsInactive from './ProductsInactive';
import NewProduct from './NewProduct';
import EditProduct from './EditProduct';
import ViewProduct from './ViewProduct';


export default function Catalog() {

    const [activeIndex, setActiveIndex] = useState(1);
    const [viewProduct, setViewProduct] = useState();
    const [editProduct, setEditProduct] = useState();

    const handleOnClick = (index) => {
        setActiveIndex(index);
    };

    const handleProduct = async (name, id) => {
        setEditProduct({ name, id});
        setActiveIndex(4)
    };    
    
    const handleViewProduct = async (name, id) => {
        setViewProduct({ name, id});
        setActiveIndex(3)
    };



    return (
        <>
            <div className="techwave_fn_models_page">
                <div className="fn__title_holder">
                    <div className="container">
                        <h1 className="title">Catalog</h1>
                        <button className="techwave_fn_button" onClick={() => handleOnClick(5)} style={{ float: "right" }}>Deactivated Items</button>
                    </div>
                </div>
                {/* Models */}
                <div className="techwave_fn_models">
                    <div className="fn__tabs">
                        <div className="container">
                            <div className="tab_in">
                                <a className={activeIndex === 1 ? "active" : ""} onClick={() => handleOnClick(1)}>All Items</a>
                                {viewProduct && <a className={activeIndex === 3 ? "active" : ""} onClick={() => handleOnClick(3)}>Details - {viewProduct.name}</a>}
                                {editProduct && <a className={activeIndex === 4 ? "active" : ""} onClick={() => handleOnClick(4)}>Edit - {editProduct.name}</a>}
                                <a className={activeIndex === 2 ? "active" : ""} onClick={() => handleOnClick(2)}>New Item</a>
                                {activeIndex === 5 && <a className={activeIndex === 2 ? "active" : ""} onClick={() => handleOnClick(2)}>Deactivated Items</a>}
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
                                        {activeIndex === 1 && <Products viewProduct={handleViewProduct} handleProduct={handleProduct} />}
                                    </div>
                                    <div id="tab2" className={activeIndex === 2 ? "tab__item active" : "tab__item"}>
                                        <NewProduct />
                                    </div>
                                    <div id="tab3" className={activeIndex === 3 ? "tab__item active" : "tab__item"}>
                                        {viewProduct && <ViewProduct productId={viewProduct.id}  />}
                                    </div>
                                    <div id="tab4" className={activeIndex === 4 ? "tab__item active" : "tab__item"}>
                                        {editProduct && <EditProduct productId={editProduct.id}  />}
                                    </div>
                                    <div id="tab5" className={activeIndex === 5 ? "tab__item active" : "tab__item"}>
                                        {activeIndex === 5 && <ProductsInactive />}
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