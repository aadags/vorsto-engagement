"use client"
import React, { useState } from 'react'
import Link from 'next/link'


export default function Models() {

    // For filter
    const products = [
        { id: 1, category: 1, img: "img/models/1.jpg", title: 'GameVisuals1', hasBookmark: false, desc: "A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.", author_pic: "img/user/user.jpg", author_name: "Caden", tags: ['Buildings', 'Environments', 'Illustration', 'Textures', ''] },
        { id: 2, category: 1, img: "img/models/2.jpg", title: 'GameVisuals2', hasBookmark: false, desc: "A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.", author_pic: "img/user/user.jpg", author_name: "Caden", tags: ['Characters', 'Fashion', 'Graphical', 'Photography', 'Environments'] },
        { id: 3, category: 1, img: "img/models/3.jpg", title: 'GameVisuals3', hasBookmark: false, desc: "A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.", author_pic: "img/user/user.jpg", author_name: "Caden", tags: ['Buildings', 'Environments', 'Characters', 'Graphical', ''] },
        { id: 4, category: 1, img: "img/models/4.jpg", title: 'GameVisuals4', hasBookmark: false, desc: "A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.", author_pic: "img/user/user.jpg", author_name: "Caden", tags: ['Fashion', 'Environments', 'Illustration', 'Textures', ''] },
        { id: 5, category: 1, img: "img/models/5.jpg", title: 'GameVisuals5', hasBookmark: false, desc: "A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.", author_pic: "img/user/user.jpg", author_name: "Caden", tags: ['Buildings', 'Characters', 'Photography', 'Illustration', ''] },
        { id: 6, category: 1, img: "img/models/6.jpg", title: 'GameVisuals6', hasBookmark: false, desc: "A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.", author_pic: "img/user/user.jpg", author_name: "Caden", tags: ['Fashion', 'Environments', 'Graphical', 'Textures', 'Characters'] },
        { id: 7, category: 1, img: "img/models/7.jpg", title: 'GameVisuals7', hasBookmark: false, desc: "A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.", author_pic: "img/user/user.jpg", author_name: "Caden", tags: ['Illustration', 'Environments', 'Graphical', 'Textures', ''] },
        { id: 8, category: 1, img: "img/models/8.jpg", title: 'GameVisuals8', hasBookmark: false, desc: "A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.", author_pic: "img/user/user.jpg", author_name: "Caden", tags: ['Buildings', 'Characters', 'Fashion', 'Photography', ''] },
        { id: 9, category: 1, img: "img/models/9.jpg", title: 'GameVisuals9', hasBookmark: false, desc: "A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.", author_pic: "img/user/user.jpg", author_name: "Caden", tags: ['Graphical', 'Characters', 'Illustration', 'Photography', ''] },
        { id: 10, category: 1, img: "img/models/10.jpg", title: 'GameVisuals10', hasBookmark: false, desc: "A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.", author_pic: "img/user/user.jpg", author_name: "Caden", tags: ['Textures', 'Characters', 'Fashion', 'Photography', ''] },
        { id: 11, category: 2, img: "img/models/3.jpg", title: 'GameVisuals1', hasBookmark: false, desc: "A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.", author_pic: "img/user/user.jpg", author_name: "Caden", tags: ['Buildings', 'Environments', 'Illustration', 'Textures', ''] },
        { id: 12, category: 2, img: "img/models/4.jpg", title: 'GameVisuals2', hasBookmark: false, desc: "A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.", author_pic: "img/user/user.jpg", author_name: "Caden", tags: ['Characters', 'Fashion', 'Graphical', 'Photography', 'Environments'] },
        { id: 13, category: 2, img: "img/models/5.jpg", title: 'GameVisuals3', hasBookmark: false, desc: "A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.", author_pic: "img/user/user.jpg", author_name: "Caden", tags: ['Buildings', 'Environments', 'Characters', 'Graphical', ''] },
        { id: 14, category: 2, img: "img/models/6.jpg", title: 'GameVisuals4', hasBookmark: false, desc: "A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.", author_pic: "img/user/user.jpg", author_name: "Caden", tags: ['Fashion', 'Environments', 'Illustration', 'Textures', ''] },
        { id: 15, category: 2, img: "img/models/7.jpg", title: 'GameVisuals5', hasBookmark: false, desc: "A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.", author_pic: "img/user/user.jpg", author_name: "Caden", tags: ['Buildings', 'Characters', 'Photography', 'Illustration', ''] },
        { id: 16, category: 2, img: "img/models/8.jpg", title: 'GameVisuals6', hasBookmark: false, desc: "A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.", author_pic: "img/user/user.jpg", author_name: "Caden", tags: ['Fashion', 'Environments', 'Graphical', 'Textures', 'Characters'] },
        { id: 17, category: 2, img: "img/models/9.jpg", title: 'GameVisuals7', hasBookmark: false, desc: "A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.", author_pic: "img/user/user.jpg", author_name: "Caden", tags: ['Illustration', 'Environments', 'Graphical', 'Textures', ''] },
        { id: 18, category: 2, img: "img/models/10.jpg", title: 'GameVisuals8', hasBookmark: false, desc: "A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.", author_pic: "img/user/user.jpg", author_name: "Caden", tags: ['Buildings', 'Characters', 'Fashion', 'Photography', ''] },
        { id: 19, category: 2, img: "img/models/1.jpg", title: 'GameVisuals9', hasBookmark: false, desc: "A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.", author_pic: "img/user/user.jpg", author_name: "Caden", tags: ['Graphical', 'Characters', 'Illustration', 'Photography', ''] },
        { id: 20, category: 2, img: "img/models/2.jpg", title: 'GameVisuals10', hasBookmark: false, desc: "A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.", author_pic: "img/user/user.jpg", author_name: "Caden", tags: ['Textures', 'Characters', 'Fashion', 'Photography', ''] },
        { id: 21, category: 3, img: "img/models/8.jpg", title: 'GameVisuals1', hasBookmark: false, desc: "A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.", author_pic: "img/user/user.jpg", author_name: "Caden", tags: ['Buildings', 'Environments', 'Illustration', 'Textures', ''] },
        { id: 23, category: 3, img: "img/models/10.jpg", title: 'GameVisuals3', hasBookmark: false, desc: "A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.", author_pic: "img/user/user.jpg", author_name: "Caden", tags: ['Buildings', 'Environments', 'Characters', 'Graphical', ''] },
        { id: 24, category: 3, img: "img/models/1.jpg", title: 'GameVisuals4', hasBookmark: false, desc: "A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.", author_pic: "img/user/user.jpg", author_name: "Caden", tags: ['Fashion', 'Environments', 'Illustration', 'Textures', ''] },
        { id: 25, category: 3, img: "img/models/2.jpg", title: 'GameVisuals5', hasBookmark: false, desc: "A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.", author_pic: "img/user/user.jpg", author_name: "Caden", tags: ['Buildings', 'Characters', 'Photography', 'Illustration', ''] },
        { id: 26, category: 3, img: "img/models/3.jpg", title: 'GameVisuals6', hasBookmark: false, desc: "A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.", author_pic: "img/user/user.jpg", author_name: "Caden", tags: ['Fashion', 'Environments', 'Graphical', 'Textures', 'Characters'] },
        { id: 27, category: 3, img: "img/models/4.jpg", title: 'GameVisuals7', hasBookmark: false, desc: "A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.", author_pic: "img/user/user.jpg", author_name: "Caden", tags: ['Illustration', 'Environments', 'Graphical', 'Textures', ''] },
        { id: 28, category: 3, img: "img/models/5.jpg", title: 'GameVisuals8', hasBookmark: false, desc: "A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.", author_pic: "img/user/user.jpg", author_name: "Caden", tags: ['Buildings', 'Characters', 'Fashion', 'Photography', ''] },
        { id: 29, category: 3, img: "img/models/6.jpg", title: 'GameVisuals9', hasBookmark: false, desc: "A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.", author_pic: "img/user/user.jpg", author_name: "Caden", tags: ['Graphical', 'Characters', 'Illustration', 'Photography', ''] },
        { id: 30, category: 3, img: "img/models/7.jpg", title: 'GameVisuals10', hasBookmark: false, desc: "A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.", author_pic: "img/user/user.jpg", author_name: "Caden", tags: ['Textures', 'Characters', 'Fashion', 'Photography', ''] },
        { id: 31, category: 4, img: "img/models/5.jpg", title: 'GameVisuals8', hasBookmark: false, desc: "A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.", author_pic: "img/user/user.jpg", author_name: "Caden", tags: ['Buildings', 'Characters', 'Fashion', 'Photography', ''] },
        { id: 32, category: 4, img: "img/models/6.jpg", title: 'GameVisuals9', hasBookmark: false, desc: "A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.", author_pic: "img/user/user.jpg", author_name: "Caden", tags: ['Graphical', 'Characters', 'Illustration', 'Photography', ''] },
        { id: 33, category: 4, img: "img/models/7.jpg", title: 'GameVisuals10', hasBookmark: false, desc: "A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.", author_pic: "img/user/user.jpg", author_name: "Caden", tags: ['Textures', 'Characters', 'Fashion', 'Photography', ''] },
        // Add more products with tags here
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

    const hasBookmarkSwitch = (productId) => {
        // Find the index of the product with the given productId
        const productIndex = filteredProducts.findIndex((product) => product.id === productId);

        if (productIndex !== -1) {
            // Toggle the bookmark state for the specific product
            const updatedBookmarkStates = [...bookmarkStates];
            updatedBookmarkStates[productIndex] = !bookmarkStates[productIndex];

            // Update the bookmark states
            setBookmarkStates(updatedBookmarkStates);
        }
    };




    return (
        <>
            <div className="techwave_fn_models_page">
                <div className="fn__title_holder">
                    <div className="container">
                        <h1 className="title">Finetuned Models</h1>
                    </div>
                </div>
                {/* Models */}
                <div className="techwave_fn_models">
                    <div className="fn__tabs">
                        <div className="container">
                            <div className="tab_in">
                                <a className={activeIndex === 1 ? "active" : ""} onClick={() => handleOnClick(1)}>Main Models</a>
                                <a className={activeIndex === 2 ? "active" : ""} onClick={() => handleOnClick(2)}>Community’s</a>
                                <a className={activeIndex === 3 ? "active" : ""} onClick={() => handleOnClick(3)}>Bookmarks</a>
                                <a className={activeIndex === 4 ? "active" : ""} onClick={() => handleOnClick(4)}>My Own</a>
                            </div>
                        </div>
                    </div>
                    {/* models filter */}
                    <div className="container">
                        <div className="models__filter">
                            <div className="filter__left">
                                <div className="filter__search">
                                    <input type="text" placeholder="Search gallery" />
                                    <Link href="#" className="techwave_fn_button"><span>Search</span></Link>
                                </div>
                            </div>
                            <div className="filter__right">
                                <div className="filter__category">
                                    <select onChange={handleTagChange}>
                                        <option value="" >All Categories</option>
                                        <option value="Buildings">Buildings</option>
                                        <option value="Characters">Characters</option>
                                        <option value="Environments">Environments</option>
                                        <option value="Fashion">Fashion</option>
                                        <option value="Illustration">Illustration</option>
                                        <option value="Graphical">Graphical</option>
                                        <option value="Photography">Photography</option>
                                        <option value="Textures">Textures</option>
                                        {/* Add more tag options here */}
                                    </select>
                                </div>
                                <div className="filter__order">
                                    <div className="fn__icon_options medium_size align_right">
                                        <span className="fn__icon_button">
                                            <img src="svg/filter.svg" alt="" className="fn__svg" />
                                        </span>
                                        <div className="fn__icon_popup">
                                            <ul>
                                                <li>
                                                    <Link href="#">Newest</Link>
                                                </li>
                                                <li>
                                                    <Link href="#">Oldest</Link>
                                                </li>
                                                <li>
                                                    <Link href="#">A-Z</Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* !models filter */}
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
                                        <ul className="fn__model_items">
                                            {/*  model item goes here */}{
                                                filteredProducts.map((product, index) => (
                                                    <li key={product.id} className="fn__model_item">
                                                        <div className="item">
                                                            <a onClick={() => hasBookmarkSwitch(product.id)}
                                                                className={bookmarkStates[index] ? "fn__bookmark has__bookmark" : "fn__bookmark"}>
                                                                <img src="svg/bookmark.svg" alt="" className="fn__svg hasntbook" />
                                                                <img src="svg/bookmarked.svg" alt="" className="fn__svg hasbook" />
                                                            </a>
                                                            <div className="img">
                                                                <img src={product.img} alt="" />
                                                            </div>
                                                            <div className="item__info">
                                                                <h3 className="title">{product.title}</h3>
                                                                <p className="desc">{product.desc}</p>
                                                            </div>
                                                            <div className="item__author">
                                                                <img src={product.author_pic} alt="" />
                                                                <h3 className="author_name">{product.author_name}</h3>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>
                                    <div id="tab2" className={activeIndex === 2 ? "tab__item active" : "tab__item"}>
                                        <ul className="fn__model_items">
                                            {/*  model item goes here */}{
                                                filteredProducts.map((product, index) => (
                                                    <li key={product.id} className="fn__model_item">
                                                        <div className="item">
                                                            <a onClick={() => hasBookmarkSwitch(product.id)}
                                                                className={bookmarkStates[index] ? "fn__bookmark has__bookmark" : "fn__bookmark"}>
                                                                <img src="svg/bookmark.svg" alt="" className="fn__svg hasntbook" />
                                                                <img src="svg/bookmarked.svg" alt="" className="fn__svg hasbook" />
                                                            </a>
                                                            <div className="img">
                                                                <img src={product.img} alt="" />
                                                            </div>
                                                            <div className="item__info">
                                                                <h3 className="title">{product.title}</h3>
                                                                <p className="desc">{product.desc}</p>
                                                            </div>
                                                            <div className="item__author">
                                                                <img src={product.author_pic} alt="" />
                                                                <h3 className="author_name">{product.author_name}</h3>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>
                                    <div id="tab3" className={activeIndex === 3 ? "tab__item active" : "tab__item"}>
                                        <ul className="fn__model_items">
                                            {/*  model item goes here */}{
                                                filteredProducts.map((product, index) => (
                                                    <li key={product.id} className="fn__model_item">
                                                        <div className="item">
                                                            <a onClick={() => hasBookmarkSwitch(product.id)}
                                                                className={bookmarkStates[index] ? "fn__bookmark has__bookmark" : "fn__bookmark"}>
                                                                <img src="svg/bookmark.svg" alt="" className="fn__svg hasntbook" />
                                                                <img src="svg/bookmarked.svg" alt="" className="fn__svg hasbook" />
                                                            </a>
                                                            <div className="img">
                                                                <img src={product.img} alt="" />
                                                            </div>
                                                            <div className="item__info">
                                                                <h3 className="title">{product.title}</h3>
                                                                <p className="desc">{product.desc}</p>
                                                            </div>
                                                            <div className="item__author">
                                                                <img src={product.author_pic} alt="" />
                                                                <h3 className="author_name">{product.author_name}</h3>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>
                                    <div id="tab4" className={activeIndex === 4 ? "tab__item active" : "tab__item"}>
                                        <ul className="fn__model_items">
                                            {/*  model item goes here */}{
                                                filteredProducts.map((product, index) => (
                                                    <li key={product.id} className="fn__model_item">
                                                        <div className="item">
                                                            <a onClick={() => hasBookmarkSwitch(product.id)}
                                                                className={bookmarkStates[index] ? "fn__bookmark has__bookmark" : "fn__bookmark"}>
                                                                <img src="svg/bookmark.svg" alt="" className="fn__svg hasntbook" />
                                                                <img src="svg/bookmarked.svg" alt="" className="fn__svg hasbook" />
                                                            </a>
                                                            <div className="img">
                                                                <img src={product.img} alt="" />
                                                            </div>
                                                            <div className="item__info">
                                                                <h3 className="title">{product.title}</h3>
                                                                <p className="desc">{product.desc}</p>
                                                            </div>
                                                            <div className="item__author">
                                                                <img src={product.author_pic} alt="" />
                                                                <h3 className="author_name">{product.author_name}</h3>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="models__more">
                                <Link href="#" className="medium techwave_fn_button"><span>Load More</span></Link>
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
