import React, { useState } from 'react'
import Link from 'next/link'


export default function FinetunedModel() {

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
                                <Link className="active" href="#tab1">Main Models</Link>
                                <Link href="#tab2">Community’s</Link>
                                <Link href="#tab3">Bookmarks</Link>
                                <Link href="#tab4">My Own</Link>
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
                                    <select>
                                        <option value="all" selected>All Categories</option>
                                        <option value="Buildings">Buildings</option>
                                        <option value="Characters">Characters</option>
                                        <option value="Environments">Environments</option>
                                        <option value="Fashion">Fashion</option>
                                        <option value="Illustration">Illustration</option>
                                        <option value="Graphical">Graphical</option>
                                        <option value="Photography">Photography</option>
                                        <option value="Textures">Textures</option>
                                    </select>
                                </div>
                                <div className="filter__order">
                                    <div className="fn__icon_options medium_size align_right">
                                        <span className="fn__icon_button">
                                            <img src="svg/filter.svg" alt=""  className="fn__svg" />
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
                                    <div id="tab1" className="tab__item active">
                                        <ul className="fn__model_items">
                                            {/* #1 model item */}
                                            <li className="fn__model_item">
                                                <div className="item">
                                                    <Link href="#" className="fn__bookmark has__bookmark">
                                                        <img src="svg/bookmark.svg" alt=""  className="fn__svg hasntbook" />
                                                        <img src="svg/bookmarked.svg" alt=""  className="fn__svg hasbook" />
                                                    </Link>
                                                    <div className="img">
                                                        <img src="img/models/1.jpg" alt=""  />
                                                    </div>
                                                    <div className="item__info">
                                                        <h3 className="title">GameVisuals</h3>
                                                        <p className="desc">A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.</p>
                                                    </div>
                                                    <div className="item__author">
                                                        <img src="img/user/user.jpg" alt=""  />
                                                        <h3 className="author_name">Caden</h3>
                                                    </div>
                                                </div>
                                            </li>
                                            {/* !#1 model item */}
                                            {/* #2 model item */}
                                            <li className="fn__model_item">
                                                <div className="item">
                                                    <Link href="#" className="fn__bookmark">
                                                        <img src="svg/bookmark.svg" alt=""  className="fn__svg hasntbook" />
                                                        <img src="svg/bookmarked.svg" alt=""  className="fn__svg hasbook" />
                                                    </Link>
                                                    <div className="img">
                                                        <img src="img/models/2.jpg" alt=""  />
                                                    </div>
                                                    <div className="item__info">
                                                        <h3 className="title">GameVisuals</h3>
                                                        <p className="desc">A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.</p>
                                                    </div>
                                                    <div className="item__author">
                                                        <img src="img/user/user.jpg" alt=""  />
                                                        <h3 className="author_name">Caden</h3>
                                                    </div>
                                                </div>
                                            </li>
                                            {/* !#2 model item */}
                                            {/* #3 model item */}
                                            <li className="fn__model_item">
                                                <div className="item">
                                                    <Link href="#" className="fn__bookmark">
                                                        <img src="svg/bookmark.svg" alt=""  className="fn__svg hasntbook" />
                                                        <img src="svg/bookmarked.svg" alt=""  className="fn__svg hasbook" />
                                                    </Link>
                                                    <div className="img">
                                                        <img src="img/models/3.jpg" alt=""  />
                                                    </div>
                                                    <div className="item__info">
                                                        <h3 className="title">GameVisuals</h3>
                                                        <p className="desc">A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.</p>
                                                    </div>
                                                    <div className="item__author">
                                                        <img src="img/user/user.jpg" alt=""  />
                                                        <h3 className="author_name">Caden</h3>
                                                    </div>
                                                </div>
                                            </li>
                                            {/* !#3 model item */}
                                            {/* #4 model item */}
                                            <li className="fn__model_item">
                                                <div className="item">
                                                    <Link href="#" className="fn__bookmark">
                                                        <img src="svg/bookmark.svg" alt=""  className="fn__svg hasntbook" />
                                                        <img src="svg/bookmarked.svg" alt=""  className="fn__svg hasbook" />
                                                    </Link>
                                                    <div className="img">
                                                        <img src="img/models/4.jpg" alt=""  />
                                                    </div>
                                                    <div className="item__info">
                                                        <h3 className="title">GameVisuals</h3>
                                                        <p className="desc">A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.</p>
                                                    </div>
                                                    <div className="item__author">
                                                        <img src="img/user/user.jpg" alt=""  />
                                                        <h3 className="author_name">Caden</h3>
                                                    </div>
                                                </div>
                                            </li>
                                            {/* !#4 model item */}
                                            {/* #5 model item */}
                                            <li className="fn__model_item">
                                                <div className="item">
                                                    <Link href="#" className="fn__bookmark">
                                                        <img src="svg/bookmark.svg" alt=""  className="fn__svg hasntbook" />
                                                        <img src="svg/bookmarked.svg" alt=""  className="fn__svg hasbook" />
                                                    </Link>
                                                    <div className="img">
                                                        <img src="img/models/5.jpg" alt=""  />
                                                    </div>
                                                    <div className="item__info">
                                                        <h3 className="title">GameVisuals</h3>
                                                        <p className="desc">A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.</p>
                                                    </div>
                                                    <div className="item__author">
                                                        <img src="img/user/user.jpg" alt=""  />
                                                        <h3 className="author_name">Caden</h3>
                                                    </div>
                                                </div>
                                            </li>
                                            {/* !#5 model item */}
                                            {/* #6 model item */}
                                            <li className="fn__model_item">
                                                <div className="item">
                                                    <Link href="#" className="fn__bookmark">
                                                        <img src="svg/bookmark.svg" alt=""  className="fn__svg hasntbook" />
                                                        <img src="svg/bookmarked.svg" alt=""  className="fn__svg hasbook" />
                                                    </Link>
                                                    <div className="img">
                                                        <img src="img/models/6.jpg" alt=""  />
                                                    </div>
                                                    <div className="item__info">
                                                        <h3 className="title">GameVisuals</h3>
                                                        <p className="desc">A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.</p>
                                                    </div>
                                                    <div className="item__author">
                                                        <img src="img/user/user.jpg" alt=""  />
                                                        <h3 className="author_name">Caden</h3>
                                                    </div>
                                                </div>
                                            </li>
                                            {/* !#6 model item */}
                                            {/* #7 model item */}
                                            <li className="fn__model_item">
                                                <div className="item">
                                                    <Link href="#" className="fn__bookmark has__bookmark">
                                                        <img src="svg/bookmark.svg" alt=""  className="fn__svg hasntbook" />
                                                        <img src="svg/bookmarked.svg" alt=""  className="fn__svg hasbook" />
                                                    </Link>
                                                    <div className="img">
                                                        <img src="img/models/7.jpg" alt=""  />
                                                    </div>
                                                    <div className="item__info">
                                                        <h3 className="title">GameVisuals</h3>
                                                        <p className="desc">A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.</p>
                                                    </div>
                                                    <div className="item__author">
                                                        <img src="img/user/user.jpg" alt=""  />
                                                        <h3 className="author_name">Caden</h3>
                                                    </div>
                                                </div>
                                            </li>
                                            {/* !#7 model item */}
                                            {/* #8 model item */}
                                            <li className="fn__model_item">
                                                <div className="item">
                                                    <Link href="#" className="fn__bookmark">
                                                        <img src="svg/bookmark.svg" alt=""  className="fn__svg hasntbook" />
                                                        <img src="svg/bookmarked.svg" alt=""  className="fn__svg hasbook" />
                                                    </Link>
                                                    <div className="img">
                                                        <img src="img/models/8.jpg" alt=""  />
                                                    </div>
                                                    <div className="item__info">
                                                        <h3 className="title">GameVisuals</h3>
                                                        <p className="desc">A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.</p>
                                                    </div>
                                                    <div className="item__author">
                                                        <img src="img/user/user.jpg" alt=""  />
                                                        <h3 className="author_name">Caden</h3>
                                                    </div>
                                                </div>
                                            </li>
                                            {/* !#8 model item */}
                                            {/* #9 model item */}
                                            <li className="fn__model_item">
                                                <div className="item">
                                                    <Link href="#" className="fn__bookmark">
                                                        <img src="svg/bookmark.svg" alt=""  className="fn__svg hasntbook" />
                                                        <img src="svg/bookmarked.svg" alt=""  className="fn__svg hasbook" />
                                                    </Link>
                                                    <div className="img">
                                                        <img src="img/models/9.jpg" alt=""  />
                                                    </div>
                                                    <div className="item__info">
                                                        <h3 className="title">GameVisuals</h3>
                                                        <p className="desc">A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.</p>
                                                    </div>
                                                    <div className="item__author">
                                                        <img src="img/user/user.jpg" alt=""  />
                                                        <h3 className="author_name">Caden</h3>
                                                    </div>
                                                </div>
                                            </li>
                                            {/* !#9 model item */}
                                            {/* #10 model item */}
                                            <li className="fn__model_item">
                                                <div className="item">
                                                    <Link href="#" className="fn__bookmark">
                                                        <img src="svg/bookmark.svg" alt=""  className="fn__svg hasntbook" />
                                                        <img src="svg/bookmarked.svg" alt=""  className="fn__svg hasbook" />
                                                    </Link>
                                                    <div className="img">
                                                        <img src="img/models/10.jpg" alt=""  />
                                                    </div>
                                                    <div className="item__info">
                                                        <h3 className="title">GameVisuals</h3>
                                                        <p className="desc">A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.</p>
                                                    </div>
                                                    <div className="item__author">
                                                        <img src="img/user/user.jpg" alt=""  />
                                                        <h3 className="author_name">Caden</h3>
                                                    </div>
                                                </div>
                                            </li>
                                            {/* !#10 model item */}
                                        </ul>
                                    </div>
                                    <div id="tab2" className="tab__item">
                                        <ul className="fn__model_items">
                                            {/* #1 model item */}
                                            <li className="fn__model_item">
                                                <div className="item">
                                                    <Link href="#" className="fn__bookmark has__bookmark">
                                                        <img src="svg/bookmark.svg" alt=""  className="fn__svg hasntbook" />
                                                        <img src="svg/bookmarked.svg" alt=""  className="fn__svg hasbook" />
                                                    </Link>
                                                    <div className="img">
                                                        <img src="img/models/1.jpg" alt=""  />
                                                    </div>
                                                    <div className="item__info">
                                                        <h3 className="title">GameVisuals</h3>
                                                        <p className="desc">A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.</p>
                                                    </div>
                                                    <div className="item__author">
                                                        <img src="img/user/user.jpg" alt=""  />
                                                        <h3 className="author_name">Caden</h3>
                                                    </div>
                                                </div>
                                            </li>
                                            {/* !#1 model item */}
                                            {/* #2 model item */}
                                            <li className="fn__model_item">
                                                <div className="item">
                                                    <Link href="#" className="fn__bookmark">
                                                        <img src="svg/bookmark.svg" alt=""  className="fn__svg hasntbook" />
                                                        <img src="svg/bookmarked.svg" alt=""  className="fn__svg hasbook" />
                                                    </Link>
                                                    <div className="img">
                                                        <img src="img/models/2.jpg" alt=""  />
                                                    </div>
                                                    <div className="item__info">
                                                        <h3 className="title">GameVisuals</h3>
                                                        <p className="desc">A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.</p>
                                                    </div>
                                                    <div className="item__author">
                                                        <img src="img/user/user.jpg" alt=""  />
                                                        <h3 className="author_name">Caden</h3>
                                                    </div>
                                                </div>
                                            </li>
                                            {/* !#2 model item */}
                                            {/* #3 model item */}
                                            <li className="fn__model_item">
                                                <div className="item">
                                                    <Link href="#" className="fn__bookmark">
                                                        <img src="svg/bookmark.svg" alt=""  className="fn__svg hasntbook" />
                                                        <img src="svg/bookmarked.svg" alt=""  className="fn__svg hasbook" />
                                                    </Link>
                                                    <div className="img">
                                                        <img src="img/models/3.jpg" alt=""  />
                                                    </div>
                                                    <div className="item__info">
                                                        <h3 className="title">GameVisuals</h3>
                                                        <p className="desc">A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.</p>
                                                    </div>
                                                    <div className="item__author">
                                                        <img src="img/user/user.jpg" alt=""  />
                                                        <h3 className="author_name">Caden</h3>
                                                    </div>
                                                </div>
                                            </li>
                                            {/* !#3 model item */}
                                            {/* #4 model item */}
                                            <li className="fn__model_item">
                                                <div className="item">
                                                    <Link href="#" className="fn__bookmark">
                                                        <img src="svg/bookmark.svg" alt=""  className="fn__svg hasntbook" />
                                                        <img src="svg/bookmarked.svg" alt=""  className="fn__svg hasbook" />
                                                    </Link>
                                                    <div className="img">
                                                        <img src="img/models/4.jpg" alt=""  />
                                                    </div>
                                                    <div className="item__info">
                                                        <h3 className="title">GameVisuals</h3>
                                                        <p className="desc">A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.</p>
                                                    </div>
                                                    <div className="item__author">
                                                        <img src="img/user/user.jpg" alt=""  />
                                                        <h3 className="author_name">Caden</h3>
                                                    </div>
                                                </div>
                                            </li>
                                            {/* !#4 model item */}
                                            {/* #5 model item */}
                                            <li className="fn__model_item">
                                                <div className="item">
                                                    <Link href="#" className="fn__bookmark">
                                                        <img src="svg/bookmark.svg" alt=""  className="fn__svg hasntbook" />
                                                        <img src="svg/bookmarked.svg" alt=""  className="fn__svg hasbook" />
                                                    </Link>
                                                    <div className="img">
                                                        <img src="img/models/5.jpg" alt=""  />
                                                    </div>
                                                    <div className="item__info">
                                                        <h3 className="title">GameVisuals</h3>
                                                        <p className="desc">A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.</p>
                                                    </div>
                                                    <div className="item__author">
                                                        <img src="img/user/user.jpg" alt=""  />
                                                        <h3 className="author_name">Caden</h3>
                                                    </div>
                                                </div>
                                            </li>
                                            {/* !#5 model item */}
                                            {/* #6 model item */}
                                            <li className="fn__model_item">
                                                <div className="item">
                                                    <Link href="#" className="fn__bookmark">
                                                        <img src="svg/bookmark.svg" alt=""  className="fn__svg hasntbook" />
                                                        <img src="svg/bookmarked.svg" alt=""  className="fn__svg hasbook" />
                                                    </Link>
                                                    <div className="img">
                                                        <img src="img/models/6.jpg" alt=""  />
                                                    </div>
                                                    <div className="item__info">
                                                        <h3 className="title">GameVisuals</h3>
                                                        <p className="desc">A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.</p>
                                                    </div>
                                                    <div className="item__author">
                                                        <img src="img/user/user.jpg" alt=""  />
                                                        <h3 className="author_name">Caden</h3>
                                                    </div>
                                                </div>
                                            </li>
                                            {/* !#6 model item */}
                                            {/* #7 model item */}
                                            <li className="fn__model_item">
                                                <div className="item">
                                                    <Link href="#" className="fn__bookmark has__bookmark">
                                                        <img src="svg/bookmark.svg" alt=""  className="fn__svg hasntbook" />
                                                        <img src="svg/bookmarked.svg" alt=""  className="fn__svg hasbook" />
                                                    </Link>
                                                    <div className="img">
                                                        <img src="img/models/7.jpg" alt=""  />
                                                    </div>
                                                    <div className="item__info">
                                                        <h3 className="title">GameVisuals</h3>
                                                        <p className="desc">A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.</p>
                                                    </div>
                                                    <div className="item__author">
                                                        <img src="img/user/user.jpg" alt=""  />
                                                        <h3 className="author_name">Caden</h3>
                                                    </div>
                                                </div>
                                            </li>
                                            {/* !#7 model item */}
                                            {/* #8 model item */}
                                            <li className="fn__model_item">
                                                <div className="item">
                                                    <Link href="#" className="fn__bookmark">
                                                        <img src="svg/bookmark.svg" alt=""  className="fn__svg hasntbook" />
                                                        <img src="svg/bookmarked.svg" alt=""  className="fn__svg hasbook" />
                                                    </Link>
                                                    <div className="img">
                                                        <img src="img/models/8.jpg" alt=""  />
                                                    </div>
                                                    <div className="item__info">
                                                        <h3 className="title">GameVisuals</h3>
                                                        <p className="desc">A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.</p>
                                                    </div>
                                                    <div className="item__author">
                                                        <img src="img/user/user.jpg" alt=""  />
                                                        <h3 className="author_name">Caden</h3>
                                                    </div>
                                                </div>
                                            </li>
                                            {/* !#8 model item */}
                                            {/* #9 model item */}
                                            <li className="fn__model_item">
                                                <div className="item">
                                                    <Link href="#" className="fn__bookmark">
                                                        <img src="svg/bookmark.svg" alt=""  className="fn__svg hasntbook" />
                                                        <img src="svg/bookmarked.svg" alt=""  className="fn__svg hasbook" />
                                                    </Link>
                                                    <div className="img">
                                                        <img src="img/models/9.jpg" alt=""  />
                                                    </div>
                                                    <div className="item__info">
                                                        <h3 className="title">GameVisuals</h3>
                                                        <p className="desc">A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.</p>
                                                    </div>
                                                    <div className="item__author">
                                                        <img src="img/user/user.jpg" alt=""  />
                                                        <h3 className="author_name">Caden</h3>
                                                    </div>
                                                </div>
                                            </li>
                                            {/* !#9 model item */}
                                            {/* #10 model item */}
                                            <li className="fn__model_item">
                                                <div className="item">
                                                    <Link href="#" className="fn__bookmark">
                                                        <img src="svg/bookmark.svg" alt=""  className="fn__svg hasntbook" />
                                                        <img src="svg/bookmarked.svg" alt=""  className="fn__svg hasbook" />
                                                    </Link>
                                                    <div className="img">
                                                        <img src="img/models/10.jpg" alt=""  />
                                                    </div>
                                                    <div className="item__info">
                                                        <h3 className="title">GameVisuals</h3>
                                                        <p className="desc">A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.</p>
                                                    </div>
                                                    <div className="item__author">
                                                        <img src="img/user/user.jpg" alt=""  />
                                                        <h3 className="author_name">Caden</h3>
                                                    </div>
                                                </div>
                                            </li>
                                            {/* !#10 model item */}
                                        </ul>
                                    </div>
                                    <div id="tab3" className="tab__item">
                                        <ul className="fn__model_items">
                                            {/* #1 model item */}
                                            <li className="fn__model_item">
                                                <div className="item">
                                                    <Link href="#" className="fn__bookmark has__bookmark">
                                                        <img src="svg/bookmark.svg" alt=""  className="fn__svg hasntbook" />
                                                        <img src="svg/bookmarked.svg" alt=""  className="fn__svg hasbook" />
                                                    </Link>
                                                    <div className="img">
                                                        <img src="img/models/1.jpg" alt=""  />
                                                    </div>
                                                    <div className="item__info">
                                                        <h3 className="title">GameVisuals</h3>
                                                        <p className="desc">A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.</p>
                                                    </div>
                                                    <div className="item__author">
                                                        <img src="img/user/user.jpg" alt=""  />
                                                        <h3 className="author_name">Caden</h3>
                                                    </div>
                                                </div>
                                            </li>
                                            {/* !#1 model item */}
                                            {/* #2 model item */}
                                            <li className="fn__model_item">
                                                <div className="item">
                                                    <Link href="#" className="fn__bookmark">
                                                        <img src="svg/bookmark.svg" alt=""  className="fn__svg hasntbook" />
                                                        <img src="svg/bookmarked.svg" alt=""  className="fn__svg hasbook" />
                                                    </Link>
                                                    <div className="img">
                                                        <img src="img/models/2.jpg" alt=""  />
                                                    </div>
                                                    <div className="item__info">
                                                        <h3 className="title">GameVisuals</h3>
                                                        <p className="desc">A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.</p>
                                                    </div>
                                                    <div className="item__author">
                                                        <img src="img/user/user.jpg" alt=""  />
                                                        <h3 className="author_name">Caden</h3>
                                                    </div>
                                                </div>
                                            </li>
                                            {/* !#2 model item */}
                                            {/* #3 model item */}
                                            <li className="fn__model_item">
                                                <div className="item">
                                                    <Link href="#" className="fn__bookmark">
                                                        <img src="svg/bookmark.svg" alt=""  className="fn__svg hasntbook" />
                                                        <img src="svg/bookmarked.svg" alt=""  className="fn__svg hasbook" />
                                                    </Link>
                                                    <div className="img">
                                                        <img src="img/models/3.jpg" alt=""  />
                                                    </div>
                                                    <div className="item__info">
                                                        <h3 className="title">GameVisuals</h3>
                                                        <p className="desc">A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.</p>
                                                    </div>
                                                    <div className="item__author">
                                                        <img src="img/user/user.jpg" alt=""  />
                                                        <h3 className="author_name">Caden</h3>
                                                    </div>
                                                </div>
                                            </li>
                                            {/* !#3 model item */}
                                            {/* #4 model item */}
                                            <li className="fn__model_item">
                                                <div className="item">
                                                    <Link href="#" className="fn__bookmark">
                                                        <img src="svg/bookmark.svg" alt=""  className="fn__svg hasntbook" />
                                                        <img src="svg/bookmarked.svg" alt=""  className="fn__svg hasbook" />
                                                    </Link>
                                                    <div className="img">
                                                        <img src="img/models/4.jpg" alt=""  />
                                                    </div>
                                                    <div className="item__info">
                                                        <h3 className="title">GameVisuals</h3>
                                                        <p className="desc">A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.</p>
                                                    </div>
                                                    <div className="item__author">
                                                        <img src="img/user/user.jpg" alt=""  />
                                                        <h3 className="author_name">Caden</h3>
                                                    </div>
                                                </div>
                                            </li>
                                            {/* !#4 model item */}
                                            {/* #5 model item */}
                                            <li className="fn__model_item">
                                                <div className="item">
                                                    <Link href="#" className="fn__bookmark">
                                                        <img src="svg/bookmark.svg" alt=""  className="fn__svg hasntbook" />
                                                        <img src="svg/bookmarked.svg" alt=""  className="fn__svg hasbook" />
                                                    </Link>
                                                    <div className="img">
                                                        <img src="img/models/5.jpg" alt=""  />
                                                    </div>
                                                    <div className="item__info">
                                                        <h3 className="title">GameVisuals</h3>
                                                        <p className="desc">A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.</p>
                                                    </div>
                                                    <div className="item__author">
                                                        <img src="img/user/user.jpg" alt=""  />
                                                        <h3 className="author_name">Caden</h3>
                                                    </div>
                                                </div>
                                            </li>
                                            {/* !#5 model item */}
                                            {/* #6 model item */}
                                            <li className="fn__model_item">
                                                <div className="item">
                                                    <Link href="#" className="fn__bookmark">
                                                        <img src="svg/bookmark.svg" alt=""  className="fn__svg hasntbook" />
                                                        <img src="svg/bookmarked.svg" alt=""  className="fn__svg hasbook" />
                                                    </Link>
                                                    <div className="img">
                                                        <img src="img/models/6.jpg" alt=""  />
                                                    </div>
                                                    <div className="item__info">
                                                        <h3 className="title">GameVisuals</h3>
                                                        <p className="desc">A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.</p>
                                                    </div>
                                                    <div className="item__author">
                                                        <img src="img/user/user.jpg" alt=""  />
                                                        <h3 className="author_name">Caden</h3>
                                                    </div>
                                                </div>
                                            </li>
                                            {/* !#6 model item */}
                                            {/* #7 model item */}
                                            <li className="fn__model_item">
                                                <div className="item">
                                                    <Link href="#" className="fn__bookmark has__bookmark">
                                                        <img src="svg/bookmark.svg" alt=""  className="fn__svg hasntbook" />
                                                        <img src="svg/bookmarked.svg" alt=""  className="fn__svg hasbook" />
                                                    </Link>
                                                    <div className="img">
                                                        <img src="img/models/7.jpg" alt=""  />
                                                    </div>
                                                    <div className="item__info">
                                                        <h3 className="title">GameVisuals</h3>
                                                        <p className="desc">A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.</p>
                                                    </div>
                                                    <div className="item__author">
                                                        <img src="img/user/user.jpg" alt=""  />
                                                        <h3 className="author_name">Caden</h3>
                                                    </div>
                                                </div>
                                            </li>
                                            {/* !#7 model item */}
                                            {/* #8 model item */}
                                            <li className="fn__model_item">
                                                <div className="item">
                                                    <Link href="#" className="fn__bookmark">
                                                        <img src="svg/bookmark.svg" alt=""  className="fn__svg hasntbook" />
                                                        <img src="svg/bookmarked.svg" alt=""  className="fn__svg hasbook" />
                                                    </Link>
                                                    <div className="img">
                                                        <img src="img/models/8.jpg" alt=""  />
                                                    </div>
                                                    <div className="item__info">
                                                        <h3 className="title">GameVisuals</h3>
                                                        <p className="desc">A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.</p>
                                                    </div>
                                                    <div className="item__author">
                                                        <img src="img/user/user.jpg" alt=""  />
                                                        <h3 className="author_name">Caden</h3>
                                                    </div>
                                                </div>
                                            </li>
                                            {/* !#8 model item */}
                                            {/* #9 model item */}
                                            <li className="fn__model_item">
                                                <div className="item">
                                                    <Link href="#" className="fn__bookmark">
                                                        <img src="svg/bookmark.svg" alt=""  className="fn__svg hasntbook" />
                                                        <img src="svg/bookmarked.svg" alt=""  className="fn__svg hasbook" />
                                                    </Link>
                                                    <div className="img">
                                                        <img src="img/models/9.jpg" alt=""  />
                                                    </div>
                                                    <div className="item__info">
                                                        <h3 className="title">GameVisuals</h3>
                                                        <p className="desc">A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.</p>
                                                    </div>
                                                    <div className="item__author">
                                                        <img src="img/user/user.jpg" alt=""  />
                                                        <h3 className="author_name">Caden</h3>
                                                    </div>
                                                </div>
                                            </li>
                                            {/* !#9 model item */}
                                            {/* #10 model item */}
                                            <li className="fn__model_item">
                                                <div className="item">
                                                    <Link href="#" className="fn__bookmark">
                                                        <img src="svg/bookmark.svg" alt=""  className="fn__svg hasntbook" />
                                                        <img src="svg/bookmarked.svg" alt=""  className="fn__svg hasbook" />
                                                    </Link>
                                                    <div className="img">
                                                        <img src="img/models/10.jpg" alt=""  />
                                                    </div>
                                                    <div className="item__info">
                                                        <h3 className="title">GameVisuals</h3>
                                                        <p className="desc">A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.</p>
                                                    </div>
                                                    <div className="item__author">
                                                        <img src="img/user/user.jpg" alt=""  />
                                                        <h3 className="author_name">Caden</h3>
                                                    </div>
                                                </div>
                                            </li>
                                            {/* !#10 model item */}
                                        </ul>
                                    </div>
                                    <div id="tab4" className="tab__item">
                                        <ul className="fn__model_items">
                                            {/* #1 model item */}
                                            <li className="fn__model_item">
                                                <div className="item">
                                                    <Link href="#" className="fn__bookmark has__bookmark">
                                                        <img src="svg/bookmark.svg" alt=""  className="fn__svg hasntbook" />
                                                        <img src="svg/bookmarked.svg" alt=""  className="fn__svg hasbook" />
                                                    </Link>
                                                    <div className="img">
                                                        <img src="img/models/1.jpg" alt=""  />
                                                    </div>
                                                    <div className="item__info">
                                                        <h3 className="title">GameVisuals</h3>
                                                        <p className="desc">A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.</p>
                                                    </div>
                                                    <div className="item__author">
                                                        <img src="img/user/user.jpg" alt=""  />
                                                        <h3 className="author_name">Caden</h3>
                                                    </div>
                                                </div>
                                            </li>
                                            {/* !#1 model item */}
                                            {/* #2 model item */}
                                            <li className="fn__model_item">
                                                <div className="item">
                                                    <Link href="#" className="fn__bookmark">
                                                        <img src="svg/bookmark.svg" alt=""  className="fn__svg hasntbook" />
                                                        <img src="svg/bookmarked.svg" alt=""  className="fn__svg hasbook" />
                                                    </Link>
                                                    <div className="img">
                                                        <img src="img/models/2.jpg" alt=""  />
                                                    </div>
                                                    <div className="item__info">
                                                        <h3 className="title">GameVisuals</h3>
                                                        <p className="desc">A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.</p>
                                                    </div>
                                                    <div className="item__author">
                                                        <img src="img/user/user.jpg" alt=""  />
                                                        <h3 className="author_name">Caden</h3>
                                                    </div>
                                                </div>
                                            </li>
                                            {/* !#2 model item */}
                                            <li className="fn__model_item new">
                                                <div className="item">
                                                    <Link href="#" className="fn__full_link" />
                                                    <span className="add" />
                                                    <span className="text">Add new</span>
                                                </div>
                                            </li>
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