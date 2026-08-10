'use client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';
gsap.registerPlugin(ScrollTrigger);

export default function Phase7() {
  const sectionRef = useRef(null);
  const wrapperRef = useRef(null);
  const astronautRef = useRef(null);
  const rockRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(wrapperRef.current, {
        opacity: 0,
        scale: 14,
        transformOrigin: '50.5% 32%',
        force3D: true,
        willChange: 'transform, opacity',
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=1600',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      tl.to(wrapperRef.current, {
        opacity: 1,
        ease: 'none',
        duration: 500,
      });

      tl.to(wrapperRef.current, {
        scale: 1,
        ease: 'none',
        duration: 700,
        force3D: true,
      });

      tl.to({}, {
        duration: 400,
      });

      const astronautX = gsap.quickTo(astronautRef.current, 'x', { duration: 1, ease: 'power3.out' });
      const astronautY = gsap.quickTo(astronautRef.current, 'y', { duration: 1, ease: 'power3.out' });
      const rockX = gsap.quickTo(rockRef.current, 'x', { duration: 1, ease: 'power3.out' });
      const rockY = gsap.quickTo(rockRef.current, 'y', { duration: 1, ease: 'power3.out' });

      const ASTRO_INTENSITY = 10;
      const ROCK_INTENSITY = -18;

      const handleMouseMove = (e) => {
        const rect = sectionRef.current.getBoundingClientRect();
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
      section.addEventListener('mousemove', handleMouseMove);
      section.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        section.removeEventListener('mousemove', handleMouseMove);
        section.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black"
    >
      <div ref={wrapperRef} className="relative flex flex-col items-center">
        <h1 className="absolute w-[1150px] text-center font-power text-[200px] leading-[88%]">
          <span className="text-[#FFFFFF4D]">WE LANDED</span> <br />
          <span className="text-white">MANY</span> <br />
          <span className="text-[#FFFFFF4D]">PRODUCTS</span>
        </h1>
        <div className="flex justify-center pt-[20%]">
          <img ref={astronautRef} className="absolute h-[1000px]" src="/images/astro/astronaut.png" alt="astronaut" />
          <img ref={rockRef} className="z-10 w-full" src="/images/astro/rock.png" alt="rock" />
        </div>
      </div>
    </section>
  );
}