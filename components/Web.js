"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import StripeDetails from "./StripeDetails";

export default function Web({ org }) {
  const router = useRouter();
  // For filter

  // Initialize your component state
  const [activeIndex, setActiveIndex] = useState(1);
  const [selectedTag, setSelectedTag] = useState("");
  const [storefront] = useState(org.shop_template);

  const templates = [
    {
      id: 1,
      category: "Simple",
      img: "/simple.jpg",
      title: "Simple Market",
      slug: "simple",
      desc: "Simple ecommerce store template",
      category: "Simple",
      onclick: () => getStripeConnectLink("simple")

    },
    {
      id: 2,
      category: "Simple",
      img: "/simple-res.png",
      title: "Simple Restaurant",
      slug: "simple-res",
      desc: "Simple online restaurant template",
      category: "Simple",
      onclick: () => getStripeConnectLink("simple-res")

    },
    // {
    //   id: 2,
    //   category: 1,
    //   img: "/img/square2.png",
    //   title: "Square",
    //   desc: "Powering all the different ways you do business. Connect your existing or new Square accounts",
    //   url: `${process.env.NEXT_PUBLIC_SQUARE_BASE}/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_SQUARE_APP_ID}&scope=ITEMS_WRITE+ITEMS_READ+ORDERS_WRITE+ORDERS_READ+PAYMENTS_WRITE+PAYMENTS_READ+PAYMENTS_WRITE_ADDITIONAL_RECIPIENTS+INVENTORY_WRITE+INVENTORY_READ+CUSTOMERS_WRITE+CUSTOMERS_READ+INVOICES_READ+INVOICES_WRITE+MERCHANT_PROFILE_WRITE+MERCHANT_PROFILE_READ+LOYALTY_WRITE+LOYALTY_READ+SUBSCRIPTIONS_WRITE+SUBSCRIPTIONS_READ&session=false&state=82201dd8d83d23cc8a48caf52b`,
    // },
  ];


  const handleOnClick = (index) => {
    setActiveIndex(index);
    setSelectedTag("");
  };

  const filteredTemplatesByCategory = activeIndex
    ? templates.filter(
        (paymentProvider) => paymentProvider.category === activeIndex
      )
    : null;

  const filteredPayments = selectedTag
    ? filteredTemplatesByCategory.filter((paymentProvider) =>
        paymentProvider.tags.includes(selectedTag)
      )
    : filteredTemplatesByCategory;

  const handleTagChange = (event) => {
    setSelectedTag(event.target.value);
  };

  const getStripeConnectLink = async (slug) => {
    const confirmed = window.confirm("Are you sure you want to update the store template?");
    
    if (!confirmed) return;
  
    try {
      const response = await axios.post('/api/update-store-template', { slug });
  
      if (response.data) {
        router.refresh();
      }
    } catch (error) {
      console.error("Error getting payments:", error);
    }
  };
  
  

  return (
    <>
      <div className="techwave_fn_models_page">
        <div className="techwave_fn_models">
          <div className="container">
            <ul className="fn__model_items">
              {templates.map((product, index) => (
                  <li key={product.id} className="fn__model_item">
                    <div className="item">
                      <div className="img">
                        <img src={product.img} alt="" />
                      </div>
                      <div className="item__info">
                        <h3 className="title">{product.title}</h3>
                        <p className="">{product.desc}</p>
                      </div>
                      <div className="item__author">
                        { product.slug === storefront ? (
                          <a href="#" className="author_name">
                            Current Template
                          </a>
                        )  : (
                          <button className="techwave_fn_button" onClick={product.onclick}>
                            Install Template
                          </button>
                        )}
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
