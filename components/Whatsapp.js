"use client";
import React, { useState, useEffect } from "react";
import EmbeddedSignup from "./WhatsappEmbedded";

export default function Whatsapp() {

  return (
    <>
      <div className="techwave_fn_image_generation_page">
        <div className="generation__page">
          {/* Generation Header */}
          <div className="generation_header">
            <div className="header_top">
              <h1 className="title">Whatsapp</h1>
            </div>

            <div className="header_bottom">
              <EmbeddedSignup />
            </div>
          </div>
          {/* !Generation Header */}
        </div>
      </div>
    </>
  );
}
