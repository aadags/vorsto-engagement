'use client'
import React, { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import LikeCounter from './utilities/LikeCounter'
import Isotope from 'isotope-layout'

const feeds = [
  {
    img: "img/gallery/1.jpg",
    authorPic: "img/gallery/1.jpg",
    authorName: "LuckyLee",
    count: 345,
    desc: "Terra Fusion: A daring fusion of tectonic forms with neo-abstract swirls, reflecting the chaos and ",
    tags: ["", "new"],
    subTitle: "model",
    title: "ArtShaper v3",
    promptDetails: "Realistic painting, photorealistic masterpiece detailing, professional photography, natural lighting, volumetric lighting maximalist photoillustration: 8k resolution concept art intricately detailed, complex, elegant, expansive",
    negativePrompt: <>TECH-AI is an AI-powered content production suite that empowers creators with a powerful, customisable, and user-friendly platform for bringing their ideas to life.<br />
      With a focus on granular control at every step of content creation, we put creators at the centre of the creative process by offering granular control at every stage of generation, ensuring that AI enhances, rather than replaces, human creative potential.<br />
      Our custom back-end delivers advancements in model fine tuning, prompt adherence, training and inference speed, and multi-image prompting functionality. We also address common issues around image degradation and have implemented a custom upscaling, with much more on the way!</>,
    createDate: "April 05, 2023",
    resolution: "768x1024px",
    sampler: "Tech-AI-Frenify",
    highContrast: "Off",
    magicPrompt: "On",
    relatedPic: [4, 5, 6, 7]
  },
  {
    img: "img/gallery/2.jpg",
    authorPic: "img/gallery/1.jpg",
    authorName: "LuckyLee",
    count: 65,
    desc: "Terra Fusion: A daring fusion of tectonic forms with neo-abstract swirls, reflecting the chaos and ",
    tags: ["trending", ""],
    subTitle: "model",
    title: "ArtShaper v3",
    promptDetails: "Realistic painting, photorealistic masterpiece detailing, professional photography, natural lighting, volumetric lighting maximalist photoillustration: 8k resolution concept art intricately detailed, complex, elegant, expansive",
    negativePrompt: <>TECH-AI is an AI-powered content production suite that empowers creators with a powerful, customisable, and user-friendly platform for bringing their ideas to life.<br />
      With a focus on granular control at every step of content creation, we put creators at the centre of the creative process by offering granular control at every stage of generation, ensuring that AI enhances, rather than replaces, human creative potential.<br />
      Our custom back-end delivers advancements in model fine tuning, prompt adherence, training and inference speed, and multi-image prompting functionality. We also address common issues around image degradation and have implemented a custom upscaling, with much more on the way!</>,
    createDate: "April 05, 2023",
    resolution: "768x1024px",
    sampler: "Tech-AI-Frenify",
    highContrast: "Off",
    magicPrompt: "On",
    relatedPic: [8, 9, 1, 3]
  },
  {
    img: "img/gallery/3.jpg",
    authorPic: "img/gallery/1.jpg",
    authorName: "LuckyLee",
    count: 96,
    desc: "Terra Fusion: A daring fusion of tectonic forms with neo-abstract swirls, reflecting the chaos and ",
    tags: ["trending", "new"],
    subTitle: "model",
    title: "ArtShaper v3",
    promptDetails: "Realistic painting, photorealistic masterpiece detailing, professional photography, natural lighting, volumetric lighting maximalist photoillustration: 8k resolution concept art intricately detailed, complex, elegant, expansive",
    negativePrompt: <>TECH-AI is an AI-powered content production suite that empowers creators with a powerful, customisable, and user-friendly platform for bringing their ideas to life.<br />
      With a focus on granular control at every step of content creation, we put creators at the centre of the creative process by offering granular control at every stage of generation, ensuring that AI enhances, rather than replaces, human creative potential.<br />
      Our custom back-end delivers advancements in model fine tuning, prompt adherence, training and inference speed, and multi-image prompting functionality. We also address common issues around image degradation and have implemented a custom upscaling, with much more on the way!</>,
    createDate: "April 05, 2023",
    resolution: "768x1024px",
    sampler: "Tech-AI-Frenify",
    highContrast: "Off",
    magicPrompt: "On",
    relatedPic: [1, 2, 4, 5]
  },
  {
    img: "img/gallery/4.jpg",
    authorPic: "img/gallery/1.jpg",
    authorName: "LuckyLee",
    count: 58,
    desc: "Terra Fusion: A daring fusion of tectonic forms with neo-abstract swirls, reflecting the chaos and ",
    tags: ["trending", ""],
    subTitle: "model",
    title: "ArtShaper v3",
    promptDetails: "Realistic painting, photorealistic masterpiece detailing, professional photography, natural lighting, volumetric lighting maximalist photoillustration: 8k resolution concept art intricately detailed, complex, elegant, expansive",
    negativePrompt: <>TECH-AI is an AI-powered content production suite that empowers creators with a powerful, customisable, and user-friendly platform for bringing their ideas to life.<br />
      With a focus on granular control at every step of content creation, we put creators at the centre of the creative process by offering granular control at every stage of generation, ensuring that AI enhances, rather than replaces, human creative potential.<br />
      Our custom back-end delivers advancements in model fine tuning, prompt adherence, training and inference speed, and multi-image prompting functionality. We also address common issues around image degradation and have implemented a custom upscaling, with much more on the way!</>,
    createDate: "April 05, 2023",
    resolution: "768x1024px",
    sampler: "Tech-AI-Frenify",
    highContrast: "Off",
    magicPrompt: "On",
    relatedPic: [7, 8, 2, 3]
  },
  {
    img: "img/gallery/5.jpg",
    authorPic: "img/gallery/1.jpg",
    authorName: "LuckyLee",
    count: 645,
    desc: "Terra Fusion: A daring fusion of tectonic forms with neo-abstract swirls, reflecting the chaos and ",
    tags: ["trending", "new"],
    subTitle: "model",
    title: "ArtShaper v3",
    promptDetails: "Realistic painting, photorealistic masterpiece detailing, professional photography, natural lighting, volumetric lighting maximalist photoillustration: 8k resolution concept art intricately detailed, complex, elegant, expansive",
    negativePrompt: <>TECH-AI is an AI-powered content production suite that empowers creators with a powerful, customisable, and user-friendly platform for bringing their ideas to life.<br />
      With a focus on granular control at every step of content creation, we put creators at the centre of the creative process by offering granular control at every stage of generation, ensuring that AI enhances, rather than replaces, human creative potential.<br />
      Our custom back-end delivers advancements in model fine tuning, prompt adherence, training and inference speed, and multi-image prompting functionality. We also address common issues around image degradation and have implemented a custom upscaling, with much more on the way!</>,
    createDate: "April 05, 2023",
    resolution: "768x1024px",
    sampler: "Tech-AI-Frenify",
    highContrast: "Off",
    magicPrompt: "On",
    relatedPic: [1, 2, 3, 4]
  },
  {
    img: "img/gallery/6.jpg",
    authorPic: "img/gallery/1.jpg",
    authorName: "LuckyLee",
    count: 700,
    desc: "Terra Fusion: A daring fusion of tectonic forms with neo-abstract swirls, reflecting the chaos and ",
    tags: ["trending", "new"],
    subTitle: "model",
    title: "ArtShaper v3",
    promptDetails: "Realistic painting, photorealistic masterpiece detailing, professional photography, natural lighting, volumetric lighting maximalist photoillustration: 8k resolution concept art intricately detailed, complex, elegant, expansive",
    negativePrompt: <>TECH-AI is an AI-powered content production suite that empowers creators with a powerful, customisable, and user-friendly platform for bringing their ideas to life.<br />
      With a focus on granular control at every step of content creation, we put creators at the centre of the creative process by offering granular control at every stage of generation, ensuring that AI enhances, rather than replaces, human creative potential.<br />
      Our custom back-end delivers advancements in model fine tuning, prompt adherence, training and inference speed, and multi-image prompting functionality. We also address common issues around image degradation and have implemented a custom upscaling, with much more on the way!</>,
    createDate: "April 05, 2023",
    resolution: "768x1024px",
    sampler: "Tech-AI-Frenify",
    highContrast: "Off",
    magicPrompt: "On",
    relatedPic: [1, 2, 7, 8]
  },
  {
    img: "img/gallery/7.jpg",
    authorPic: "img/gallery/1.jpg",
    authorName: "LuckyLee",
    count: 129,
    desc: "Terra Fusion: A daring fusion of tectonic forms with neo-abstract swirls, reflecting the chaos and ",
    tags: ["trending", "new"],
    subTitle: "model",
    title: "ArtShaper v3",
    promptDetails: "Realistic painting, photorealistic masterpiece detailing, professional photography, natural lighting, volumetric lighting maximalist photoillustration: 8k resolution concept art intricately detailed, complex, elegant, expansive",
    negativePrompt: <>TECH-AI is an AI-powered content production suite that empowers creators with a powerful, customisable, and user-friendly platform for bringing their ideas to life.<br />
      With a focus on granular control at every step of content creation, we put creators at the centre of the creative process by offering granular control at every stage of generation, ensuring that AI enhances, rather than replaces, human creative potential.<br />
      Our custom back-end delivers advancements in model fine tuning, prompt adherence, training and inference speed, and multi-image prompting functionality. We also address common issues around image degradation and have implemented a custom upscaling, with much more on the way!</>,
    createDate: "April 05, 2023",
    resolution: "768x1024px",
    sampler: "Tech-AI-Frenify",
    highContrast: "Off",
    magicPrompt: "On",
    relatedPic: [4, 5, 2, 3]
  },
  {
    img: "img/gallery/8.jpg",
    authorPic: "img/gallery/1.jpg",
    authorName: "LuckyLee",
    count: 76,
    desc: "Terra Fusion: A daring fusion of tectonic forms with neo-abstract swirls, reflecting the chaos and ",
    tags: ["", "new"],
    subTitle: "model",
    title: "ArtShaper v3",
    promptDetails: "Realistic painting, photorealistic masterpiece detailing, professional photography, natural lighting, volumetric lighting maximalist photoillustration: 8k resolution concept art intricately detailed, complex, elegant, expansive",
    negativePrompt: <>TECH-AI is an AI-powered content production suite that empowers creators with a powerful, customisable, and user-friendly platform for bringing their ideas to life.<br />
      With a focus on granular control at every step of content creation, we put creators at the centre of the creative process by offering granular control at every stage of generation, ensuring that AI enhances, rather than replaces, human creative potential.<br />
      Our custom back-end delivers advancements in model fine tuning, prompt adherence, training and inference speed, and multi-image prompting functionality. We also address common issues around image degradation and have implemented a custom upscaling, with much more on the way!</>,
    createDate: "April 05, 2023",
    resolution: "768x1024px",
    sampler: "Tech-AI-Frenify",
    highContrast: "Off",
    magicPrompt: "On",
    relatedPic: [1, 3, 5, 7]
  }
]

export default function CommunityFeed() {
  const [Lightbox, setLightbox] = useState(false)
  const [Value, setValue] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const handleIsOpen = () => {
    setIsOpen(!isOpen)
  }

  const activeValue = (index) => {
    setLightbox(!Lightbox)
    setValue(feeds[index])
  }


  const isotope = useRef()
  // store the filter keyword in a state
  const [filterKey, setFilterKey] = useState('')
  useEffect(() => {
    setTimeout(() => {
      isotope.current = new Isotope(".fn__gallery_items", {
        itemSelector: ".fn__gallery_item",
        // layoutMode: "fitRows",
        percentPosition: true,
        masonry: {
          columnWidth: ".fn__gallery_item",
        },
        animationOptions: {
          duration: 750,
          easing: "linear",
          queue: false,
        },
      })
    }, 1000)
  }, [])

  useEffect(() => {
    if (isotope.current) {
      filterKey === ''
        ? isotope.current.arrange({ filter: '' })
        : isotope.current.arrange({ filter: `.${filterKey}` })
    }
  }, [filterKey])

  const handleFilterKeyChange = key => () => setFilterKey(key)
  return (
    <>
      <div className="techwave_fn_community_page">
        <div className="fn__title_holder">
          <div className="container">
            <h1 className="title">Community Feed</h1>
          </div>
        </div>
        {/* Feed */}
        <div className="techwave_fn_feed">
          <div className="container">
            {/* feed filter */}
            <div className="feed__filter">
              <div className="filter__left">
                <div className="filter__search">
                  <input type="text" placeholder="Search gallery" />
                  <Link href="#" className="techwave_fn_button"><span>Search</span></Link>
                </div>
                <div className="filter__upscaled">
                  <label className="fn__checkbox">
                    <input type="checkbox" />Upscaled
                    <span className="checkmark" />
                    <img src="svg/check.svg" alt="" className="fn__svg" />
                  </label>
                </div>
              </div>
              <div className="filter__sorting">
                <a className={`filter__trending ${filterKey == "" ? "enabled" : "disabled"} techwave_fn_button has__icon small__border`} onClick={handleFilterKeyChange('')}  >
                  <span>All</span>
                </a>
                <a className={`filter__trending ${filterKey == "trending" ? "enabled" : "disabled"} techwave_fn_button has__icon small__border`} onClick={handleFilterKeyChange('trending')}  >
                  <img src="svg/thunder.svg" alt="" className="fn__svg" />
                  <span>Trending</span>
                </a>
                <a className={`filter__new ${filterKey == "new" ? "enabled" : "disabled"} techwave_fn_button has__icon small__border`} onClick={handleFilterKeyChange("new")}>
                  <img src="svg/new.svg" alt="" className="fn__svg" />
                  <span>New</span>
                </a>
              </div>
            </div>
            {/* !feed filter */}
            {/* feed content */}
            <div className="feed__content">
              <div className="feed__results">
                <div className="fn__preloader">
                  <div className="icon" />
                  <div className="text">Loading</div>
                </div>
                <ul className="fn__gallery_items">
                  {/* #1 gallery item */}
                  {feeds.map((feed, i) => (
                    <li className={`fn__gallery_item ${feed.tags.join(' ')}`} key={i}>
                      <div className="item" data-id={345}>
                        <div className="img" onClick={() => activeValue(i)}>
                          <img src={feed.img} alt="" />
                        </div>
                        <div className="item__info">
                          <div className="info__header">
                            <div className="user__info">
                              <img src={feed.authorPic} alt="" />
                              <h3 className="author_name">{feed.authorName}</h3>
                            </div>
                            <LikeCounter initialCount={feed.count} />
                          </div>
                          <p className="desc">{feed.desc}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="feed__more">
                <Link href="#" className="medium techwave_fn_button"><span>Load More</span></Link>
              </div>
            </div>
            {/* !feed content */}
          </div>
        </div>
        {/* !Feed */}
      </div>

      {Lightbox && Value && (
        <div className={`techwave_fn_img_lightbox ${Lightbox ? "opened" : ""}`}>
          {/* top section (of the image lightbox) */}
          <div className="lightbox__top">
            <div className="lightbox__tl">
              <div className="lightbox__tlbar">
                <div className="lightbox__tlbar_left">
                  <div className="item item__share fn__icon_options medium_size">
                    <Link href="#" className="item__btn fn__icon_button">
                      <img src="svg/share.svg" alt="" className="fn__svg" />
                    </Link>
                    <div className="fn__icon_popup">
                      <ul>
                        <li><Link href="#">Facebook</Link></li>
                        <li><Link href="#">Twitter</Link></li>
                        <li><Link href="#">Instagram</Link></li>
                        <li><Link href="#">Linkedin</Link></li>
                        <li><Link href="#">Pinterest</Link></li>
                        <li><Link href="#" className="fn__copy" data-copied="Copied!">Copy Link</Link></li>
                      </ul>
                    </div>
                  </div>
                  <div className="item item__download fn__icon_options medium_size">
                    <Link href="#" className="item__btn fn__icon_button">
                      <img src="svg/download.svg" alt="" className="fn__svg" />
                    </Link>
                    <div className="fn__icon_popup">
                      <ul>
                        <li><Link href="#">Original Image</Link></li>
                        <li><Link href="#">Creative Upscaled Image</Link></li>
                        <li><Link href="#">HD Upscaled Image</Link></li>
                      </ul>
                    </div>
                  </div>
                  <div className="item item__more fn__icon_options medium_size">
                    <Link href="#" className="item__btn fn__icon_button">
                      <span className="dots" />
                    </Link>
                    <div className="fn__icon_popup">
                      <ul>
                        <li><Link href="#">Remove Background</Link></li>
                        <li><Link href="#">Creative Upscale</Link></li>
                        <li><Link href="#">Alternative Upscale</Link></li>
                        <li className="high_priorety"><Link href="#" className="fn__report">Report Image</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="lightbox__tlbar_center">
                  <Link href="#" className="img_nav nav_prev">
                    <img src="svg/arrow.svg" alt="" className="fn__svg" />
                  </Link>
                  <Link href="#" className="img_nav nav_next">
                    <img src="svg/arrow.svg" alt="" className="fn__svg" />
                  </Link>
                </div>
                <div className="lightbox__tlbar_right">
                  {Value.count && <LikeCounter initialCount={Value.count} />}
                </div>
              </div>
              <div className="lightbox__tlimg">
                <img src={Value.img} alt="" />
              </div>
            </div>
            <div className="lightbox__tr">
              <div className="user__profile">
                <Link className="profile_link" href="user-profile">
                  <img src={Value.authorPic} alt="" />
                  <h2 className="user_name">{Value.authorName}</h2>
                </Link>
                <Link className="fn__follow" href="#" data-follow-text="Follow" data-unfollow-text="Unfollow">
                  <span className="text">Follow</span>
                </Link>
                <a className="fn__closer fn__icon_button" onClick={() => setLightbox(false)}>
                  <img src="svg/close.svg" alt="" className="fn__svg" />
                </a>
              </div>
              <div className="item__details">
                <div className="fn__model">
                  <div className="model_img">
                    <img src="img/user/user.jpg" alt="" />
                  </div>
                  <div className="model_info">
                    <h4 className="model_subtitle">{Value.subTitle}</h4>
                    <h3 className="model_title">{Value.title}</h3>
                  </div>
                  <Link href="image-generation" className="fn__icon_button">
                    <img src="svg/arrow.svg" alt="" className="fn__svg" />
                  </Link>
                </div>
                <div className="fn__prompt_details">
                  <div className="prompt__header">
                    <div className="prompt__text">Prompt Details</div>
                    <div className="prompt__options">
                      <Link href="#" className="fn__icon_button">
                        <span className="dots" />
                      </Link>
                      <div className="prompt__popup">
                        <ul>
                          <li><Link href="#">Remix</Link></li>
                          <li><Link href="#">Image to Image</Link></li>
                          <li><Link href="#" className="fn__copy" data-copied="Copied!" data-text="Realistic painting, photorealistic masterpiece detailing, professional photography, natural lighting, volumetric lighting maximalist photoillustration: 8k resolution concept art intricately detailed, complex, elegant, expansive">Copy Prompt</Link></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="prompt__content">
                    <p>{Value.promptDetails}</p>
                  </div>
                </div>
                <div className="techwave_fn_accordion small" data-type="accordion"> {/* data-type values: accordion, toggle */}
                  <div className={`acc__item ${isOpen ? "opened" : ""}`} onClick={handleIsOpen}>
                    <div className="acc__header">
                      <h2 className="acc__title">Negative Prompt</h2>
                      <div className="acc__icon" />
                    </div>
                    <div className="acc__content" style={{ display: `${isOpen ? "block" : "none"}` }}>
                      {Value.negativePrompt}
                    </div>
                  </div>
                </div>
              </div>
              <div className="fn__details_list">
                <ul>
                  <li>
                    <div className="sub_title">Created</div>
                    <div className="title">{Value.createDate}</div>
                  </li>
                  <li>
                    <div className="sub_title">Resolution</div>
                    <div className="title">{Value.resolution}</div>
                  </li>
                  <li>
                    <div className="sub_title">Sampler</div>
                    <div className="title">{Value.sampler}</div>
                  </li>
                  <li>
                    <div className="sub_title">Step Count</div>
                    <div className="title">{Value.count}</div>
                  </li>
                  <li>
                    <div className="sub_title">Base Model</div>
                    <div className="title">{Value.count}</div>
                  </li>
                  <li>
                    <div className="sub_title">High Contrast</div>
                    <div className="title">{Value.highContrast}</div>
                  </li>
                  <li>
                    <div className="sub_title">Magic Prompt</div>
                    <div className="title">{Value.magicPrompt}</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* !top section (of the image lightbox) */}
          {/* related section (of the image lightbox) */}
          <div className="lightbox__related">
            <div className="fn__title_holder">
              <h2 className="title">Related Images</h2>
            </div>
            <div className="fn__grid_items">
              <ul>
                {Value.relatedPic && Value.relatedPic.map((RP, i) => (
                  <li key={i}>
                    <Link href="#"><img src={`img/related/${RP}.jpg`} alt="" /></Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* !related section (of the image lightbox) */}
        </div>
      )}

    </>
  )
}