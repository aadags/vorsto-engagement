"use client"
import React, { useState } from 'react'

export default function FAQ() {
  const [isActive, setIsActive] = useState({
    status: false,
    key: 1,
  });

  const handleToggle = (key) => {
    if (isActive.key === key) {
      setIsActive({
        status: false,
      });
    } else {
      setIsActive({
        status: true,
        key,
      });
    }
  };
  return (
    <>

      <div className="techwave_fn_accordion" data-type="accordion"> {/* data-type values: accordion, toggle */}
        {/* #1 accordion item */}
        <div onClick={() => handleToggle(1)} className={`acc__item ${isActive.key === 1 ? "opened" : ""}`} >
          <div className="acc__header">
            <h2 className="acc__title">How does it work?</h2>
            <div className="acc__icon" />
          </div>
          <div className="acc__content" style={isActive.key === 1 ? { "display": "block" } : { "display": "none" }}>
            <p>TECH-AI is an AI-powered content production suite that empowers creators with a powerful, customisable, and user-friendly platform for bringing their ideas to life.</p>
            <p>With a focus on granular control at every step of content creation, we put creators at the centre of the creative process by offering granular control at every stage of generation, ensuring that AI enhances, rather than replaces, human creative potential.</p>
            <p>Our custom back-end delivers advancements in model fine tuning, prompt adherence, training and inference speed, and multi-image prompting functionality. We also address common issues around image degradation and have implemented a custom upscaling, with much more on the way!</p>
          </div>
        </div>
        {/* !#1 accordion item */}
        {/* #2 accordion item */}
        <div onClick={() => handleToggle(2)} className={`acc__item ${isActive.key === 2 ? "opened" : ""}`} >
          <div className="acc__header">
            <h2 className="acc__title">How long does it take to download updates?</h2>
            <div className="acc__icon" />
          </div>
          <div className="acc__content" style={isActive.key === 2 ? { "display": "block" } : { "display": "none" }} >
            <p>TECH-AI is an AI-powered content production suite that empowers creators with a powerful, customisable, and user-friendly platform for bringing their ideas to life.</p>
            <p>With a focus on granular control at every step of content creation, we put creators at the centre of the creative process by offering granular control at every stage of generation, ensuring that AI enhances, rather than replaces, human creative potential.</p>
            <p>Our custom back-end delivers advancements in model fine tuning, prompt adherence, training and inference speed, and multi-image prompting functionality. We also address common issues around image degradation and have implemented a custom upscaling, with much more on the way!</p>
          </div>
        </div>
        {/* !#2 accordion item */}
        {/* #3 accordion item */}
        <div onClick={() => handleToggle(3)} className={`acc__item ${isActive.key === 3 ? "opened" : ""}`} >
          <div className="acc__header">
            <h2 className="acc__title">Do I need a designer to use this Admin Theme?</h2>
            <div className="acc__icon" />
          </div>
          <div className="acc__content" style={isActive.key === 3 ? { "display": "block" } : { "display": "none" }}>
            <p>TECH-AI is an AI-powered content production suite that empowers creators with a powerful, customisable, and user-friendly platform for bringing their ideas to life.</p>
            <p>With a focus on granular control at every step of content creation, we put creators at the centre of the creative process by offering granular control at every stage of generation, ensuring that AI enhances, rather than replaces, human creative potential.</p>
            <p>Our custom back-end delivers advancements in model fine tuning, prompt adherence, training and inference speed, and multi-image prompting functionality. We also address common issues around image degradation and have implemented a custom upscaling, with much more on the way!</p>
          </div>
        </div>
        {/* !#3 accordion item */}
        {/* #4 accordion item */}
        <div onClick={() => handleToggle(4)} className={`acc__item ${isActive.key === 4 ? "opened" : ""}`} >
          <div className="acc__header">
            <h2 className="acc__title">What do I need to do to start selling?</h2>
            <div className="acc__icon" />
          </div>
          <div className="acc__content" style={isActive.key === 4 ? { "display": "block" } : { "display": "none" }}>
            <p>TECH-AI is an AI-powered content production suite that empowers creators with a powerful, customisable, and user-friendly platform for bringing their ideas to life.</p>
            <p>With a focus on granular control at every step of content creation, we put creators at the centre of the creative process by offering granular control at every stage of generation, ensuring that AI enhances, rather than replaces, human creative potential.</p>
            <p>Our custom back-end delivers advancements in model fine tuning, prompt adherence, training and inference speed, and multi-image prompting functionality. We also address common issues around image degradation and have implemented a custom upscaling, with much more on the way!</p>
          </div>
        </div>
        {/* !#4 accordion item */}
        {/* #5 accordion item */}
        <div onClick={() => handleToggle(5)} className={`acc__item ${isActive.key === 5 ? "opened" : ""}`} >
          <div className="acc__header">
            <h2 className="acc__title">How much does Extended license cost?</h2>
            <div className="acc__icon" />
          </div>
          <div className="acc__content" style={isActive.key === 5 ? { "display": "block" } : { "display": "none" }}>
            <p>TECH-AI is an AI-powered content production suite that empowers creators with a powerful, customisable, and user-friendly platform for bringing their ideas to life.</p>
            <p>With a focus on granular control at every step of content creation, we put creators at the centre of the creative process by offering granular control at every stage of generation, ensuring that AI enhances, rather than replaces, human creative potential.</p>
            <p>Our custom back-end delivers advancements in model fine tuning, prompt adherence, training and inference speed, and multi-image prompting functionality. We also address common issues around image degradation and have implemented a custom upscaling, with much more on the way!</p>
          </div>
        </div>
        {/* !#5 accordion item */}
        {/* #6 accordion item */}
        <div onClick={() => handleToggle(6)} className={`acc__item ${isActive.key === 6 ? "opened" : ""}`} >
          <div className="acc__header">
            <h2 className="acc__title">What platforms are compatible?</h2>
            <div className="acc__icon" />
          </div>
          <div className="acc__content" style={isActive.key === 6 ? { "display": "block" } : { "display": "none" }}>
            <p>TECH-AI is an AI-powered content production suite that empowers creators with a powerful, customisable, and user-friendly platform for bringing their ideas to life.</p>
            <p>With a focus on granular control at every step of content creation, we put creators at the centre of the creative process by offering granular control at every stage of generation, ensuring that AI enhances, rather than replaces, human creative potential.</p>
            <p>Our custom back-end delivers advancements in model fine tuning, prompt adherence, training and inference speed, and multi-image prompting functionality. We also address common issues around image degradation and have implemented a custom upscaling, with much more on the way!</p>
          </div>
        </div>
        {/* !#6 accordion item */}
      </div>

    </>
  )
}