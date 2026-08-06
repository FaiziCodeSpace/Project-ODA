// src/components/animations/BlurText.jsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function BlurText({
    text = "",
    className = "",
    direction = "top",
    delay = 80,
    stepDuration = 0.5,
    start = "top bottom",
    end = "top 45%",
    scrub = 0.6,
}) {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const words = container.querySelectorAll("[data-word]");
        const yFrom = direction === "top" ? -40 : 40;

        gsap.set(words, {
            opacity: 0,
            y: yFrom,
            filter: "blur(14px)",
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container,
                start,
                end,
                scrub,
            },
        });

        tl.to(words, {
            keyframes: [
                { opacity: 0.5, y: direction === "top" ? -10 : 10, filter: "blur(6px)" },
                { opacity: 1, y: 0, filter: "blur(0px)" },
            ],
            duration: stepDuration,
            stagger: delay / 1000,
            ease: "power2.out",
        });

        return () => {
            tl.scrollTrigger?.kill();
            tl.kill();
        };
    }, [text, direction, delay, stepDuration, start, end, scrub]);

    const words = text.split(" ");

    return (
        <p ref={containerRef} className={`${className} font-power`} style={{ display: "flex", flexWrap: "wrap" }}>
            {words.map((word, i) => (
                <span key={i} data-word className="inline-block will-change-[transform,filter,opacity]">
                    {word}
                    {i < words.length - 1 ? "\u00A0" : ""}
                </span>
            ))}
        </p>
    );
}