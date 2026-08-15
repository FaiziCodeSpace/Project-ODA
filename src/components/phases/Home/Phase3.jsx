// src/components/phases/Home/Phase3.jsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from "@/components/ui/Button";
import BlurText from "@/components/animations/BlurText";

gsap.registerPlugin(ScrollTrigger);

export default function Phase3() {
    const sectionRef = useRef(null);
    const plusLayerRef = useRef(null);
    const cursorLayerRef = useRef(null);

    useEffect(() => {
        const section = sectionRef.current;
        const phase2Content = document.getElementById("phase2-content");
        if (!section) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "top top",
                scrub: true,
            },
        });

        if (phase2Content) {
            tl.to(
                phase2Content,
                {
                    scale: 0.4,
                    duration: 1,
                    ease: "none",
                },
                0
            );
        }

        return () => {
            tl.scrollTrigger?.kill();
            tl.kill();
        };
    }, []);

    useEffect(() => {
        const layer = plusLayerRef.current;
        if (!layer) return;

        const activeTimelines = new Set();

        const spawnPlus = () => {
            const size = gsap.utils.random(20, 36, 1);
            const top = gsap.utils.random(8, 85);
            const left = gsap.utils.random(5, 90);

            const icon = document.createElement("div");
            icon.style.position = "absolute";
            icon.style.top = `${top}%`;
            icon.style.left = `${left}%`;
            icon.style.width = `${size}px`;
            icon.style.height = `${size}px`;
            icon.style.color = "rgba(0,0,0,0.35)";
            icon.style.pointerEvents = "none";
            icon.style.zIndex = "5";
            icon.innerHTML =
                '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z"/></svg>';

            layer.appendChild(icon);

            const iconTl = gsap.timeline({
                onComplete: () => {
                    icon.remove();
                    activeTimelines.delete(iconTl);
                },
            });

            iconTl
                .fromTo(
                    icon,
                    { opacity: 0, scale: 0.3, rotate: -90 },
                    { opacity: 1, scale: 1, rotate: 0, duration: 0.6, ease: "back.out(1.7)" }
                )
                .to(icon, { rotate: 180, duration: 2.2, ease: "power1.inOut" }, "+=0.3")
                .to(icon, { opacity: 0, scale: 0.5, duration: 0.5, ease: "power2.in" }, "-=0.3");

            activeTimelines.add(iconTl);
        };

        spawnPlus();
        const interval = setInterval(spawnPlus, 3000);

        return () => {
            clearInterval(interval);
            activeTimelines.forEach((t) => t.kill());
            activeTimelines.clear();
            layer.innerHTML = "";
        };
    }, []);

    // Preload a fixed pool of placeholder images once, so spawns below
    // paint instantly from cache instead of firing a fresh network
    // request per spawn (that mismatch was why images loaded inconsistently).
    const imagePoolRef = useRef([]);

    useEffect(() => {
        const POOL_IDS = [10, 24, 38, 48, 60, 76, 88, 96, 110, 122, 134, 145];
        let cancelled = false;

        POOL_IDS.forEach((id) => {
            const url = `https://picsum.photos/id/${id}/300/534`;
            const img = new Image();
            img.src = url;
            img.onload = () => {
                if (!cancelled) imagePoolRef.current.push(url);
            };
        });

        return () => {
            cancelled = true;
        };
    }, []);

    // Cursor-trail image spawn effect — skipped on touch devices, since a
    // mouse-follow effect has nothing to follow there.
    useEffect(() => {
        const section = sectionRef.current;
        const layer = cursorLayerRef.current;
        if (!section || !layer) return;
        if (window.matchMedia("(pointer: coarse)").matches) return;

        const MIN_DISTANCE = 90; // px, min cursor travel before next spawn
        const MIN_INTERVAL = 90; // ms, min time between spawns

        const pointer = { x: 0, y: 0 };
        const lastSpawn = { x: 0, y: 0, time: 0 };
        let isInside = false;
        let rafId;

        const handleMouseMove = (e) => {
            const rect = section.getBoundingClientRect();
            pointer.x = e.clientX - rect.left;
            pointer.y = e.clientY - rect.top;
            isInside = true;
        };

        const handleMouseLeave = () => {
            isInside = false;
        };

        const spawnImage = (x, y) => {
            const pool = imagePoolRef.current;
            if (pool.length === 0) return; // nothing preloaded yet

            const url = pool[Math.floor(Math.random() * pool.length)];
            const size = gsap.utils.random(120, 150, 1);

const width = size;
const height = size;
            const rotation = gsap.utils.random(-6, 6);
            const offsetX = gsap.utils.random(-20, 20);
            const offsetY = gsap.utils.random(-20, 20);

            const el = document.createElement("div");
            el.style.position = "absolute";
            el.style.left = `${x + offsetX}px`;
            el.style.top = `${y + offsetY}px`;
            el.style.width = `${width}px`;
            el.style.height = `${height}px`;
            el.style.borderRadius = "6px";
            el.style.overflow = "hidden";
            el.style.pointerEvents = "none";
            el.style.zIndex = "4";
            el.style.willChange = "transform, opacity, filter";
            // Placeholder — swap pool URLs for real assets when ready
            el.style.backgroundImage = `url(${url})`;
            el.style.backgroundSize = "cover";
            el.style.backgroundPosition = "center";

            layer.appendChild(el);

            gsap.set(el, {
                xPercent: -50,
                yPercent: -50,
                rotation,
                scale: 0.6,
                opacity: 0,
                filter: "blur(10px)",
            });

            gsap.to(el, {
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
                duration: 0.22,
                ease: "power2.out",
                onComplete: () => {
                    gsap.to(el, {
                        opacity: 0,
                        scale: 1.12,
                        filter: "blur(6px)",
                        duration: 0.3,
                        ease: "power2.in",
                        onComplete: () => el.remove(),
                    });
                },
            });
        };

        const loop = () => {
            if (isInside) {
                const dx = pointer.x - lastSpawn.x;
                const dy = pointer.y - lastSpawn.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const now = performance.now();

                if (dist > MIN_DISTANCE && now - lastSpawn.time > MIN_INTERVAL) {
                    spawnImage(pointer.x, pointer.y);
                    lastSpawn.x = pointer.x;
                    lastSpawn.y = pointer.y;
                    lastSpawn.time = now;
                }
            }
            rafId = requestAnimationFrame(loop);
        };

        section.addEventListener("mousemove", handleMouseMove);
        section.addEventListener("mouseleave", handleMouseLeave);
        rafId = requestAnimationFrame(loop);

        return () => {
            section.removeEventListener("mousemove", handleMouseMove);
            section.removeEventListener("mouseleave", handleMouseLeave);
            cancelAnimationFrame(rafId);
            gsap.killTweensOf(layer.children);
            layer.innerHTML = "";
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative z-[999] bg-[#F3F3F3] -mt-1 min-h-screen overflow-hidden px-5 sm:px-8 md:px-12 lg:px-20"
        >
            <div ref={plusLayerRef} className="absolute inset-0 z-0" />
            <div ref={cursorLayerRef} className="absolute inset-0 z-0 pointer-events-none" />

            <div className="relative z-10 h-full min-h-screen flex flex-col justify-between border-l-[1px] border-r-[1px] border-[rgba(0,0,0,0.07)] p-5 sm:p-6 md:p-8 lg:p-10 mt-10">
                <div className="flex flex-col md:flex-row md:justify-between gap-8 md:gap-6 text-black w-full font-founders">
                    <ul className="flex flex-col text-neutral-600 text-[14px] sm:text-[16px] gap-2 sm:gap-3 font-normal">
                        <li>Web Design</li>
                        <li>Branding</li>
                        <li>Social Media Marketing</li>
                        <li>Development</li>
                        <li>SEO Optimization</li>
                    </ul>
                    <div className="flex flex-col gap-4 sm:gap-[22px] w-full md:max-w-[295px] text-neutral-600">
                        <p className="text-sm sm:text-base">Some websites launch. Ours leave orbit. ODA builds brands and digital experiences engineered to hit different </p>
                        <Button
                            content={"Ok, Let's Do This"}
                        />
                    </div>
                </div>

                <BlurText
                    text="Ready for liftoff?"
                    className="text-black text-[40px] sm:text-[56px] md:text-[90px] lg:text-[133.43px] leading-tight"
                    direction="bottom"
                />
            </div>
        </section>
    );
}