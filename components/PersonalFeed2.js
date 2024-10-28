'use client'
import React, { useState } from 'react'
import Link from 'next/link'

const feeds = [
  {
    id: 1,
    img: "img/gallery/1.jpg",
    category: 1,
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
    id: 2,
    img: "img/gallery/2.jpg",
    category: 2,
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
    id: 3,
    img: "img/gallery/3.jpg",
    category: 1,
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
    id: 4,
    img: "img/gallery/4.jpg",
    category: 3,
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
    id: 5,
    img: "img/gallery/5.jpg",
    category: 2,
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
    id: 6,
    img: "img/gallery/6.jpg",
    category: 2,
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
    id: 7,
    img: "img/gallery/7.jpg",
    category: 2,
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
    id: 8,
    img: "img/gallery/8.jpg",
    category: 1,
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
  },
  {
    id: 9,
    img: "img/gallery/1.jpg",
    category: 2,
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
    id: 10,
    img: "img/gallery/2.jpg",
    category: 1,
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
    id: 11,
    img: "img/gallery/3.jpg",
    category: 2,
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
    id: 12,
    img: "img/gallery/4.jpg",
    category: 2,
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
    id: 13,
    img: "img/gallery/5.jpg",
    category: 3,
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
    id: 14,
    img: "img/gallery/6.jpg",
    category: 3,
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
    id: 15,
    img: "img/gallery/7.jpg",
    category: 3,
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
    id: 16,
    img: "img/gallery/8.jpg",
    category: 3,
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
  },
  {
    id: 17,
    img: "img/gallery/1.jpg",
    category: 3,
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
    id: 18,
    img: "img/gallery/2.jpg",
    category: 3,
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
    id: 19,
    img: "img/gallery/3.jpg",
    category: 3,
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
    id: 20,
    img: "img/gallery/4.jpg",
    category: 3,
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
    id: 21,
    img: "img/gallery/5.jpg",
    category: 1,
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
    id: 22,
    img: "img/gallery/6.jpg",
    category: 1,
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
    id: 23,
    img: "img/gallery/7.jpg",
    category: 1,
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
    id: 24,
    img: "img/gallery/8.jpg",
    category: 1,
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

export default function PersonalFeed() {
  const [activeIndex, setActiveIndex] = useState(1)
  const [isSelect, setIsSelect] = useState(false)
  const [selectedItems, setSelectedItems] = useState([]);
  
  
  const handleOnClick = (index) => {
    setActiveIndex(index)
  }
  
  const handleSelect = () => {
    setIsSelect(!isSelect)
  }
  
  const filteredProductsByCategory = activeIndex
  ? feeds.filter(feed => feed.category === activeIndex)
  : null;
  
  const [portfolioItems, setPortfolioItems] = useState(filteredProductsByCategory);
  const toggleItemSelection = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const handleDelete = () => {
    const updatedItems = portfolioItems.filter((item) => !selectedItems.includes(item.id));
    setPortfolioItems(updatedItems);
    setSelectedItems([]); // Reset selected items after deletion
  };
  return (
    <>
      <div className="techwave_fn_community_page">
        <div className="fn__title_holder">
          <div className="container">
            <h1 className="title">Personal Feed</h1>
          </div>
        </div>
        {/* Feed */}
        <div className="techwave_fn_feed">
          <div className="fn__tabs">
            <div className="container">
              <div className="tab_in">
                <a className={activeIndex === 1 ? "active" : ""} onClick={() => handleOnClick(1)}>Your Generations</a>
                <a className={activeIndex === 2 ? "active" : ""} onClick={() => handleOnClick(2)}>Followers</a>
                <a className={activeIndex === 3 ? "active" : ""} onClick={() => handleOnClick(3)}>Liked</a>
              </div>
            </div>
          </div>
          {/* feed filter */}
          <div className="container">
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
              <div className="filter__right">
                <div className="filter__select">
                  <label className="fn__checkbox">
                    <input type="checkbox" onClick={handleSelect} />Select Items
                    <span className="checkmark" />
                    <img src="svg/check.svg" alt="" className="fn__svg" />
                  </label>
                </div>
              </div>
            </div>
          </div>
          {/* !feed filter */}
          {/* feed selection */}
          <div className="fn__selection_box" style={{ display: `${isSelect == 1 ? "block" : "none"}` }} >
            <div className="container">
              <div className="selection_in">
                <p className="desc"><span className="count">{selectedItems.length}</span> item(s) selected</p>
                <div className="actions">
                  <Link href="#" onClick={handleDelete} disabled={selectedItems.length === 0} className="filter__delete techwave_fn_button has__icon small__border">
                    <img src="svg/trash.svg" alt="" className="fn__svg" />
                    <span>Delete</span>
                  </Link>
                  <Link href="#" className="filter__download techwave_fn_button has__icon small__border">
                    <img src="svg/download.svg" alt="" className="fn__svg" />
                    <span>Download</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {/* !feed selection */}
          <div className="container">
            {/* feed content */}
            <div className="feed__content">
              <div className="feed__results">
                <div className="fn__preloader">
                  <div className="icon" />
                  <div className="text">Loading</div>
                </div>
                <ul className="fn__gallery_items">
                  {/* #1 gallery item */}
                  {filteredProductsByCategory.map((feed, i) => (
                    <li className="fn__gallery_item" onClick={() => toggleItemSelection(feed.id)} key={i}>
                      <div className={`item ${isSelect ? "select__ready" : ""}`} data-id={345}>
                        <div className="img">
                          <img src={feed.img} alt="" />
                        </div>
                        <div className={`fn__selectable_item ${selectedItems.includes(feed.id) ? "selected" : ""}`}>
                          <span className="icon">
                            <img src="svg/check.svg" alt="" className="fn__svg" />
                          </span>
                        </div>
                        <div className="item__info">
                          <div className="info__header">
                            <div className="user__info">
                              <img src="img/user/user.jpg" alt="" />
                              <h3 className="author_name">{feed.authorName}</h3>
                            </div>
                            <Link href="#" className="fn__like no_border" data-id={3}>
                              <span className="count">{feed.count}</span>
                              <img src="svg/like.svg" alt="" className="fn__svg empty__like" />
                              <img src="svg/like-full.svg" alt="" className="fn__svg full__like" />
                            </Link>
                          </div>
                          <p className="desc">{feed.desc}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                  {/* !#1 gallery item */}
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

    </>
  )
}