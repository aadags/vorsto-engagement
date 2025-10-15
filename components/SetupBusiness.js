'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import PhoneInput from 'react-phone-number-input'
import axios from "axios";
import Script from "next/script";
import 'react-phone-number-input/style.css'
import TagMultiSelect from './TagMultiSelect'
import Cropper from 'react-easy-crop'

export default function SetupBusiness() {
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [tags, setTags] = useState([]);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState('');
  const [number, setNumber] = useState('');
  const [country, setCountry] = useState('CA');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [file, setFile] = useState();
  const [file2, setFile2] = useState();
  const [message, setMessage] = useState("");
  const [message2, setMessage2] = useState("");
  const [uploaded, setUploaded] = useState();
  const [uploaded2, setUploaded2] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitting2, setIsSubmitting2] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [preview, setPreview] = useState(null);

  const fileInputRef = useRef(null);
  const fileInputRef2 = useRef(null);
  const inputRef = useRef(null);

  const router = useRouter();

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const getCroppedImg = async (imageSrc, crop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const size = Math.min(crop.width, crop.height);
    canvas.width = size;
    canvas.height = size;

    ctx.drawImage(image, crop.x, crop.y, size, size, 0, 0, size, size);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/png");
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = { name, tagline, phone, email, tags, address, lat, lng, number, country };

    try {
      const response = await fetch('/api/update-business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) setSuccess("Information updated");
      else setError("An error occurred");
    } catch (error) {
      setError("An error occurred: " + error);
    } finally {
      setLoading(false);
    }
  };

  // Logo cropper
  const handleLogoSelect = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setShowCropper(true);
    }
  };

  const onCropComplete = (_, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels);

  const handleCropConfirm = async () => {
    try {
      const croppedBlob = await getCroppedImg(preview, croppedAreaPixels);
      const formData = new FormData();
      formData.append("file", croppedBlob, "business_logo_square.png");

      setIsSubmitting(true);
      const res = await fetch("/api/upload-business-logo", { method: "POST", body: formData });
      const result = await res.json();

      if (res.ok) {
        setMessage("Logo uploaded successfully");
        setUploaded(result.file);
      } else {
        setMessage(result.error || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("Cropping failed");
    } finally {
      setIsSubmitting(false);
      setShowCropper(false);
    }
  };

  // Promo upload
  const handlePromoImageSubmit = async (e) => {
    e.preventDefault();
    if (!file2) {
      setMessage2("Please select a file.");
      return;
    }

    setIsSubmitting2(true);
    const formData = new FormData();
    formData.append("file", file2);

    const res = await fetch("/api/upload-business-promo", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    if (res.ok) {
      setMessage2(`Uploaded successfully`);
      setUploaded2(result.file);
      if (fileInputRef2.current) fileInputRef2.current.value = null;
    } else {
      setMessage2(result.error || "Upload failed");
    }
    setIsSubmitting2(false);
  };

  const fetchOrg = async () => {
    const response = await axios.get(`/api/get-org-details`);
    const org = response.data;
    setName(org.name);
    setTags(org.tags);
    setTagline(org.tagline);
    setAddress(org.address);
    setLat(org.address_lat);
    setLng(org.address_long);
    setPhone(org.contact_number);
    setNumber(org.number);
    setType(org.type);
    setEmail(org.contact_email);
    setCountry(org.country);
    setUploaded({ url: org.logo });
    setUploaded2({ url: org.promo_image || "/Samplepromo.png" });
  };

  useEffect(() => { fetchOrg(); }, []);

  const POPULAR_FOOD_TAGS = [
    "Burgers", "Pizza", "Pasta", "BBQ", "Seafood", "Sushi", "Curry",
    "Coffee", "Vegan", "Desserts", "Pickup", "Delivery", "Catering"
  ];

  return (
    <>
      <div className="techwave_fn_image_generation_page">
        <div className="generation__page">
          <div className="generation_header">
            <div className="header_top">
              <h1 className="title">Update Business Information</h1>
            </div>

            <div className="header_bottom">
              <form onSubmit={handleSubmit} style={{ width: "70%" }}>
                {/* ---- Fields ---- */}
                <div className="form_group">
                  <label>Business Name</label>
                  <input
                    type="text"
                    id="name"
                    className="full_width"
                    placeholder="Business Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <br />

                <div className="form_group">
                  <label>Phone Number</label>
                  <PhoneInput
                    id="phone"
                    className="full_width"
                    placeholder="Enter phone number"
                    defaultCountry="CA"
                    value={phone}
                    onChange={setPhone}
                    international
                  />
                </div>
                <br />

                <div className="form_group">
                  <label>Business Email</label>
                  <input
                    type="email"
                    id="email"
                    className="full_width"
                    placeholder="Business Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <br />

                <div className="form_group">
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
                <br />

                <div className="form_group">
                  <label>Business Number</label>
                  <input
                    type="text"
                    id="number"
                    className="full_width"
                    placeholder="Business Number"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    required
                  />
                </div>
                <br />

                <div className="form_group">
                  <label>Business Address</label>
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
                <br />

                {type === "Food" && (
                  <>
                    <div className="form_group">
                      <label>Tags</label>
                      <TagMultiSelect
                        value={tags}
                        onChange={setTags}
                        suggestions={POPULAR_FOOD_TAGS}
                        placeholder="Add tags (Enter, comma or Tab)"
                      />
                    </div>
                    <br />
                  </>
                )}

                {/* ---- Logo Upload ---- */}
                <hr style={{ margin: "2rem 0", border: "none", borderTop: "1px solid #ddd" }} />
                <h3 style={{ marginBottom: "0.5rem" }}>Business Logo</h3>
                <span style={{ color: "green", display: "block", marginBottom: "0.5rem" }}>800kb max per image</span>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "0.8rem",
                    paddingBottom: "1rem",
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoSelect}
                    ref={fileInputRef}
                    className="full_width"
                  />
                  {isSubmitting && <p>Uploading...</p>}
                  {message && <p style={{ color: "red" }}>{message}</p>}
                  {uploaded && (
                    <img
                      src={uploaded.url}
                      alt="Business Logo"
                      width="150"
                      style={{ marginTop: "0.5rem", borderRadius: "8px" }}
                    />
                  )}
                </div>

                {/* ---- Promo Image Upload ---- */}
                <hr style={{ margin: "2rem 0", border: "none", borderTop: "1px solid #ddd" }} />
                <h3 style={{ marginBottom: "0.5rem" }}>Promo Image</h3>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "0.8rem",
                    paddingBottom: "1rem",
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile2(e.target.files?.[0] || null)}
                    ref={fileInputRef2}
                    className="full_width"
                  />
                  <button
                    type="button"
                    onClick={handlePromoImageSubmit}
                    disabled={isSubmitting2}
                    className="techwave_fn_button"
                  >
                    {isSubmitting2 ? "Uploading..." : "Upload Promo Image"}
                  </button>

                  {message2 && <p style={{ color: "red" }}>{message2}</p>}
                  {uploaded2 && (
                    <img
                      src={uploaded2.url}
                      alt="Promo"
                      width="200"
                      style={{ marginTop: "0.5rem", borderRadius: "8px" }}
                    />
                  )}
                </div>

                {/* ---- Cropper Overlay ---- */}
                {showCropper && (
                  <div
                    style={{
                      position: "fixed",
                      top: 0, left: 0,
                      width: "100%", height: "100%",
                      background: "rgba(0,0,0,0.8)",
                      zIndex: 9999,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ position: "relative", width: 300, height: 300, background: "#333" }}>
                      <Cropper
                        image={preview}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                      />
                    </div>
                    <div style={{ marginTop: "1rem" }}>
                      <button onClick={handleCropConfirm} className="techwave_fn_button" disabled={isSubmitting}>
                        {isSubmitting ? "Uploading..." : "Confirm Crop & Upload"}
                      </button>
                      <button
                        onClick={() => setShowCropper(false)}
                        style={{ marginLeft: "10px", color: "#fff" }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <p style={{ color: "red" }}>{error}</p>
                <p style={{ color: "green" }}>{success}</p>

                <br />
                <div className="generate_section">
                  <button type="submit" className="techwave_fn_button" aria-readonly={loading}>
                    <span>
                      Update Information {loading && <FontAwesomeIcon icon={faSpinner} spin={true} />}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyCzZUtpoLjBKa5hFrvqCAP_9zBQFPVcXy8&libraries=places`}
        strategy="afterInteractive"
        onLoad={() => {
          const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, { types: ["address"] });
          autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            const location = place.geometry?.location;
            setAddress(place.formatted_address);
            setLat(location?.lat());
            setLng(location?.lng());
          });
        }}
      />
    </>
  );
}
