'use client';

import gsap from '@/lib/gsap/gsapConfig';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';

export default function Phase7() {
    const sectionRef = useRef(null);
    const wrapperRef = useRef(null);
    const astronautRef = useRef(null);
    const rockRef = useRef(null);
    const imageContainerRef = useRef(null);
    const rectRef = useRef(null);

    useEffect(() => {
        let cancelled = false;
        let ctx;
        let cleanupExtra;

        const setupAnimation = () => {
            ctx = gsap.context(() => {
                const mm = gsap.matchMedia();

                // Breakpoint configurations covering range: 370px - 1920px+
                const breakpoints = [
                    {
                        // Extra Small Mobile (below 375px)
                        query: '(max-width: 374px)',
                        config: {
                            origin: '50.5% 28%',
                            astroHeight: '280px',
                            imagePt: '18%',
                        },
                    },
                    {
                        // Small Mobile (375px to 413px)
                        query: '(min-width: 375px) and (max-width: 413px)',
                        config: {
                            origin: '50.5% 28%',
                            astroHeight: '320px',
                            imagePt: '16%',
                        },
                    },
                    {
                        // Compact Mobile (414px to 459px)
                        query: '(min-width: 414px) and (max-width: 459px)',
                        config: {
                            origin: '50.5% 30%',
                            astroHeight: '350px',
                            imagePt: '16%',
                        },
                    },
                    {
                        // Medium Mobile (460px to 539px)
                        query: '(min-width: 460px) and (max-width: 539px)',
                        config: {
                            origin: '50.5% 30%',
                            astroHeight: '400px',
                            imagePt: '18%',
                        },
                    },
                    {
                        // Large Mobile / Phablet (540px to 639px)
                        query: '(min-width: 540px) and (max-width: 639px)',
                        config: {
                            origin: '50.5% 31%',
                            astroHeight: '440px',
                            imagePt: '18%',
                        },
                    },
                    {
                        // Small Tablet / Landscape Phone (640px to 767px)
                        query: '(min-width: 640px) and (max-width: 767px)',
                        config: {
                            origin: '50.5% 28%',
                            astroHeight: '480px',
                            imagePt: '18%',
                        },
                    },
                    {
                        // Tablet Portrait (768px to 900px)
                        query: '(min-width: 768px) and (max-width: 900px)',
                        config: {
                            origin: '50.5% 28%',
                            astroHeight: '580px',
                            imagePt: '18%',
                        },
                    },
                    {
                        // Tablet Landscape (901px to 1023px)
                        query: '(min-width: 901px) and (max-width: 1023px)',
                        config: {
                            origin: '50.5% 32%',
                            astroHeight: '680px',
                            imagePt: '28%',
                        },
                    },
                    {
                        // Small Laptop (1024px to 1279px)
                        query: '(min-width: 1024px) and (max-width: 1279px)',
                        config: {
                            origin: '50.5% 32%',
                            astroHeight: '750px',
                            imagePt: '25%',
                        },
                    },
                    {
                        // Medium Laptop / Desktop (1280px to 1439px)
                        query: '(min-width: 1280px) and (max-width: 1439px)',
                        config: {
                            origin: '50.5% 26%',
                            astroHeight: '820px',
                            imagePt: '20%',
                        },
                    },
                    {
                        // Standard Desktop (1440px to 1727px)
                        query: '(min-width: 1440px) and (max-width: 1727px)',
                        config: {
                            origin: '50.5% 30%',
                            astroHeight: '900px',
                            imagePt: '20%',
                        },
                    },
                    {
                        // Large Desktop (1728px to 1919px)
                        query: '(min-width: 1728px) and (max-width: 1919px)',
                        config: {
                            origin: '50.5% 32%',
                            astroHeight: '950px',
                            imagePt: '20%',
                        },
                    },
                    {
                        // Ultra Wide / 2K Display (1920px and above)
                        query: '(min-width: 1920px)',
                        config: {
                            origin: '50.5% 32%',
                            astroHeight: '1000px',
                            imagePt: '20%',
                        },
                    },
                ];

                // Dynamic breakpoint updates via GSAP matchMedia
                breakpoints.forEach(({ query, config }) => {
                    mm.add(query, () => {
                        gsap.set(wrapperRef.current, {
                            transformOrigin: config.origin,
                        });

                        if (astronautRef.current) {
                            gsap.set(astronautRef.current, { height: config.astroHeight });
                        }

                        if (imageContainerRef.current) {
                            gsap.set(imageContainerRef.current, { paddingTop: config.imagePt });
                        }
                    });
                });

                // Initial scale/opacity state
                gsap.set(wrapperRef.current, {
                    opacity: 0,
                    scale: 15,
                    force3D: true,
                    willChange: 'transform, opacity',
                });

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top top',
                        end: '+=2500', // was +=2400 — extended to fit the new buffer segment
                        pin: true,
                        scrub: 1,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                        fastScrollEnd: true, // still useful as a safety net for very fast flicks
                        snap: {
                            snapTo: (progress) => {
                                const total = tl.duration();
                                const targets = ['fadeStart', 'scaleStart', 'scaleEnd', 'end'].map(
                                    (label) => tl.labels[label] / total
                                );
                                return targets.reduce((closest, t) =>
                                    Math.abs(t - progress) < Math.abs(closest - progress) ? t : closest
                                );
                            },
                            duration: { min: 0.2, max: 0.6 },
                            delay: 0.1,
                            ease: 'power1.inOut',
                        },
                    },
                    onStart: () => {
                        gsap.set(wrapperRef.current, { willChange: 'transform, opacity' });
                    },
                    onComplete: () => {
                        gsap.set(wrapperRef.current, { willChange: 'auto' });
                    },
                    onReverseComplete: () => {
                        gsap.set(wrapperRef.current, { willChange: 'auto' });
                    },
                });

                tl.addLabel('start');

                // Idle buffer sitting right at the pin boundary. Wrapper is still
                // opacity:0 here (from the initial gsap.set), so nothing is visually
                // different on forward scroll — but on reverse scroll this buffer is the
                // LAST thing to play before the raw scroll crosses the unpin boundary,
                // giving the scrub-lagged opacity tween real time to finish reaching 0
                // before the pin actually releases. It is intentionally NOT a snap target
                // (see snapTo above) so forward scroll can't get pulled back into it.
                tl.to({}, {
                    duration: 300,
                });

                tl.addLabel('fadeStart');

                tl.to(wrapperRef.current, {
                    opacity: 1,
                    ease: 'none',
                    duration: 570,
                });

                tl.addLabel('scaleStart');

                tl.to(wrapperRef.current, {
                    scale: 1,
                    ease: 'none',
                    duration: 1600,
                    force3D: true,
                });

                tl.addLabel('scaleEnd');

                tl.to({}, {
                    duration: 230,
                });

                tl.addLabel('end');

                // Mouse move interactions
                const astronautX = gsap.quickTo(astronautRef.current, 'x', { duration: 1, ease: 'power3.out' });
                const astronautY = gsap.quickTo(astronautRef.current, 'y', { duration: 1, ease: 'power3.out' });
                const rockX = gsap.quickTo(rockRef.current, 'x', { duration: 1, ease: 'power3.out' });
                const rockY = gsap.quickTo(rockRef.current, 'y', { duration: 1, ease: 'power3.out' });

                const ASTRO_INTENSITY = 10;
                const ROCK_INTENSITY = -18;

                // Cache the bounding rect instead of measuring it on every mousemove
                const updateRect = () => {
                    if (sectionRef.current) {
                        rectRef.current = sectionRef.current.getBoundingClientRect();
                    }
                };
                updateRect();
                window.addEventListener('resize', updateRect);
                ScrollTrigger.addEventListener('refresh', updateRect);

                const handleMouseMove = (e) => {
                    const rect = rectRef.current;
                    if (!rect) return;
                    const nx = gsap.utils.clamp(-1, 1, (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2));
                    const ny = gsap.utils.clamp(-1, 1, (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2));

                    astronautX(nx * ASTRO_INTENSITY);
                    astronautY(ny * ASTRO_INTENSITY);
                    rockX(nx * ROCK_INTENSITY);
                    rockY(ny * ROCK_INTENSITY);
                };

                const handleMouseLeave = () => {
                    astronautX(0);
                    astronautY(0);
                    rockX(0);
                    rockY(0);
                };

                const section = sectionRef.current;
                if (section) {
                    section.addEventListener('mousemove', handleMouseMove);
                    section.addEventListener('mouseleave', handleMouseLeave);
                }

                cleanupExtra = () => {
                    window.removeEventListener('resize', updateRect);
                    ScrollTrigger.removeEventListener('refresh', updateRect);
                    if (section) {
                        section.removeEventListener('mousemove', handleMouseMove);
                        section.removeEventListener('mouseleave', handleMouseLeave);
                    }
                };
            }, sectionRef);
        };

        // Wait for both images to be fully decoded before building any GSAP/ScrollTrigger
        // logic at all — this removes the "sometimes doesn't load" glitch
        const waitForDecode = (img) => {
            if (!img) return Promise.resolve();
            if (img.decode) return img.decode().catch(() => { });
            if (img.complete) return Promise.resolve();
            return new Promise((resolve) => {
                img.addEventListener('load', resolve, { once: true });
                img.addEventListener('error', resolve, { once: true });
            });
        };

        Promise.all([
            waitForDecode(astronautRef.current),
            waitForDecode(rockRef.current),
        ]).then(() => {
            if (!cancelled) setupAnimation();
        });

        return () => {
            cancelled = true;
            if (cleanupExtra) cleanupExtra();
            if (ctx) ctx.revert();
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black"
        >
            <div ref={wrapperRef} className="relative flex flex-col items-center">
                <h1 className="absolute w-[90vw] max-w-[1150px] text-center font-power text-[clamp(2.5rem,10vw,200px)] leading-[88%]">
                    <span className="text-[#FFFFFF4D]">WE LANDED</span> <br />
                    <span className="text-white">MANY</span> <br />
                    <span className="text-[#FFFFFF4D]">PRODUCTS</span>
                </h1>
                <div ref={imageContainerRef} className="flex justify-center full-screen">
                    <img ref={astronautRef} className="absolute" src="/images/astro/astronaut.webp" alt="astronaut" />
                    <img ref={rockRef} className="z-10 w-full scale-[1.1]" src="/images/astro/rock.png" alt="rock" />
                </div>
            </div>
        </section>
    );
}