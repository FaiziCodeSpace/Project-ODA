// src/components/phases/Home/Phase4.jsx
import Button from "@/components/ui/Button";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from 'lucide-react';
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function Phase4() {
    const unionRef = useRef(null);
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(unionRef.current, {
                rotate: 360,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    scrub: 2
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="flex flex-col gap-8 bg-[#F3F3F3] px-5 py-12 sm:px-10 sm:py-20 md:px-16 lg:px-20 lg:py-34">
            <div className="flex flex-col gap-6 lg:flex-row lg:justify-between lg:items-start">
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[70px] w-full lg:w-[40%] leading-none font-power">
                    Where Big Ideas Find Their Orbit.
                </h2>
                <div className="flex flex-col gap-[22px] w-full max-w-[465px] text-neutral-600">
                    <p className="font-founders text-base sm:text-lg">
                        Every successful brand starts with a bold idea. We turn those ideas into impactful digital experiences that connect with people, build trust, and drive results.
                    </p>
                    <div>
                        <Button
                            content={"Peek at Our Work"}
                        />
                    </div>
                </div>
            </div>

            <hr className="mt-4 sm:mt-8 border-dashed border-[#A1A1A1]" />

            {/* Squares */}
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-2 font-power">
                <div className="relative flex flex-col justify-between overflow-hidden w-full lg:w-[65%] min-h-[420px] sm:min-h-[480px] lg:h-[538px] rounded-[16px] bg-[#FFFFFF] p-6 sm:p-8 lg:px-11 lg:py-7">
                    <img ref={unionRef} className="absolute -top-16 -right-16 sm:-top-20 sm:-right-20 lg:-top-43 lg:-right-43 w-48 sm:w-64 lg:w-auto" src="/svgs/Union.svg" alt="" />
                    <p className="text-lg sm:text-[20px] relative z-10">About Us</p>
                    <div className="flex flex-col gap-[15px] relative z-10">
                        <div className="flex w-10 h-10 sm:w-12 sm:h-12 bg-[#151515] rounded-[4px]">
                            <ArrowUpRight className="m-auto w-4 sm:w-[18px]" color="white" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl lg:text-[40px] w-full max-w-[342px] leading-tight lg:leading-[46px]">
                            We believe great design is like a <span className="text-[#9a9a9a]">good joke!</span>
                        </h2>
                    </div>
                </div>

                <div className="relative flex flex-col justify-between flex-1 min-h-[350px] sm:min-h-[400px] lg:min-h-0 rounded-[16px] bg-[#FFFFFF] p-6 sm:p-8 lg:px-5 lg:py-8">
                    <img className="absolute top-0 right-0 w-32 sm:w-40 lg:w-auto" src="/svgs/Glob.svg" alt="" />

                    <p className="text-base sm:text-[18px] relative z-10">At Orbit Digital Agency <br /> (ODA)</p>
                    <div className="flex flex-col gap-[9px] w-full max-w-[347px] relative z-10">
                        <h2 className="text-xl sm:text-[24px] leading-snug lg:leading-[26px]">
                            We believe great design is like a good joke!
                        </h2>
                        <p className="text-sm sm:text-[16px] text-neutral-600">
                            We help you figure out what to say, how to say it, and how to make people actually care.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}