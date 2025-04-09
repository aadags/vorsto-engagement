"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import axios from 'axios';


export default function PreModels() {

    const router = useRouter();
    // For filter
    const products = [
        { id: 1, category: 1, img: "img/danny3.jpg", title: 'Danny', hasBookmark: false, desc: "is an ecommerce agent that specializes in ecommerce customer support, targetted marketing and business revenue growth.", author_pic: "img/danny3.jpg", author_name: "Ecommerce", tags: ['Ecommerce', ''] },
        { id: 2, category: 1, img: "img/lexi.jpg", title: 'Lexi', hasBookmark: false, desc: "is a real estate agent that specializes in real estate customer appointment scheduling, lead tracking and client interaction.", author_pic: "img/lexi.jpg", author_name: "Real Estate", tags: ['Real Estate', ''] },
        { id: 3, category: 1, img: "img/Neha.jpg", title: 'Neha', hasBookmark: false, desc: "is a generic agent for most businesses that specializes customer support, targetted marketing and revenue growth.", author_pic: "img/Neha.jpg", author_name: "Generic", tags: ['Generic', ''] },
    ]

    // Initialize your component state
    const [activeIndex, setActiveIndex] = useState(1);
    const [selectedTag, setSelectedTag] = useState('');
    const [bookmarkStates, setBookmarkStates] = useState(products.map(() => false));

    const handleOnClick = (index) => {
        setActiveIndex(index);
        setSelectedTag('');
    };

    const filteredProductsByCategory = activeIndex
        ? products.filter((product) => product.category === activeIndex)
        : null;


    const filteredProducts = selectedTag
        ? filteredProductsByCategory.filter((product) =>
            product.tags.includes(selectedTag)
        )
        : filteredProductsByCategory;

    const handleTagChange = (event) => {
        setSelectedTag(event.target.value);
    };

    const installAgent = async (product) => {
        const confirmAction = window.confirm(`Do you want to proceed to setup this agent?`);
        if (!confirmAction) return;

        const response = await axios.post(
          `/api/install-agent`,
          { product }
        );

        if(response.data.status)
        {
            router.refresh();
        }
    };


    return (
        <>
        <div className="techwave_fn_models_page">
            <div className="techwave_fn_models">
                <div className="container">
                        <div className="models__filter">
                            <div className="filter__left">
                                <div className="filter__search">
                                </div>
                            </div>
                            <div className="filter__right">
                                <div className="filter__category">
                                    <select onChange={handleTagChange}>
                                        <option value="" >All Categories</option>
                                        <option value="Ecommerce">Ecommerce</option>
                                        <option value="Real Estate">Real Estate</option>
                                        <option value="Generic">Generic</option>
                                        {/* Add more tag options here */}
                                    </select>
                                </div>
                            </div>
                        </div>
                </div>
                <div className="container">
                    <ul className="fn__model_items">
                                            {/*  model item goes here */}{
                                                filteredProducts.map((product, index) => (
                                                    <li key={product.id} className="fn__model_item">
                                                        <div className="item">
                                                            <div className="img">
                                                                <img src={product.img} alt="" />
                                                            </div>
                                                            <div className="item__info">
                                                                <h3 className="title">{product.title} - {product.author_name}</h3>
                                                                <p className="">{product.desc}</p>
                                                            </div>
                                                            <div className="item__author">
                                                                <img src={product.author_pic} alt="" />
                                                                <a href={'#'} onClick={() => installAgent(product)} className="author_name">Install</a>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                        </ul>
                </div>
            </div>
        </div>
        </>
    );
}
