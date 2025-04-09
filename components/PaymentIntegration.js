"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import axios from 'axios';


export default function PaymentIntegration() {

    const router = useRouter();
    // For filter

    // Initialize your component state
    const [activeIndex, setActiveIndex] = useState(1);
    const [selectedTag, setSelectedTag] = useState('');
    const [payments, setPayments] = useState([]);

    const products = [
        { id: 1, category: 1, img: "/img/stripe2.png", title: 'Stripe', desc: "Financial infrastructure to grow your revenue", url: `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_STRIPE_CLIENT_ID}&scope=read_write` },
        { id: 2, category: 1, img: "/img/square2.png", title: 'Square', desc: "Powering all the different ways you do business.", url: `${process.env.NEXT_PUBLIC_SQUARE_BASE}/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_SQUARE_APP_ID}&scope=ITEMS_WRITE+ITEMS_READ+ORDERS_WRITE+ORDERS_READ+PAYMENTS_WRITE+PAYMENTS_READ+INVENTORY_WRITE+INVENTORY_READ+CUSTOMERS_WRITE+CUSTOMERS_READ+INVOICES_READ+INVOICES_WRITE+MERCHANT_PROFILE_WRITE+MERCHANT_PROFILE_READ+LOYALTY_WRITE+LOYALTY_READ+SUBSCRIPTIONS_WRITE+SUBSCRIPTIONS_READ&session=false&state=82201dd8d83d23cc8a48caf52b` },
    ]

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

    const getInstalledPayments = async () => {
        try {
            const response = await axios.get(`/api/get-installed-payments`);
            if (response.data) {
                const payments = response.data;
                const paymentNames = payments.map(payment => payment.name);
                console.log({paymentNames})
                setPayments(paymentNames);
            }
        } catch (error) {
            console.error("Error getting payments:", error);
        }
    };

    const getStripeConnectLink = async () => {
        try {
            const response = await axios.get(`/api/connect-stripe-link`);
            if (response.data) {
                router.push(response.data.url);
            }
        } catch (error) {
            console.error("Error getting payments:", error);
        }
    };

    useEffect(() => {
        getInstalledPayments();
      }, []);

    return (
        <>
        <div className="techwave_fn_models_page">
            <div className="techwave_fn_models">
                <div className="container">
                    <ul className="fn__model_items">
                                            {/*  model item goes here */}{
                                                payments && filteredProducts.map((product, index) => (
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
                                                                {(payments.includes(product.title))? 
                                                                <a href="#" className="author_name">Activated</a>
                                                                :
                                                                (product.title==="Stripe")?
                                                                    <a className="techwave_fn_button" href={product.url}>Activate</a>
                                                                :
                                                                    <a className="techwave_fn_button" href={product.url}>Activate</a>
                                                                }
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
