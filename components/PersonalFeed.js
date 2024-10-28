'use client'
import Isotope from 'isotope-layout'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'


const feeds = [
    {
        id: 1,
        img: "img/gallery/1.jpg",
        category: "one",
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
        relatedPic: [4, 5, 6, 7],
        like: true
    },
    {
        id: 2,
        img: "img/gallery/2.jpg",
        category: "one",
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
        relatedPic: [8, 9, 1, 3],
        like: true
    },
    {
        id: 3,
        img: "img/gallery/3.jpg",
        category: "one",
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
        relatedPic: [1, 2, 4, 5],
        like: true
    },
    {
        id: 4,
        img: "img/gallery/4.jpg",
        category: "one",
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
        relatedPic: [7, 8, 2, 3],
        like: true
    },
    {
        id: 5,
        img: "img/gallery/5.jpg",
        category: "one",
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
        relatedPic: [1, 2, 3, 4],
        like: true
    },
    {
        id: 6,
        img: "img/gallery/6.jpg",
        category: "one",
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
        relatedPic: [1, 2, 7, 8],
        like: true
    },
    {
        id: 7,
        img: "img/gallery/7.jpg",
        category: "one",
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
        relatedPic: [4, 5, 2, 3],
        like: true
    },
    {
        id: 8,
        img: "img/gallery/8.jpg",
        category: "one",
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
        relatedPic: [1, 3, 5, 7],
        like: true
    },
    {
        id: 9,
        img: "img/gallery/1.jpg",
        category: "one",
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
        relatedPic: [4, 5, 6, 7],
        like: true
    },
    {
        id: 10,
        img: "img/gallery/2.jpg",
        category: "two",
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
        relatedPic: [8, 9, 1, 3],
        like: true
    },
    {
        id: 11,
        img: "img/gallery/3.jpg",
        category: "two",
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
        relatedPic: [1, 2, 4, 5],
        like: true
    },
    {
        id: 12,
        img: "img/gallery/4.jpg",
        category: "two",
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
        relatedPic: [7, 8, 2, 3],
        like: true
    },
    {
        id: 13,
        img: "img/gallery/5.jpg",
        category: "two",
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
        relatedPic: [1, 2, 3, 4],
        like: true
    },
    {
        id: 14,
        img: "img/gallery/6.jpg",
        category: "two",
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
        relatedPic: [1, 2, 7, 8],
        like: true
    },
    {
        id: 15,
        img: "img/gallery/7.jpg",
        category: "two",
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
        relatedPic: [4, 5, 2, 3],
        like: true
    },
    {
        id: 16,
        img: "img/gallery/8.jpg",
        category: "two",
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
        relatedPic: [1, 3, 5, 7],
        like: true
    },
    {
        id: 17,
        img: "img/gallery/1.jpg",
        category: "two",
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
        relatedPic: [4, 5, 6, 7],
        like: true
    },
    {
        id: 18,
        img: "img/gallery/2.jpg",
        category: "two",
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
        relatedPic: [8, 9, 1, 3],
        like: true
    },
    {
        id: 19,
        img: "img/gallery/3.jpg",
        category: "two",
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
        relatedPic: [1, 2, 4, 5],
        like: true
    },
    {
        id: 20,
        img: "img/gallery/4.jpg",
        category: "two",
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
        relatedPic: [7, 8, 2, 3],
        like: true
    },
    {
        id: 21,
        img: "img/gallery/5.jpg",
        category: "three",
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
        relatedPic: [1, 2, 3, 4],
        like: true
    },
    {
        id: 22,
        img: "img/gallery/6.jpg",
        category: "three",
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
        relatedPic: [1, 2, 7, 8],
        like: true
    },
    {
        id: 23,
        img: "img/gallery/7.jpg",
        category: "three",
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
        relatedPic: [4, 5, 2, 3],
        like: true
    },
    {
        id: 24,
        img: "img/gallery/8.jpg",
        category: "three",
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
        relatedPic: [1, 3, 5, 7],
        like: true
    }
]


export default function PersonalFeed() {



    // const [activeIndex, setActiveIndex] = useState(1);
    const [filterKey, setFilterKey] = useState('one')
    // const [filteredProductsByCategory, setFilteredProductsByCategory] = useState(feeds);
    // Select items to delete
    // const [selectedItems, setSelectedItems] = useState([]);
    // for Load More
    // const [visibleItems, setVisibleItems] = useState(4);
    // for Ready for select items
    // const [isSelect, setIsSelect] = useState(false);
    // for lightbox
    // const [Lightbox, setLightbox] = useState(false)
    // const [Value, setValue] = useState(false)
    // for accordion inside the lightbox
    // const [isOpen, setIsOpen] = useState(false)




    // const handleSelect = () => {
    //     setIsSelect(!isSelect);
    // };

    // const toggleItemSelection = (itemId) => {
    //     if (selectedItems.includes(itemId)) {
    //         setSelectedItems(selectedItems.filter((id) => id !== itemId));
    //     } else {
    //         setSelectedItems([...selectedItems, itemId]);
    //     }
    // };

    // const handleDelete = () => {
    //     const updatedItems = filteredProductsByCategory.filter((item) => !selectedItems.includes(item.id));
    //     setFilteredProductsByCategory(updatedItems);
    //     setSelectedItems([]); // Reset selected items after deletion
    // };


    // for load more
    // const handleLoadMore = () => {
    //     // setVisibleItems(visibleItems + 4);
    // };

    const isotope = useRef()
    // store the filter keyword in a state
    useEffect(() => {
        setTimeout(() => {
            isotope.current = new Isotope(".fn__gallery_items", {
                filter: '.one',
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
    // console.log(isotope.current);
    useEffect(() => {
        if (isotope.current) {
            filterKey === 'one'
                ? isotope.current.arrange({ filter: '.one' })
                : isotope.current.arrange({ filter: `.${filterKey}` })
        }
    }, [filterKey])
    const handleFilterKeyChange = key => () => setFilterKey(key)

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
                                {console.log(filterKey)}
                                <a className={filterKey === "one" ? "active" : ""} onClick={handleFilterKeyChange("one")}>Your Generations</a>
                                <a className={filterKey === "two" ? "active" : ""} onClick={handleFilterKeyChange("two")}>Followers</a>
                                <a className={filterKey === "three" ? "active" : ""} onClick={handleFilterKeyChange("three")}>Liked</a>
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
                                        <input type="checkbox" />Select Items
                                        <span className="checkmark" />
                                        <img src="svg/check.svg" alt="" className="fn__svg" />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* !feed filter */}
                    {/* feed selection */}
                    <div className="fn__selection_box" >
                        <div className="container">
                            <div className="selection_in">
                                <p className="desc">
                                    <span className="count"></span> item(s) selected
                                </p>
                                <div className="actions">
                                    <Link href="#" className="filter__delete techwave_fn_button has__icon small__border">
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
                                <ul className="fn__gallery_items" >
                                    {/* #1 gallery item */}
                                    {/* {filteredProductsByCategory.slice(0, visibleItems).map((feed, i) => ( */}
                                    {feeds.map((feed, i) => (
                                        <li className={`fn__gallery_item ${feed.category}`} key={i}>
                                            <div className={`item `} data-id={345}>
                                                <div className="img">
                                                    <img src={feed.img} alt="" />
                                                </div>
                                                <div className={`fn__selectable_item`}>
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
                                                        {/* <LikeCounter initialCount={feed.count} /> */}
                                                    </div>
                                                    <p className="desc">{feed.desc}</p>
                                                </div>
                                            </div>
                                        </li>
                                    ))
                                    }

                                    {/* ))} */}
                                    {/* !#1 gallery item */}
                                </ul>
                            </div>
                            <div className="feed__more">
                                {/* <Link href="#" onClick={handleLoadMore} className="medium techwave_fn_button"><span>Load More</span></Link> */}
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