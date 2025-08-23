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
import Categories from './Categories';
import EditCategory from './EditCategory';
import ConfigureIngredientUsages from './IngredientUsage';
import Ingredients from './Ingredients';
import CostAnalysis from './CostAnalysis';
import Deals from './Deals';
import NewDeal from './NewDeal';
import UpdateDeal from './UpdateDeal';


export default function Catalog({ org, cat }) {

    const [activeIndex, setActiveIndex] = useState(1);
    const [viewProduct, setViewProduct] = useState();
    const [editProduct, setEditProduct] = useState();
    const [editProductIngredient, setEditProductIngredient] = useState();
    const [editCategory, setEditCategory] = useState();
    const [editDeal, setEditDeal] = useState();
    const [paymentProcessors, setPaymentprocessors] = useState(org?.payment_processors);

    const handleOnClick = (index) => {
        setActiveIndex(index);
    };

    const handleProduct = async (name, id) => {
        setEditProduct({ name, id});
        setActiveIndex(4)
    }; 

    const handleIngredients = async (name, id) => {
        setEditProductIngredient({ name, id});
        setActiveIndex(8)
    }; 
    
    const handleCat = async (name, id) => {
        setEditCategory({ name, id});
        setActiveIndex(7)
    }; 

    const handleIng = async (name, id) => {
        setEditProductIngredient({ name, id});
        setActiveIndex(9)
    }; 
    
    const handleViewProduct = async (name, id) => {
        setViewProduct({ name, id});
        setActiveIndex(3)
    };

    const handleEditDeal = async (id, title) => {
        setEditDeal({id, title});
        setActiveIndex(12)
    };    
    
    const setShowAddForm = async (id) => {
        setActiveIndex(13)
    };


    return (
        <>
            <div className="techwave_fn_models_page">
                <div className="fn__title_holder">
                    <div className="container">
                        <h1 className="title">Catalog</h1>
                        {paymentProcessors  && paymentProcessors.length > 0 &&<button className="techwave_fn_button" onClick={() => handleOnClick(5)} style={{ float: "right" }}>Deactivated Items</button>}
                        {paymentProcessors && paymentProcessors.length > 0 &&<button className="techwave_fn_button" onClick={() => handleOnClick(6)} style={{ float: "right", marginRight: "5px" }}>Categories</button>}
                        {org.type === "Food" && paymentProcessors && paymentProcessors.length > 0 &&<button className="techwave_fn_button" onClick={() => handleOnClick(9)} style={{ float: "right", marginRight: "5px" }}>Ingredients</button>}
                        {org.type === "Food" && paymentProcessors && paymentProcessors.length > 0 &&<button className="techwave_fn_button" onClick={() => handleOnClick(10)} style={{ float: "right", marginRight: "5px" }}>Costing Analysis</button>}
                        {org.type === "Food" && paymentProcessors && paymentProcessors.length > 0 &&<button className="techwave_fn_button" onClick={() => handleOnClick(11)} style={{ float: "right", marginRight: "5px" }}>Deals</button>}
                    </div>
                </div>
                {/* Models */}
                {paymentProcessors && paymentProcessors.length < 1 &&
                    <div className="techwave_fn_models">
                        <div className="container">
                            <p>Payments is not setup for your business. <br/><br/><a href="/integration/payments" className="techwave_fn_button" type="submit">Activate Payments</a></p>
                        </div>
                    </div>
                }
                {paymentProcessors && paymentProcessors.length > 0 && <div className="techwave_fn_models">
                    <div className="fn__tabs">
                        <div className="container">
                            <div className="tab_in">
                                <a className={activeIndex === 1 ? "active" : ""} onClick={() => handleOnClick(1)}>All Items</a>
                                {viewProduct && <a className={activeIndex === 3 ? "active" : ""} onClick={() => handleOnClick(3)}>Details - {viewProduct.name}</a>}
                                {editProduct && <a className={activeIndex === 4 ? "active" : ""} onClick={() => handleOnClick(4)}>Edit - {editProduct.name}</a>}
                                <a className={activeIndex === 2 ? "active" : ""} onClick={() => handleOnClick(2)}>New Item</a>
                                {activeIndex === 5 && <a className={activeIndex === 5 ? "active" : ""} onClick={() => handleOnClick(5)}>Deactivated Items</a>}
                                {activeIndex === 6 && <a className={activeIndex === 6 ? "active" : ""} onClick={() => handleOnClick(6)}>Categories</a>}
                                {editCategory && <a className={activeIndex === 7 ? "active" : ""} onClick={() => handleOnClick(7)}>Edit - {editCategory.name}</a>}
                                {activeIndex === 9 && <a className={activeIndex === 9 ? "active" : ""} onClick={() => handleOnClick(9)}>All Ingredients</a>}
                                {editProductIngredient && <a className={activeIndex === 8 ? "active" : ""} onClick={() => handleOnClick(8)}>Ingredients - {editProductIngredient.name}</a>}
                                {activeIndex === 10 && <a className={activeIndex === 10 ? "active" : ""} onClick={() => handleOnClick(10)}>Cost Analysis</a>}
                                {activeIndex === 11 && <a className={activeIndex === 11 ? "active" : ""} onClick={() => handleOnClick(11)}>Deals</a>}
                                {activeIndex === 13 && <a className={activeIndex === 13 ? "active" : ""} onClick={() => handleOnClick(13)}>New Deal</a>}
                                {activeIndex === 12 && <a className={activeIndex === 12 ? "active" : ""} onClick={() => handleOnClick(12)}>Edit Deal - {editDeal.title}</a>}
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
                                        {activeIndex === 1 && <Products org={org} viewProduct={handleViewProduct} handleProduct={handleProduct} handleIngredients={handleIngredients} />}
                                    </div>
                                    <div id="tab2" className={activeIndex === 2 ? "tab__item active" : "tab__item"}>
                                        <NewProduct org={org} cat={cat} />
                                    </div>
                                    <div id="tab3" className={activeIndex === 3 ? "tab__item active" : "tab__item"}>
                                        {viewProduct && <ViewProduct productId={viewProduct.id}  org={org} />}
                                    </div>
                                    <div id="tab4" className={activeIndex === 4 ? "tab__item active" : "tab__item"}>
                                        {editProduct && <EditProduct productId={editProduct.id} org={org} cat={cat} />}
                                    </div>
                                    <div id="tab5" className={activeIndex === 5 ? "tab__item active" : "tab__item"}>
                                        {activeIndex === 5 && <ProductsInactive />}
                                    </div>
                                    <div id="tab6" className={activeIndex === 6 ? "tab__item active" : "tab__item"}>
                                        {activeIndex === 6 && <Categories handleCat={handleCat} />}
                                    </div>
                                    <div id="tab7" className={activeIndex === 7 ? "tab__item active" : "tab__item"}>
                                        {editCategory && <EditCategory catId={editCategory.id} org={org} />}
                                    </div>
                                    <div id="tab9" className={activeIndex === 9 ? "tab__item active" : "tab__item"}>
                                        {activeIndex === 9 && <Ingredients handleCat={handleIng} />}
                                    </div>
                                    <div id="tab8" className={activeIndex === 8 ? "tab__item active" : "tab__item"}>
                                        {editProductIngredient && <ConfigureIngredientUsages productId={editProductIngredient.id} org={org} />}
                                    </div>
                                    <div id="tab10" className={activeIndex === 10 ? "tab__item active" : "tab__item"}>
                                        <CostAnalysis org={org} />
                                    </div>
                                    <div id="tab11" className={activeIndex === 11 ? "tab__item active" : "tab__item"}>
                                        <Deals org={org} handleEditDeal={handleEditDeal} setShowAddForm={setShowAddForm} />
                                    </div>
                                    <div id="tab12" className={activeIndex === 12 ? "tab__item active" : "tab__item"}>
                                        {editDeal && <UpdateDeal org={org} editDeal={editDeal} handleOnClick={handleOnClick} />}
                                    </div>
                                    <div id="tab13" className={activeIndex === 13 ? "tab__item active" : "tab__item"}>
                                        <NewDeal org={org} handleOnClick={handleOnClick} />
                                    </div>

                                   
                                   
                                </div>
                            </div>
                        </div>
                        {/* !models content */}
                    </div>
                </div>}
                {/* !Models */}
            </div>

        </>
    )
}