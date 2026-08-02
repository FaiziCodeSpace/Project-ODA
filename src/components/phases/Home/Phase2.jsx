// src/components/phases/Home/Phase2.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import InfiniteImageColumns from "@/components/animations/InfiniteImageColumns";
import {
    PEAK_Y,
    CORNER_DEPTH_BY_BREAKPOINT,
    getBreakpoint,
    curvePath,
    flattenPeakToCorner,
} from "@/lib/phase3Curve";

gsap.registerPlugin(ScrollTrigger);

const PEEK_REVEAL_PERCENT = 16;

export default function Phase2() {
    const slideContent = [
        { image: "/logo/O.svg" },
        { text: "Take Your" },
        { text: "Brand in" },
        { text: "Orbit" },
    ];

    const sectionRef = useRef(null);
    const contentRef = useRef(null);
    const trackRef = useRef(null);
    const slideRefs = useRef([]);
    const bgRef = useRef(null);
    const peekRef = useRef(null);
    const curvePathRef = useRef(null);
    const cornerDepthRef = useRef(CORNER_DEPTH_BY_BREAKPOINT.desktop);

    const [breakpoint, setBreakpoint] = useState(() =>
        typeof window !== "undefined" ? getBreakpoint(window.innerWidth) : "desktop"
    );

    useEffect(() => {
        const handleResize = () => {
            const next = getBreakpoint(window.innerWidth);
            setBreakpoint((prev) => (prev === next ? prev : next));
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        cornerDepthRef.current = CORNER_DEPTH_BY_BREAKPOINT[breakpoint];
    }, [breakpoint]);

    useEffect(() => {
        const section = sectionRef.current;
        const content = contentRef.current;
        const track = trackRef.current;
        const slides = slideRefs.current;
        if (!section || !content || !track || slides.length === 0) return;

        gsap.set(content, {
            borderWidth: "6px",
            borderStyle: "solid",
            borderColor: "#000000",
        });

        gsap.set(peekRef.current, { yPercent: 100 });

        const ctx = gsap.context(() => {
            const last = slides.length - 1;

            const stepDistance = window.innerHeight * 0.8;
            const scaleDistance = window.innerHeight * 0.8;
            const gapRevealDistance = window.innerHeight * 0.6;

            const slidesDistance = stepDistance * last;
            const totalDistance = slidesDistance + scaleDistance + gapRevealDistance;

            const slidesFraction = slidesDistance / totalDistance;
            const stepSize = slidesFraction / last;

            const scaleEndFraction = slidesFraction + scaleDistance / totalDistance;

            const tl = gsap.timeline();
            for (let i = 1; i <= last; i++) {
                tl.to(track, { y: -slides[i].offsetTop, ease: "none" });
            }
            tl.to(content, {
                scale: 0.7,
                borderColor: "rgba(255, 255, 255, 0.05)",
                ease: "none",
            });
            if (bgRef.current?.el) {
                tl.to(bgRef.current.el, {
                    "--column-gap": "24px",
                    "--row-gap": "24px",
                    ease: "none",
                    onComplete: () => bgRef.current?.startLoop(),
                    onReverseComplete: () => bgRef.current?.stopLoop(),
                });
            }

            const snapPoints = [
                ...Array.from({ length: last }, (_, i) => i * stepSize),
                1,
            ];

            ScrollTrigger.create({
                trigger: section,
                start: "top top",
                end: `+=${totalDistance}`,
                pin: true,
                scrub: 1,
                anticipatePin: 1,
                snap: {
                    snapTo: (progress) =>
                        snapPoints.reduce((closest, p) =>
                            Math.abs(p - progress) < Math.abs(closest - progress) ? p : closest
                        ),
                    duration: { min: 0.2, max: 0.5 },
                    ease: "power2.inOut",
                },
                animation: tl,
                onUpdate: (self) => {
                    const span = 1 - scaleEndFraction;
                    const revealProgress = span > 0
                        ? gsap.utils.clamp(0, 1, (self.progress - scaleEndFraction) / span)
                        : 0;

                    gsap.set(peekRef.current, {
                        yPercent: 100 - revealProgress * PEEK_REVEAL_PERCENT,
                    });

                    if (curvePathRef.current) {
                        curvePathRef.current.setAttribute(
                            "d",
                            flattenPeakToCorner(cornerDepthRef.current, revealProgress)
                        );
                    }
                },
            });
        }, section);

        return () => ctx.revert();
    }, []);

    const cornerDepth = CORNER_DEPTH_BY_BREAKPOINT[breakpoint];

    return (
        <section ref={sectionRef} className="bg-black w-full min-h-screen relative overflow-hidden">
            <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
                <div className="scale-125 origin-center">
                    <InfiniteImageColumns ref={bgRef} />
                </div>
            </div>

            <div id="phase2-content" ref={contentRef} className="bg-black relative z-10 w-full min-h-screen">
                <div className="relative flex items-center justify-between px-20 pt-12 text-neutral-500 text-[11px]">
                    <div>
                        <p>
                            Looking for your next
                            <br />
                            cool Website?
                        </p>
                    </div>

                    <div className="absolute left-1/2 -translate-x-1/2">
                        Orbition Creative
                    </div>

                    <div>We Are here to help {":)"}</div>
                </div>

                <div className="w-[547px] h-[142px] absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 overflow-hidden">
                    <div ref={trackRef} className="flex flex-col gap-2">
                        {slideContent.map((slide, i) => (
                            <div
                                key={i}
                                ref={(el) => (slideRefs.current[i] = el)}
                                className="h-[142px] flex items-center justify-center text-white text-center text-[120px] leading-none"
                            >
                                {slide.text || (
                                    <img
                                        className="w-[90px] object-contain"
                                        src={slide.image}
                                        alt={`Slide ${i + 1}`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 z-20 h-screen pointer-events-none" aria-hidden="true">
                <svg width="0" height="0" className="absolute">
                    <clipPath id="phase2-peek-curve" clipPathUnits="objectBoundingBox">
                        <path ref={curvePathRef} d={curvePath(cornerDepth, PEAK_Y)} />
                    </clipPath>
                </svg>
                <div
                    ref={peekRef}
                    className="w-full h-full"
                    style={{ backgroundColor: "#F3F3F3", clipPath: "url(#phase2-peek-curve)" }}
                />
            </div>
        </section>
    );
}