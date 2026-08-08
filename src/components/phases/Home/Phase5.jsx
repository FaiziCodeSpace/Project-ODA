"use client";

import { useRef, useLayoutEffect, useEffect, useState, useCallback, useMemo } from "react";
import gsap from "gsap";

const AUTOPLAY_MS = 3000;
const COPIES = 4;
const ASPECT = 351 / 306;

const baseSlides = [
    { id: "[01]", icon: "/svgs/webdesign&development.svg", title: "Website Design & Development" },
    { id: "[02]", icon: "/svgs/webdesign&development.svg", title: "Website Design & Development" },
    { id: "[03]", icon: "/svgs/webdesign&development.svg", title: "Website Design & Development" },
    { id: "[04]", icon: "/svgs/webdesign&development.svg", title: "Website Design & Development" },
    { id: "[05]", icon: "/svgs/webdesign&development.svg", title: "Website Design & Development" },
];

function getConfig(width) {
    if (width < 640) return { cardWidth: 240, gap: 20, visible: 1 };
    if (width < 1024) return { cardWidth: 280, gap: 20, visible: 3 };
    return { cardWidth: 340, gap: 25, visible: 5 };
}

export default function Phase5() {
    const containerRef = useRef(null);
    const trackRef = useRef(null);
    const slotRef = useRef(null);

    const stepRef = useRef(0);
    const cardWidthRef = useRef(340);
    const gapRef = useRef(25);
    const containerWidthRef = useRef(0);
    const visibleRef = useRef(5);
    const leadRef = useRef(baseSlides.length);
    const activeIndexRef = useRef(baseSlides.length);
    const rafIdRef = useRef(null);
    const isAnimating = useRef(false);
    const autoplayRef = useRef(null);
    const dragRef = useRef(null);
    const wheelAccum = useRef(0);
    const wheelLock = useRef(false);
    const inViewRef = useRef(true);

    const [visible, setVisible] = useState(5);
    const [cardWidth, setCardWidth] = useState(340);
    const [gap, setGap] = useState(25);
    const [containerWidth, setContainerWidth] = useState(0);
    const [activeExtendedIndex, setActiveExtendedIndex] = useState(baseSlides.length);
    const [isDragging, setIsDragging] = useState(false);

    const extended = useMemo(
        () => Array.from({ length: COPIES }, () => baseSlides).flat(),
        []
    );
    const total = baseSlides.length;
    const step = cardWidth + gap;
    const cardHeight = cardWidth * ASPECT;

    const centerOffset = () => containerWidthRef.current / 2 - cardWidthRef.current / 2;
    const trackXForLead = (lead) => centerOffset() - lead * stepRef.current;

    const updateActiveIndex = useCallback((idx) => {
        if (activeIndexRef.current === idx) return;
        activeIndexRef.current = idx;
        setActiveExtendedIndex(idx);
    }, []);

    const scheduleActiveUpdate = useCallback(() => {
        if (rafIdRef.current) return;
        rafIdRef.current = requestAnimationFrame(() => {
            rafIdRef.current = null;
            setActiveExtendedIndex((prev) =>
                prev === activeIndexRef.current ? prev : activeIndexRef.current
            );
        });
    }, []);

    useEffect(() => {
        return () => {
            if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        };
    }, []);

    useLayoutEffect(() => {
        const measure = () => {
            if (!containerRef.current) return;
            const width = containerRef.current.offsetWidth;
            const config = getConfig(width);

            containerWidthRef.current = width;
            cardWidthRef.current = config.cardWidth;
            gapRef.current = config.gap;
            stepRef.current = config.cardWidth + config.gap;
            visibleRef.current = config.visible;

            setContainerWidth(width);
            setCardWidth(config.cardWidth);
            setGap(config.gap);
            setVisible(config.visible);

            if (dragRef.current) {
                dragRef.current = null;
                isAnimating.current = false;
            }
        };

        measure();
        const ro = new ResizeObserver(measure);
        if (containerRef.current) ro.observe(containerRef.current);
        return () => ro.disconnect();
    }, []);

    useLayoutEffect(() => {
        if (!stepRef.current || !trackRef.current || !containerWidthRef.current) return;
        gsap.set(trackRef.current, { x: trackXForLead(leadRef.current) });
        updateActiveIndex(leadRef.current);
    }, [containerWidth, cardWidth, gap, updateActiveIndex]);

    const setTrackX = (x) => {
        gsap.set(trackRef.current, { x });
        const nearest = Math.round((centerOffset() - x) / stepRef.current);
        if (nearest !== activeIndexRef.current) {
            activeIndexRef.current = nearest;
            scheduleActiveUpdate();
        }
    };

    const wrapLead = (lead) => {
        let l = lead;
        while (l >= total * (COPIES - 1)) l -= total;
        while (l < total) l += total;
        return l;
    };

    const finalize = (lead) => {
        const wrapped = wrapLead(lead);
        if (wrapped !== lead) {
            gsap.set(trackRef.current, { x: trackXForLead(wrapped) });
        }
        leadRef.current = wrapped;
        updateActiveIndex(wrapped);
        isAnimating.current = false;
    };

    const animateTo = (lead, duration = 0.9, ease = "power3.out") => {
        if (!trackRef.current || !stepRef.current) return;
        isAnimating.current = true;
        const x = trackXForLead(lead);
        gsap.to(trackRef.current, {
            x,
            duration,
            ease,
            onUpdate: () => {
                const currentX = gsap.getProperty(trackRef.current, "x");
                const nearest = Math.round((centerOffset() - currentX) / stepRef.current);
                updateActiveIndex(nearest);
            },
            onComplete: () => finalize(lead),
        });
    };

    const goTo = (direction) => {
        if (isAnimating.current || !stepRef.current || !inViewRef.current) return;
        animateTo(leadRef.current + direction);
    };

    const restartAutoplay = useCallback(() => {
        clearInterval(autoplayRef.current);
        autoplayRef.current = setInterval(() => goTo(1), AUTOPLAY_MS);
    }, []);

    useEffect(() => {
        if (!stepRef.current || !containerRef.current) return;

        const io = new IntersectionObserver(
            ([entry]) => {
                inViewRef.current = entry.isIntersecting;
                if (entry.isIntersecting) restartAutoplay();
                else clearInterval(autoplayRef.current);
            },
            { threshold: 0.25 }
        );
        io.observe(containerRef.current);

        const onVisibility = () => {
            if (document.hidden) clearInterval(autoplayRef.current);
            else if (inViewRef.current) restartAutoplay();
        };
        document.addEventListener("visibilitychange", onVisibility);

        return () => {
            io.disconnect();
            clearInterval(autoplayRef.current);
            document.removeEventListener("visibilitychange", onVisibility);
        };
    }, [containerWidth, cardWidth, restartAutoplay]);

    const onPointerDown = (e) => {
        if (!stepRef.current) return;
        if (e.pointerType === "mouse" && e.button !== 0) return;

        clearInterval(autoplayRef.current);
        gsap.killTweensOf(trackRef.current);
        isAnimating.current = false;

        containerRef.current?.setPointerCapture?.(e.pointerId);

        const currentX = gsap.getProperty(trackRef.current, "x");
        dragRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            startTrackX: currentX,
            lastX: e.clientX,
            lastT: performance.now(),
            vx: 0,
            horizontalLock: null,
        };
    };

    const onPointerMove = (e) => {
        const d = dragRef.current;
        if (!d) return;

        const dx = e.clientX - d.startX;
        const dy = e.clientY - d.startY;

        if (d.horizontalLock === null && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
            d.horizontalLock = Math.abs(dx) > Math.abs(dy);
            if (!d.horizontalLock) {
                dragRef.current = null;
                setIsDragging(false);
                return;
            }
            setIsDragging(true);
        }
        if (d.horizontalLock === false || d.horizontalLock === null) return;

        const now = performance.now();
        const dt = now - d.lastT;
        if (dt > 0) {
            const instV = (e.clientX - d.lastX) / dt;
            d.vx = d.vx * 0.85 + instV * 0.15;
        }
        d.lastX = e.clientX;
        d.lastT = now;

        setTrackX(d.startTrackX + dx);
    };

    const endDrag = () => {
        const d = dragRef.current;
        dragRef.current = null;
        setIsDragging(false);
        if (!d || !d.horizontalLock) return;

        const currentX = gsap.getProperty(trackRef.current, "x");
        const projectedX = currentX + d.vx * 320;
        let targetLead = Math.round((centerOffset() - projectedX) / stepRef.current);

        const maxJump = 5;
        targetLead = Math.max(
            leadRef.current - maxJump,
            Math.min(leadRef.current + maxJump, targetLead)
        );
        if (targetLead === leadRef.current) {
            targetLead = Math.round((centerOffset() - currentX) / stepRef.current);
        }

        const speed = Math.min(Math.abs(d.vx), 2.5);
        const duration = Math.max(0.5, 1.15 - speed * 0.28);

        animateTo(targetLead, duration, "power2.out");
        restartAutoplay();
    };

    const onWheel = (e) => {
        if (!stepRef.current) return;
        const horizontalIntent = Math.abs(e.deltaX) > Math.abs(e.deltaY);
        if (!horizontalIntent) return;
        e.preventDefault();
        if (wheelLock.current) return;

        wheelAccum.current += e.deltaX;
        const threshold = stepRef.current * 0.35;
        if (Math.abs(wheelAccum.current) > threshold) {
            const dir = wheelAccum.current > 0 ? 1 : -1;
            wheelAccum.current = 0;
            wheelLock.current = true;
            clearInterval(autoplayRef.current);
            goTo(dir);
            setTimeout(() => {
                wheelLock.current = false;
                restartAutoplay();
            }, 550);
        }
    };

    return (
        <section className="bg-[#F3F3F3] pb-[280px]">
            <p className="text-center text-[#4C3CFF] text-[14px] font-power">[02]</p>
            <div className="text-center mt-24 sm:mt-32 md:mt-45 font-founders text-[36px] sm:text-[50px] md:text-[70px] leading-none px-4">
                <h2>What we do</h2>
                <p className="text-[#999999]">(and do really well)</p>
            </div>

            <div
                ref={containerRef}
                className="relative mt-16 sm:mt-24 md:mt-[150px] overflow-hidden select-none touch-pan-y"
                onMouseEnter={() => clearInterval(autoplayRef.current)}
                onMouseLeave={() => stepRef.current && !dragRef.current && inViewRef.current && restartAutoplay()}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                onWheel={onWheel}
                style={{ minHeight: cardHeight || undefined }}
            >
                {cardWidth > 0 && (
                    <div
                        ref={slotRef}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
                        style={{ width: cardWidth, height: cardHeight }}
                    >
                        <span className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 w-3 h-3 sm:w-5 sm:h-5 border-t border-l border-black" />
                        <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-3 h-3 sm:w-5 sm:h-5 border-t border-r border-black" />
                        <span className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 w-3 h-3 sm:w-5 sm:h-5 border-b border-l border-black" />
                        <span className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 w-3 h-3 sm:w-5 sm:h-5 border-b border-r border-black" />
                    </div>
                )}

                <div ref={trackRef} className="flex will-change-transform" style={{ gap }}>
                    {extended.map((slide, i) => {
                        const isActive = i === activeExtendedIndex;
                        return (
                            <div
                                key={i}
                                style={{ width: cardWidth, height: cardHeight }}
                                className={`relative shrink-0 p-3 sm:p-[15px] flex flex-col justify-center ${isDragging ? "" : "transition-colors duration-500"
                                    } ${isActive ? "bg-white text-center" : "bg-[#F3F3F3] border-1 border-[#E5E5E5]"
                                    }`}
                            >
                                <p
                                    className={`absolute text-xs sm:text-sm ${isDragging ? "" : "transition-all duration-500"
                                        } font-power ${isActive
                                            ? "top-[25%] left-1/2 -translate-x-1/2 -translate-y-1/2"
                                            : "top-[10px] left-[10px] sm:top-[15px] sm:left-[15px]"
                                        }`}
                                >
                                    {slide.id}
                                </p>
                                <div>
                                    <img
                                        src={slide.icon}
                                        alt={slide.title}
                                        className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto mt-6 sm:mt-8 pointer-events-none"
                                    />
                                    <h3 className="mt-4 sm:mt-6 font-founders text-center text-sm sm:text-[24px] px-2">
                                        {slide.title}
                                    </h3>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}