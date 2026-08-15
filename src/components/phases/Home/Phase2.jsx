"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import InfiniteImageColumns from "@/components/animations/InfiniteImageColumns";
import {
    PEAK_Y,
    getCornerDepth,
    curvePath,
    flattenPeakToCorner,
} from "@/lib/phase3Curve";

gsap.registerPlugin(ScrollTrigger);

const PEEK_REVEAL_PERCENT = 12;
const FLATTEN_TARGET_VIEWPORT_FRACTION = 0.02;
const SEAM_OVERLAP_PX = 2;

const REFERENCE_VIEWPORT = 1440;
const MIN_VIEWPORT = 375;
const MAX_VIEWPORT = 1920;

const fluid = (px, options = {}) => {
    const vw = (px / REFERENCE_VIEWPORT) * 100;
    const min = options.min ?? (vw / 100) * MIN_VIEWPORT;
    const max = options.max ?? (vw / 100) * MAX_VIEWPORT;
    return `clamp(${min.toFixed(2)}px, ${vw.toFixed(4)}vw, ${max.toFixed(2)}px)`;
};

const fluidValue = (px, viewport) => {
    const ratio = px / REFERENCE_VIEWPORT;
    return Math.min(
        ratio * MAX_VIEWPORT,
        Math.max(ratio * MIN_VIEWPORT, ratio * viewport)
    );
};

const CONTENT_WIDTH = fluid(547, { min: 320 });
const CONTENT_HEIGHT = fluid(142, { min: 88 });
const SLIDE_FONT_SIZE = fluid(120, { min: 64 });
const LOGO_WIDTH = fluid(90, { min: 56 });
const TRACK_GAP = fluid(8);
const HEADER_PADDING_X = fluid(80);
const HEADER_PADDING_TOP = fluid(48);
const HEADER_FONT_SIZE = fluid(11, { min: 11 });
const BORDER_WIDTH = fluid(6);

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
    const cornerDepthRef = useRef(getCornerDepth(1440));
    const flattenProgressRef = useRef(0);
    const columnsSlidingRef = useRef(false);

    const [viewportWidth, setViewportWidth] = useState(() =>
        typeof window !== "undefined" ? window.innerWidth : 1440
    );

    useEffect(() => {
        const handleResize = () => {
            setViewportWidth((prev) =>
                prev === window.innerWidth ? prev : window.innerWidth
            );
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        cornerDepthRef.current = getCornerDepth(viewportWidth);
    }, [viewportWidth]);

    useEffect(() => {
        const section = sectionRef.current;
        const content = contentRef.current;
        const track = trackRef.current;
        const slides = slideRefs.current;
        if (!section || !content || !track || slides.length === 0) return;

        content.style.borderWidth = BORDER_WIDTH;
        gsap.set(content, {
            borderStyle: "solid",
            borderColor: "#000000",
        });

        gsap.set(peekRef.current, { yPercent: 100 });

        const ctx = gsap.context(() => {
            const last = slides.length - 1;

            const stepDistance = window.innerHeight * 0.8;
            const scaleDistance = window.innerHeight * 0.8;
            const gapDistance = window.innerHeight * 0.5;
            const revealDistance = window.innerHeight * 0.6;

            const slidesDistance = stepDistance * last;
            const totalDistance =
                slidesDistance + scaleDistance + gapDistance + revealDistance;

            const slidesFraction = slidesDistance / totalDistance;
            const stepSize = slidesFraction / last;
            const scaleFraction = scaleDistance / totalDistance;
            const gapFraction = gapDistance / totalDistance;
            const revealFraction = revealDistance / totalDistance;

            const scaleEndFraction = slidesFraction + scaleFraction;
            const gapEndFraction = scaleEndFraction + gapFraction;

            const columnGapTarget = `${fluidValue(24, window.innerWidth).toFixed(2)}px`;

            const tl = gsap.timeline();
            for (let i = 1; i <= last; i++) {
                tl.to(track, {
                    y: -slides[i].offsetTop,
                    ease: "none",
                    duration: stepSize,
                });
            }
            tl.to(content, {
                scale: 0.7,
                borderColor: "rgba(255, 255, 255, 0.05)",
                ease: "none",
                duration: scaleFraction,
            });
            if (bgRef.current?.el) {
                tl.to(bgRef.current.el, {
                    "--column-gap": columnGapTarget,
                    "--row-gap": columnGapTarget,
                    ease: "none",
                    duration: gapFraction,
                    onComplete: () => {
                        bgRef.current?.startLoop(() => {
                            columnsSlidingRef.current = true;
                            ScrollTrigger.update();
                        });
                    },
                    onReverseComplete: () => {
                        bgRef.current?.stopLoop();
                        columnsSlidingRef.current = false;
                        ScrollTrigger.update();
                    },
                });
                tl.to({}, { duration: revealFraction });
            }

            ScrollTrigger.create({
                trigger: section,
                start: "top top",
                end: `+=${totalDistance}`,
                pin: true,
                scrub: 1,
                anticipatePin: 1,
                snap: {
                    snapTo: (progress) => {
                        if (progress >= slidesFraction) return progress;
                        const stepSnaps = Array.from({ length: last }, (_, i) => i * stepSize);
                        return stepSnaps.reduce((closest, p) =>
                            Math.abs(p - progress) < Math.abs(closest - progress) ? p : closest
                        );
                    },
                    duration: { min: 0.2, max: 0.5 },
                    ease: "power2.inOut",
                },
                animation: tl,
                onUpdate: (self) => {
                    const revealProgress = revealFraction > 0 && columnsSlidingRef.current
                        ? gsap.utils.clamp(0, 1, (self.progress - gapEndFraction) / revealFraction)
                        : 0;

                    gsap.set(peekRef.current, {
                        yPercent: 100 - revealProgress * PEEK_REVEAL_PERCENT,
                    });
                },
            });

            const pinEndScrollY = section.offsetTop + totalDistance;
            const peakScreenYAtUnpin =
                ((100 - PEEK_REVEAL_PERCENT) / 100) * window.innerHeight;
            const targetScreenY =
                FLATTEN_TARGET_VIEWPORT_FRACTION * window.innerHeight;
            const flattenScrollDistance = Math.max(
                1,
                peakScreenYAtUnpin - targetScreenY
            );

            ScrollTrigger.create({
                start: pinEndScrollY,
                end: pinEndScrollY + flattenScrollDistance,
                scrub: true,
                onUpdate: (self) => {
                    flattenProgressRef.current = self.progress;
                    if (curvePathRef.current) {
                        curvePathRef.current.setAttribute(
                            "d",
                            flattenPeakToCorner(cornerDepthRef.current, self.progress)
                        );
                    }
                },
            });
        }, section);

        return () => ctx.revert();
    }, []);

    const cornerDepth = getCornerDepth(viewportWidth);

    slideRefs.current = [];

    return (
        <section ref={sectionRef} className="bg-black w-full min-h-screen relative overflow-hidden">
            <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
                <div className="scale-125 origin-center">
                    <InfiniteImageColumns ref={bgRef} />
                </div>
            </div>

            <div id="phase2-content" ref={contentRef} className="bg-black relative z-10 w-full min-h-screen">
                <div
                    className="relative flex flex-row items-center sm:justify-between gap-3 sm:gap-0 text-center sm:text-left text-neutral-500 font-dm-mono"
                    style={{
                        paddingLeft: HEADER_PADDING_X,
                        paddingRight: HEADER_PADDING_X,
                        paddingTop: HEADER_PADDING_TOP,
                        fontSize: HEADER_FONT_SIZE,
                    }}
                >
                    <div className="hidden sm:block">
                        <p>
                            Looking for your next
                            <br />
                            cool Website?
                        </p>
                    </div>

                    <div className="m-auto translate-y-5 sm:translate-y-0  static sm:absolute sm:left-1/2 sm:-translate-x-1/2">
                        Orbition Creative
                    </div>

                    <div className="hidden sm:block">We Are here to help {":)"}</div>
                </div>

                <div
                    className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 overflow-hidden"
                    style={{ width: CONTENT_WIDTH, height: CONTENT_HEIGHT }}
                >
                    <div
                        ref={trackRef}
                        className="flex flex-col font-founders-power"
                        style={{ gap: TRACK_GAP }}
                    >
                        {slideContent.map((slide, i) => (
                            <div
                                key={i}
                                ref={(el) => (slideRefs.current[i] = el)}
                                className="flex items-center justify-center text-white text-center leading-none"
                                style={{ height: CONTENT_HEIGHT, fontSize: SLIDE_FONT_SIZE }}
                            >
                                {slide.text || (
                                    <img
                                        className="object-contain"
                                        src={slide.image}
                                        alt={`Slide ${i + 1}`}
                                        style={{ width: LOGO_WIDTH }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div
                className="absolute inset-x-0 z-20 pointer-events-none"
                style={{ bottom: -SEAM_OVERLAP_PX, height: `calc(100vh + ${SEAM_OVERLAP_PX}px)` }}
                aria-hidden="true"
            >
                <svg width="0" height="0" className="absolute">
                    <clipPath id="phase2-peek-curve" clipPathUnits="objectBoundingBox">
                        <path
                            ref={curvePathRef}
                            d={flattenPeakToCorner(cornerDepth, flattenProgressRef.current)}
                        />
                    </clipPath>
                </svg>
                <div
                    ref={peekRef}
                    className="w-full h-full"
                    style={{
                        backgroundColor: "#F3F3F3",
                        clipPath: "url(#phase2-peek-curve)",
                        transform: "translateZ(0)",
                    }}
                />
            </div>
        </section>
    );
}