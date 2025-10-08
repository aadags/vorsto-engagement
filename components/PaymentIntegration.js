"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import StripeDetails from "./StripeDetails";

export default function PaymentIntegration({ org }) {
  const router = useRouter();
  // For filter

  // Initialize your component state
  const [activeIndex, setActiveIndex] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedTag, setSelectedTag] = useState("");
  const [paymentProcessors] = useState(org.payment_processors);
  const [isZuppr, setIsZuppr] = useState(false);
  const [isWebEnv, setIsWebEnv] = useState(false);

  const paymentProviders = [
    {
      id: 1,
      category: 1,
      img: "/img/vorstopay2.png",
      title: "VorstoPay",
      desc: "Financial infrastructure to grow your revenue powered by stripe",
      url: `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_STRIPE_CLIENT_ID}&scope=read_write`,
      onclick: () => getStripeConnectLink()

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

  const [bookmarkStates, setBookmarkStates] = useState(
    paymentProviders.map(() => false)
  );

  const handleOnClick = (index) => {
    setActiveIndex(index);
    setSelectedTag("");
  };

  const filteredPaymentProvidersByCategory = activeIndex
    ? paymentProviders.filter(
        (paymentProvider) => paymentProvider.category === activeIndex
      )
    : null;

  const filteredPayments = selectedTag
    ? filteredPaymentProvidersByCategory.filter((paymentProvider) =>
        paymentProvider.tags.includes(selectedTag)
      )
    : filteredPaymentProvidersByCategory;

  const handleTagChange = (event) => {
    setSelectedTag(event.target.value);
  };

  const getStripeConnectLink = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/connect-stripe-link`);
      if (response.data) {
        setLoading(false);
        if(isZuppr && !isWebEnv)
        {
          if (window.ReactNativeWebView?.postMessage) {
            // when inside your React Native WebView
            window.ReactNativeWebView.postMessage(
                JSON.stringify({ action: "openExternal", url: response.data.url })
            );
            } else {
            // normal web browser
            window.open(response.data.url, "_blank");
            }

        } else {
          router.push(response.data.url);
        }
      }
    } catch (error) {
      console.error("Error getting payments:", error);
      setLoading(false)
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {

      setIsZuppr(window.location.hostname.includes(process.env.NEXT_PUBLIC_ZUPPR_API))
      const ua = navigator.userAgent.toLowerCase();
      
      const isWeb =
        !/iphone|ipad|ipod|android/.test(ua) && /chrome|safari|firefox|edge/.test(ua);
      setIsWebEnv(isWeb);
    }
  }, []);

  return (
    <>
      <div className="techwave_fn_models_page">
        <div className="techwave_fn_models">
          <div className="container">
            <ul className="fn__model_items">
              {paymentProcessors &&
                filteredPayments.map((product, index) => (
                  <li key={product.id} className="fn__model_item">
                    <div className="item">
                      <div className="img">
                        <img src={product.img} alt="" />
                      </div>
                      <div className="item__info">
                        <h3 className="title">{product.title}</h3>
                        <p className="">{product.desc}</p>
                        {paymentProcessors.some(
                          (p) => p.name === product.title
                        ) && <StripeDetails />}
                      </div>
                      <div className="item__author">
                        {paymentProcessors.some(
                          (p) => p.name === product.title
                        ) ? (
                          <a href="#" className="author_name">
                            Activated
                          </a>
                        )  : (
                          <button className="techwave_fn_button" onClick={product.onclick} disabled={loading}>
                            {loading? 'Activating...' :'Activate'}
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
