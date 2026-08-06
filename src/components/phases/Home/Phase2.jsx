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
    // True only once InfiniteImageColumns confirms (via GSAP's real onStart)
    // that it has actually begun sliding — the peek reveal waits on this.
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
            const gapDistance = window.innerHeight * 0.5;       // column-gap spread animation
            const revealDistance = window.innerHeight * 0.6;    // pure scroll room for the peek, AFTER gap is done

            const slidesDistance = stepDistance * last;
            const totalDistance =
                slidesDistance + scaleDistance + gapDistance + revealDistance;

            const slidesFraction = slidesDistance / totalDistance;
            const stepSize = slidesFraction / last;
            const scaleFraction = scaleDistance / totalDistance;
            const gapFraction = gapDistance / totalDistance;
            const revealFraction = revealDistance / totalDistance;

            const scaleEndFraction = slidesFraction + scaleFraction;
            const gapEndFraction = scaleEndFraction + gapFraction; // gap animation truly complete here

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
                    "--column-gap": "24px",
                    "--row-gap": "24px",
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
                // Pure hold, no visual change — reserves scroll room so the
                // gap tween above genuinely finishes at gapEndFraction.
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
                    // Only snap between slide steps. Past that point, let the
                    // scale/gap/reveal chain scrub 1:1 with real scroll input —
                    // this was previously jumping straight from the last slide
                    // to progress===1, skipping scale/gap/reveal entirely.
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
                <div className="relative flex items-center justify-between px-20 pt-12 text-neutral-500 text-[11px] font-dm-mono">
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
                    <div ref={trackRef} className="flex flex-col gap-2 font-founders-power">
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