
"use client"
import React, { useState, useEffect} from 'react'
import { getUser } from '@/services/userService';
import Link from 'next/link'


export default function PricingList() {
  const [activeIndex, setActiveIndex] = useState(1);
  const [user, setUser] = useState();

  useEffect(() => {
        
    const fetchData = async () => {
      try {
        const user = await getUser();
        setUser(user);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [])

  const handleOnClick = (index) => {
    setActiveIndex(index);
  };

  const PREMIUM_PLAN = process.env.NEXT_PUBLIC_PAYSTACK_PREMIUM_PLAN;
  const ENTERPRISE_PLAN = process.env.NEXT_PUBLIC_PAYSTACK_ENTERPRISE_PLAN
  return (
    <>
      {/* toggle pricing */}
      {/* <div className="pricing__toggle">
        <div className="toggle_in">
          <a onClick={() => handleOnClick(1)}  className={activeIndex === 1 ? "active" : ""}>Yearly</a>
          <a onClick={() => handleOnClick(2)}  className={activeIndex === 2 ? " active" : ""}>Monthly</a>
          <span className="bg" style={activeIndex===1 ? {"left":"10px","width":"118.875px"} : {"left":"128.875px","width":"134.594px"}} />
        </div>
      </div> */}
      {/* !toggle pricing */}
      {/* pricing tabs */}
      <div className="pricing__tabs">
        <div className={activeIndex === 1 ? "pricing__tab active" : "pricing__tab"} id="tab1">
          {/* Mobile Pricing Table (shortcode) */}
          <div className="fn__mobile_pricing">

            {/* Second Plan */}
            <div className="pricing__item">
              <div className="pricing__item_holder">
                <div className="pricing__item__header">
                  <h2 className="title">Premium</h2>
                  <h3 className="price"><span>NGN 22,000</span> / month</h3>
                  <p className="purchase">
                  {user && user.plan===PREMIUM_PLAN ? 
                  <Link href="#" aria-disabled className="techwave_fn_button"><span>Current Plan</span></Link>
                  :
                  <Link href={`${process.env.NEXT_PUBLIC_PAYSTACK_PREMIUM_PLAN_LINK}`} className="techwave_fn_button"><span>Buy Premium</span></Link>
                  }
                  </p>
                </div>
                
              </div>
            </div>
            {/* !Second Plan */}
            {/* Third Plan */}
            <div className="pricing__item">
              <div className="pricing__item_holder">
              <div className="popular"><span>Most Popular</span></div>
                <div className="pricing__item__header">
                  <h2 className="title">Enterprice</h2>
                  <h3 className="price"><span>NGN 40,000</span> / month</h3>
                  <p className="purchase">
                  {user && user.plan===ENTERPRISE_PLAN ? 
                  <Link href="#" aria-disabled className="techwave_fn_button"><span>Current Plan</span></Link>
                  :
                  <Link href={`${process.env.NEXT_PUBLIC_PAYSTACK_ENTERPRISE_PLAN_LINK}`} className="techwave_fn_button"><span>Buy Enterprice</span></Link>
                  }
                  </p>
                </div>
              </div>
            </div>
            {/* !First Plan */}
          </div>
          {/* /Mobile Pricing Table (shortcode) */}
          <div className="pricing__content">
            {/* table's header */}
            <div className="pricing__header">
              <div className="item_row">
                
                <div className="item_col">
                  <h2 className="title">Premium</h2>
                  <h3 className="price"><span>NGN 22,000</span> / month</h3>
                  <p className="purchase">
                  {user && user.plan===PREMIUM_PLAN ? 
                  <Link href="#" aria-disabled><span>Current Plan</span></Link>
                  :
                  <Link href={`${process.env.NEXT_PUBLIC_PAYSTACK_PREMIUM_PLAN_LINK}`} className="techwave_fn_button"><span>Buy Premium</span></Link>
                  }
                  </p>
                </div>
                <div className="item_col">
                  <div className="popular"><span>Best Offer</span></div>
                  <h2 className="title">Enterprise</h2>
                  <h3 className="price"><span>NGN 40,000</span> / month</h3>
                  <p className="purchase">
                  {user && user.plan===ENTERPRISE_PLAN ? 
                  <Link href="#" aria-disabled><span>Current Plan</span></Link>
                  :
                  <Link href={`${process.env.NEXT_PUBLIC_PAYSTACK_ENTERPRISE_PLAN_LINK}`} className="techwave_fn_button"><span>Buy Enterprice</span></Link>
                  }
                  </p>
                </div>
              </div>
            </div>
            {/* !table's header */}
            {/* table's options */}
            <div className="pricing__fields">
              <div className="item_row">
                
                <div className="item_col">
                  <span className="option_text">Setup Functions</span>
                </div>
                <div className="item_col">
                  <span className="option_text">Setup Functions</span>
                </div>
              </div>
              
              <div className="item_row">
                
                <div className="item_col">
                  <span className="option_text">Unlimited API Requests</span>
                </div>
                <div className="item_col">
                  <span className="option_text">Unlimited API Requests</span>
                </div>
              </div>
              <div className="item_row">
                
                <div className="item_col">
                  <span className="option_text">3 Million Token Monthly Limit</span>
                </div>
                <div className="item_col">
                  <span className="option_text">10 Million Token Monthly Limit</span>
                </div>
              </div>
              <div className="item_row">
                <div className="item_col">
                  <span className="option_text">-</span>
                </div>
                <div className="item_col">
                  <span className="option_text">Flexible LLM Selection Setting</span>
                </div>
              </div>
            </div>
            {/* !table's options */}
          </div>
        </div>
      </div>
      {/* !pricing tabs */}
    </>
  )
}