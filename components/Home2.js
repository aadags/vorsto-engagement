'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import axios from 'axios';
import Script from "next/script";
import { animationText } from '@/components/Utilities'
import { useRouter } from 'next/navigation';
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import TagMultiSelect from './TagMultiSelect';

export default function Home2() {

  const router = useRouter();
  const [organization, setOrganization] = useState('');
  const [user, setUser] = useState('');
  const [name, setName] = useState('');
  const [dba, setDBName] = useState('');
  const [number, setNumber] = useState('');
  const [type, setType] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [tagline, setTagline] = useState('');
  const [domain, setDomain] = useState('');
  const [address, setAddress] = useState('')
  const [lat, setLat] = useState(null)
  const [lng, setLng] = useState(null)
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [tags, setTags] = useState([]);
  const [commission, setCommission] = useState(20);
  const [error, setError] = useState(false);

  useEffect(() => {

    const fetchOrg = async () => {
      
      const response = await axios.get(`/api/get-org-details`);
      const org = response.data;
      setOrganization(org);
      setName(org.name)
      setDBName(org.dba)
      setNumber(org.number)
      setType(org.type)
      setCountry(org.country)
      setTagline(org.tagline)
      setDomain(org.subdomain)
      setAddress(org.address)
      setEmail(org.contact_email)
      setPhone(org.contact_number)
      setTags(org.tags)

      if(org.onboarding)
      {
        router.push('/');
      }
    };
    fetchOrg();
    animationText()
  }, [])

  const inputRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
  
    try {
      const res = await fetch('/api/update-business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          dba,
          number,
          type,
          address,
          lat,
          lng,
          country: country,
          tagline,
          subdomain: domain,
          phone,
          init: true,
          email,
          tags,
          commission
        }),
      });
  
      const data = await res.json();
  
      if (!res.ok) throw new Error(data.error || 'Failed to update business');
  
      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  function slugify(name = '') {
    return name
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '');
  }

  const POPULAR_FOOD_TAGS = [
    // Core dishes
    "Burgers","Pizza","Pasta","Steak","BBQ","Fried Chicken","Wings","Seafood",
    "Tacos","Burritos","Nachos","Sandwiches","Subs","Wraps","Hot Dogs",
    "Sushi","Sashimi","Ramen","Udon","Soba","Tempura","Katsu","Teriyaki",
    "Pho","Banh Mi","Pad Thai","Curry","Biryani","Kebab","Shawarma","Falafel",
    "Dumplings","Gyoza","Bao","Noodles","Fried Rice","Poke","Bibimbap",
    "Pierogi","Kebab","Mezze","Tapas","Small Plates","Salad","Soup",
    "Breakfast","Brunch","Pancakes","Waffles","Omelettes","Bowl","Grain Bowl",
  
    // Sides & snacks
    "Fries","Poutine","Onion Rings","Garlic Bread","Mozzarella Sticks","Hummus","Chips","Salsa","Guacamole",
  
    // Desserts & sweets
    "Desserts","Ice Cream","Gelato","Frozen Yogurt","Cake","Cheesecake","Brownies","Cookies","Donuts",
    "Pastries","Bakery","Crepes","Churros","Tiramisu","Baklava",
  
    // Drinks
    "Coffee","Espresso","Latte","Cold Brew","Tea","Chai","Bubble Tea","Boba","Smoothies","Juice","Milkshakes",
  
    // Cuisines by country/region
    "Canadian","American","Latin American","Mexican","Caribbean","Jamaican","Cuban","Brazilian","Argentinian","Peruvian",
    "Italian","French","Spanish","Portuguese","Greek","Turkish","Mediterranean",
    "British","Irish","German","Polish","Hungarian","Czech","Swiss","Belgian","Dutch",
    "Nordic","Swedish","Norwegian","Danish","Finnish",
    "Middle Eastern","Lebanese","Israeli","Persian","Moroccan","Egyptian","Tunisian",
    "Asian","Chinese","Japanese","Korean","Thai","Vietnamese","Filipino","Indonesian","Malaysian","Singaporean",
    "South Asian","Indian","Pakistani","Bangladeshi","Sri Lankan",
    "African","Ethiopian","Nigerian","Ghanaian","South African",
  
    // Dietary / lifestyle
    "Vegan","Vegetarian","Pescatarian","Halal","Kosher","Gluten-Free","Dairy-Free","Nut-Free","Keto","Paleo","Low-Carb","Organic","Healthy",
  
    // Service / experience
    "Family Style","Comfort Food","Street Food","Fast Food","Casual Dining","Fine Dining","Food Truck","Late Night","Kid Friendly",
    "Pickup","Delivery","Catering","Meal Prep"
  ];

  return (
    <>
      <div className="techwave_fn_image_generation_page">
        <div className="generation__page">
          {/* Generation Header */}
          <div className="generation_header">
            <div className="header_bottom">
              <form onSubmit={handleSubmit} className="business-form">
                  <h2>Get ready for take off</h2>
                  <p>Setup your business.</p>
                  <div className="form_group" >
                  <label>Country</label>
                      <select
                          value={country}
                          onChange={(e) =>
                                      setCountry(e.target.value)
                                    }>
                          <option value="">Select Country</option>
                          <option value="CA">Canada</option>
                          <option value="US">United States of America</option>
                      </select>
                  </div>
                  <br/>
                  
                  <div className="form_group"  >
                  <label>Business Legal Name</label>
                    <input
                      type="text"
                      id="b_name"
                      className="full_width"
                      placeholder="Business Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <br />
                  <div className="form_group"  >
                  <label>Doing Business As?</label>
                    <input
                      type="text"
                      id="b_name"
                      className="full_width"
                      placeholder="DBA"
                      value={dba}
                      onChange={(e) => setDBName(e.target.value)}
                      required
                    />
                  </div>
                  <br />
                  <div className="form_group"  >
                  <label>Business Number</label>
                    <input
                      type="text"
                      id="b_name"
                      className="full_width"
                      placeholder="Business Number"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      required
                    />
                  </div>
                  <br />
                  <div className="form_group" >
                  <label>Business Address (Orders & Pickups will be routed to this location)</label>
                  <input
                    type="text"
                    id="address"
                    className="full_width"
                    placeholder="Address"
                    value={address}
                    ref={inputRef}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
                <br/>

                <br/>
                  <div className="form_group" >
                  <label>Business Type</label>
                      <select
                          value={type}
                          onChange={(e) =>
                                      setType(e.target.value)
                                    }>
                          <option value="Retail">Retail/Wholesale Store</option>
                          <option value="Grocery">Grocery Store</option>
                          <option value="Food">Restaurant</option>
                      </select>
                  </div>
                  <br/>
                  
                  <div className="form_group" >
                <label>Phone Number</label>
                <PhoneInput
                  id="phone"
                  placeholder="Enter phone number"
                  defaultCountry="US"
                  value={phone}
                  onChange={setPhone}
                  international
                />
                </div>
                <br/>
                <div className="form_group" >
                  <label>Business Email</label>
                  <input
                    type="text"
                    id="email"
                    className="full_width"
                    placeholder="Business Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <br/>
                <div className="form_group" >
                  <label>Tagline</label>
                  <input
                    type="text"
                    id="tagline"
                    className="full_width"
                    placeholder="Tagline"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    required
                  />
                </div>
                <br/>

                {type === "Food" && <><div className="form_group">
                  <label>Tags</label>
                  <TagMultiSelect
                    value={tags}
                    onChange={setTags}
                    suggestions={POPULAR_FOOD_TAGS}  
                    placeholder="Add tags (Enter, comma or Tab)"
                    // max={10}
                  />
                </div>
                <br/></>}
                {type === "Food" && <>
                <div className="form_group" >
                  <label>Delivery Commission</label>
                      <select
                          value={commission}
                          onChange={(e) =>
                                      setCommission(e.target.value)
                                    }>
                          <option value="20">20%</option>
                          <option value="30">30% (lower delivery fees)</option>
                      </select>
                  </div>
                  <br/>
                  </>}

                <div className="currency-wrapper" style={{ width: "100%" }}>
                  <input
                    type="text"
                    className="full_width"
                    placeholder="subdomain"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    required
                  />
                  <span className="currency-suffix">.vorsto.shop</span>
                </div>
                <br/>
                
                <span style={{ color: "green" }}>Business Verification may take a few moments. We may ask to share additional information, otherwise you are ready to go!</span>

                <br/><br/>

                  {loading && <span>updating...</span>} 
                  {!loading && <button className="techwave_fn_button" type="submit">Proceed</button>} 

              </form>
            </div>
          </div>
        </div>
      </div>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyCzZUtpoLjBKa5hFrvqCAP_9zBQFPVcXy8&libraries=places`}
        strategy="afterInteractive"
        onLoad={() => {
          const autocomplete = new window.google.maps.places.Autocomplete(
            inputRef.current,
            { types: ["address"], componentRestrictions: { country: `${country}` }, },
          );

          autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            const location = place.geometry?.location;
            setAddress(place.formatted_address)
            setLat(location?.lat())
            setLng(location?.lng())
          });
        }}
      />

    </>
  )
}