// src/components/animations/GalaxyHoverCard.jsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function GalaxyHoverCard({ children, className = "", radius = 220 }) {
    const containerRef = useRef(null);
    const spotRef = useRef(null);
    const quickX = useRef(null);
    const quickY = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        const spot = spotRef.current;
        if (!container || !spot) return;

        const size = radius * 2;

        quickX.current = gsap.quickTo(spot, "x", { duration: 0.35, ease: "power3" });
        quickY.current = gsap.quickTo(spot, "y", { duration: 0.35, ease: "power3" });

        const handleMove = (e) => {
            const rect = container.getBoundingClientRect();
            quickX.current(e.clientX - rect.left - size / 2);
            quickY.current(e.clientY - rect.top - size / 2);
        };

        const handleEnter = (e) => {
            handleMove(e);
            gsap.to(spot, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" });
        };

        const handleLeave = () => {
            gsap.to(spot, { opacity: 0, scale: 0.6, duration: 0.4, ease: "power2.in" });
        };

        container.addEventListener("pointermove", handleMove);
        container.addEventListener("pointerenter", handleEnter);
        container.addEventListener("pointerleave", handleLeave);

        return () => {
            container.removeEventListener("pointermove", handleMove);
            container.removeEventListener("pointerenter", handleEnter);
            container.removeEventListener("pointerleave", handleLeave);
        };
    }, [radius]);

    return (
        <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
            {children}

            <div
                ref={spotRef}
                className="pointer-events-none absolute top-0 left-0 rounded-full opacity-0"
                style={{
                    width: radius * 2,
                    height: radius * 2,
                    transform: "scale(0.6)",
                    willChange: "transform, opacity",
                    backdropFilter: "invert(1) brightness(1.05)",
                    WebkitBackdropFilter: "invert(1) brightness(1.05)",
                    maskImage:
                        "radial-gradient(circle, black 0%, black 18%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.6) 42%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.18) 68%, rgba(0,0,0,0.06) 82%, transparent 96%)",
                    WebkitMaskImage:
                        "radial-gradient(circle, black 0%, black 18%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.6) 42%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.18) 68%, rgba(0,0,0,0.06) 82%, transparent 96%)",
                }}
            >
                {/* Starfield — dense field of twinkling points, slow spin for drift */}
                <div
                    className="absolute inset-[-50%] mix-blend-screen animate-[spin_22s_linear_infinite]"
                    style={{
                        backgroundImage: `
                            radial-gradient(2px 2px at 8% 15%, white, transparent),
                            radial-gradient(1px 1px at 18% 42%, white, transparent),
                            radial-gradient(1.5px 1.5px at 27% 8%, white, transparent),
                            radial-gradient(2px 2px at 35% 60%, white, transparent),
                            radial-gradient(1px 1px at 44% 25%, white, transparent),
                            radial-gradient(1.5px 1.5px at 52% 78%, white, transparent),
                            radial-gradient(2px 2px at 60% 35%, white, transparent),
                            radial-gradient(1px 1px at 68% 55%, white, transparent),
                            radial-gradient(1.5px 1.5px at 75% 12%, white, transparent),
                            radial-gradient(2px 2px at 82% 68%, white, transparent),
                            radial-gradient(1px 1px at 90% 30%, white, transparent),
                            radial-gradient(1.5px 1.5px at 15% 85%, white, transparent),
                            radial-gradient(1px 1px at 33% 92%, white, transparent),
                            radial-gradient(2px 2px at 48% 48%, white, transparent),
                            radial-gradient(1px 1px at 58% 90%, white, transparent),
                            radial-gradient(1.5px 1.5px at 70% 82%, white, transparent),
                            radial-gradient(1px 1px at 88% 88%, white, transparent),
                            radial-gradient(1.5px 1.5px at 95% 50%, white, transparent)
                        `,
                    }}
                />

                {/* Soft twinkle pulse over the starfield */}
                <div
                    className="absolute inset-0 mix-blend-screen animate-[pulse_3.2s_ease-in-out_infinite]"
                    style={{
                        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.14), transparent 70%)",
                    }}
                />
            </div>
        </div>
    );
}