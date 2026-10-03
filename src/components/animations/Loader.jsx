"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ASSETS = [
    "/images/1-1.png", "/images/1-2.png", "/images/1-3.png",
    "/images/2-1.png", "/images/2-2.png", "/images/2-3.png",
    "/images/3-1.png", "/images/3-2.png", "/images/3-3.png",
    "/images/astro/astronaut.webp",
    "/images/astro/rock.png",
    "/images/astro/rock-long.png",
    "/images/cards/1.png", "/images/cards/2.png",
    "/images/cards/3.png", "/images/cards/4.png",
    "/logo/O.svg",
    "/svgs/Union.svg",
    "/svgs/Glob.svg",
    "/svgs/pixel-arrow.svg",
];

const MIN_DURATION = 2.4;
const SAFETY_TIMEOUT = 15000;
const DOT_COLOR = "10, 10, 10";
const LABEL_DOTS = 5;

export default function Loader() {
    const [done, setDone] = useState(false);

    const rootRef = useRef(null);
    const canvasRef = useRef(null);
    const uiRef = useRef(null);
    const pctRef = useRef(null);
    const labelDotsRef = useRef([]);

    useEffect(() => {
        const root = rootRef.current;
        const canvas = canvasRef.current;
        const ui = uiRef.current;
        const pct = pctRef.current;
        if (!root || !canvas || !ui || !pct) return;

        const ctx = canvas.getContext("2d");
        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if ("scrollRestoration" in history) history.scrollRestoration = "manual";
        window.scrollTo(0, 0);

        const block = (e) => {
            e.preventDefault();
            e.stopPropagation();
        };
        const blockKeys = (e) => {
            if ([" ", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"].includes(e.key)) {
                block(e);
            }
        };
        window.addEventListener("wheel", block, { capture: true, passive: false });
        window.addEventListener("touchmove", block, { capture: true, passive: false });
        window.addEventListener("keydown", blockKeys, { capture: true });

        const total = ASSETS.length + 2;
        let loaded = 0;
        let real = 0;
        const bump = () => {
            loaded += 1;
            real = Math.min(1, loaded / total);
        };

        ASSETS.forEach((src) => {
            const img = new Image();
            img.onload = bump;
            img.onerror = bump;
            img.src = src;
        });
        document.fonts.ready.then(bump);
        if (document.readyState === "complete") bump();
        else window.addEventListener("load", bump, { once: true });

        const safety = setTimeout(() => {
            loaded = total;
            real = 1;
        }, SAFETY_TIMEOUT);

        const labelTween = gsap.to(labelDotsRef.current, {
            opacity: 0.15,
            duration: 0.45,
            ease: "power1.inOut",
            stagger: { each: 0.12, repeat: -1, yoyo: true },
        });

        let w = 0, h = 0, spacing = 24, cols = 0, rows = 0;
        let R = 240, maxDot = 10, offsetX = 0, offsetY = 0;
        let intensity = new Float32Array(0);
        let phase = new Float32Array(0);

        const build = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = window.innerWidth;
            h = window.innerHeight;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            spacing = gsap.utils.clamp(18, 30, w / 52);
            cols = Math.ceil(w / spacing) + 1;
            rows = Math.ceil(h / spacing) + 1;
            offsetX = (w - (cols - 1) * spacing) / 2;
            offsetY = (h - (rows - 1) * spacing) / 2;
            R = gsap.utils.clamp(150, 340, Math.min(w, h) * 0.3);
            maxDot = spacing * 0.46;

            intensity = new Float32Array(cols * rows);
            phase = Float32Array.from({ length: cols * rows }, () => Math.random() * Math.PI * 2);
        };
        build();
        window.addEventListener("resize", build);

        const mouse = { x: w / 2, y: h / 2, active: false };
        const pos = { x: w / 2, y: h / 2 };

        const onPointerMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            mouse.active = true;
        };
        const onPointerLeave = () => {
            mouse.active = false;
        };
        window.addEventListener("pointermove", onPointerMove);
        document.documentElement.addEventListener("pointerleave", onPointerLeave);

        const startTime = gsap.ticker.time;
        let shown = 0;
        let finished = false;
        let exitTl;

        const finish = () => {
            if (finished) return;
            finished = true;
            shown = 1;
            pct.textContent = "100";

            exitTl = gsap.timeline({
                onComplete: () => {
                    cleanup();
                    setDone(true);
                    requestAnimationFrame(() => ScrollTrigger.refresh());
                },
            });

            if (reducedMotion) {
                exitTl.to(root, { opacity: 0, duration: 0.4, delay: 0.2 });
            } else {
                exitTl
                    .to(ui, { opacity: 0, y: -24, duration: 0.5, ease: "power2.in" }, 0.3)
                    .to(root, { yPercent: -100, duration: 1.1, ease: "expo.inOut" }, 0.65);
            }
        };

        const tick = (time, deltaMs) => {
            const dt = Math.min(deltaMs / 1000, 0.05);
            const elapsed = time - startTime;

            if (!finished) {
                const target = Math.min(real, elapsed / MIN_DURATION);
                shown += (target - shown) * (1 - Math.exp(-dt * 5));
                pct.textContent = String(Math.round(shown * 100));
                if (target >= 1 && shown > 0.995) finish();
            }

            let tx = mouse.x;
            let ty = mouse.y;
            if (!mouse.active) {
                tx = w / 2 + Math.sin(elapsed * 0.9) * w * 0.28;
                ty = h / 2 + Math.sin(elapsed * 1.3 + 1) * h * 0.22;
            }
            const follow = 1 - Math.exp(-dt * 12);
            pos.x += (tx - pos.x) * follow;
            pos.y += (ty - pos.y) * follow;

            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = `rgb(${DOT_COLOR})`;
            ctx.beginPath();

            const rise = 1 - Math.exp(-dt * 24);
            const fall = Math.exp(-dt * 7);
            const R2 = R * R;
            const minDot = 0.7;

            for (let j = 0; j < rows; j++) {
                const y = offsetY + j * spacing;
                const dy = y - pos.y;
                for (let i = 0; i < cols; i++) {
                    const idx = j * cols + i;
                    const x = offsetX + i * spacing;
                    const dx = x - pos.x;
                    const d2 = dx * dx + dy * dy;

                    let cur = intensity[idx];
                    if (d2 < R2) {
                        const f = 1 - Math.sqrt(d2) / R;
                        const target = Math.pow(f, 1.8);
                        cur = target > cur ? cur + (target - cur) * rise : Math.max(target, cur * fall);
                    } else {
                        cur *= fall;
                    }
                    intensity[idx] = cur;

                    if (cur < 0.015) continue;
                    const shimmer = 1 + 0.08 * Math.sin(time * 3 + phase[idx]);
                    const r = (minDot + (maxDot - minDot) * cur) * shimmer;
                    ctx.moveTo(x + r, y);
                    ctx.arc(x, y, r, 0, Math.PI * 2);
                }
            }
            ctx.fill();
        };
        gsap.ticker.add(tick);

        function cleanup() {
            clearTimeout(safety);
            labelTween.kill();
            exitTl?.kill();
            gsap.ticker.remove(tick);
            window.removeEventListener("resize", build);
            window.removeEventListener("pointermove", onPointerMove);
            document.documentElement.removeEventListener("pointerleave", onPointerLeave);
            window.removeEventListener("wheel", block, { capture: true });
            window.removeEventListener("touchmove", block, { capture: true });
            window.removeEventListener("keydown", blockKeys, { capture: true });
            if ("scrollRestoration" in history) history.scrollRestoration = "auto";
        }

        return cleanup;
    }, []);

    if (done) return null;

    return (
        <div
            ref={rootRef}
            role="status"
            aria-label="Loading"
            className="fixed inset-0 z-[10000] overflow-hidden bg-[#F3F3F3] touch-none select-none"
        >
            <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

            <div
                ref={uiRef}
                className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between px-5 pb-6 text-[#0a0a0a] sm:px-10 sm:pb-8 lg:px-20 lg:pb-12"
            >
                <p className="pb-1 font-dm-mono text-xs uppercase tracking-widest sm:text-sm">
                    Loading
                    {Array.from({ length: LABEL_DOTS }, (_, i) => (
                        <span
                            key={i}
                            ref={(el) => (labelDotsRef.current[i] = el)}
                            className="inline-block"
                        >
                            .
                        </span>
                    ))}
                </p>
                <p className="font-power text-[clamp(56px,12vw,180px)] leading-none tabular-nums">
                    <span ref={pctRef}>0</span>%
                </p>
            </div>
        </div>
    );
}