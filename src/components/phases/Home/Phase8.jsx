"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function Phase8() {
    const cards = [
        { name: "Project 1", img: "/images/cards/1.png" },
        { name: "Project 2", img: "/images/cards/2.png" },
        { name: "Project 3", img: "/images/cards/3.png" },
        { name: "Project 4", img: "/images/cards/4.png" },
    ]

    const sectionRef = useRef(null)
    const cardRefs = useRef([])

    useEffect(() => {
        const ctx = gsap.context(() => {
            cardRefs.current.forEach((card) => {
                gsap.fromTo(
                    card,
                    { y: 120, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 1.2,
                        ease: "power3.out",
                        force3D: true,
                        scrollTrigger: {
                            trigger: card,
                            start: "top 85%",
                            toggleActions: "play none none reverse",
                        },
                    }
                )
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section ref={sectionRef} className="relative overflow-x-hidden">
            <svg className="absolute w-0 h-0">
                <filter
                    id="displacementFilter"
                    x="-15%"
                    y="-15%"
                    width="130%"
                    height="130%"
                    color-interpolation-filters="sRGB"
                >
                    <feTurbulence type="turbulence" baseFrequency="0.01" numOctaves="1" result="turbulence" />
                    <feGaussianBlur in="turbulence" stdDeviation="2" result="smoothTurbulence" />
                    <feDisplacementMap in="SourceGraphic" in2="smoothTurbulence" scale="140" xChannelSelector="R" yChannelSelector="G" />
                </filter>
            </svg>
            <style>{`
                .liquid-glass-shadow {
                    box-shadow: -8px -10px 46px rgba(0, 0, 0, 0.37);
                }
                .liquid-glass-card {
                    position: relative;
                    height: 100%;
                    overflow: hidden;
                    contain: paint;
                    will-change: backdrop-filter;
                    transform: translateZ(0);
                    backdrop-filter: brightness(1.1) blur(20px);
                    -webkit-backdrop-filter: brightness(1.1) blur(20px);
                }
                .liquid-glass-card::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    z-index: 0;
                    box-shadow:
                        inset 6px 6px 0px -6px rgba(255, 255, 255, 0.7),
                        inset 0 0 8px 1px rgba(255, 255, 255, 0.7);
                    pointer-events: none;
                }
                @supports (backdrop-filter: url(#a)) {
                    .liquid-glass-card {
                        backdrop-filter: brightness(1.1) blur(2px) url(#displacementFilter);
                    }
                }
            `}</style>
            <img
                className="absolute inset-0 w-full h-full object-cover z-0"
                src="/images/astro/rock-long.png"
                alt=""
            />
            <div className="flex flex-col relative z-10 px-[111px]">
                {cards.map((card, index) => {
                    const isEven = index % 2 === 0
                    return (
                        <div key={index} className={`flex ${isEven ? "justify-start" : "justify-end"} mt-20`}>
                            <div
                                ref={(el) => (cardRefs.current[index] = el)}
                                className="liquid-glass-shadow w-fit"
                            >
                                <div className="liquid-glass-card">
                                    <div className="flex flex-col gap-[30px] relative z-10 p-[35px]">
                                        <img className=" w-[751px] h-[655px]" src={card.img} alt={card.name} />
                                        <div className="flex justify-between items-start">
                                            <h2 className="text-[40px] font-medium uppercase leading-none font-inter-tight text-white">{card.name}</h2>
                                            <img className="w-[24px] h-[24px]" src="/svgs/pixel-arrow.svg" alt="" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}