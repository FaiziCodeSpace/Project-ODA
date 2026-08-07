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
        gsap.to(unionRef.current, {
            rotate: 360,
            scrollTrigger: {
                trigger: sectionRef.current,
                scrub:2
            }
        })
    }, [])
    return (
        <section ref={sectionRef} className="flex flex-col gap-8 bg-[#F3F3F3] px-20 py-34">
            <div className="flex justify-between flex-">
                <h2 className="text-[70px] w-[40%] leading-none font-power">Where Big Ideas Find Their Orbit.</h2>
                <div className="flex flex-col gap-[22px] max-w-[465px] text-neutral-600">
                    <p className="font-founders">Every successful brand starts with a bold idea. We turn those ideas into impactful digital experiences that connect with people, build trust, and drive results.</p>
                    <Button
                        content={"Peek at Our Work"}
                    />
                </div>
            </div>
            <hr className="mt-8 border-dashed border-[#A1A1A1]" />
            {/* Sqaures */}
            <div className="flex gap-2 font-power">
                <div radius={100} className="relative flex flex-col justify-between overflow-hidden w-[65%] h-[538px] rounded-[16px] bg-[#FFFFFF] px-11 py-7">
                    <img ref={unionRef} className="absolute -top-25 -right-25" src="/svgs/Union.svg" alt="" />
                    <p className="text-[20px]">About Us</p>
                    <div className="flex flex-col gap-[15px]">
                        <div className="flex w-12 h-12 bg-[#151515] rounded-[4px]"><ArrowUpRight className="m-auto w-[18px]" color="white" /></div>
                        <h2 className="text-[40px] w-[342px] leading-[46px]">We believe great design is like a <span className="text-[#9a9a9a]">good joke!</span></h2>
                    </div>
                </div>
                <div radius={100} className="relative flex flex-col justify-between flex-1 rounded-[16px] bg-[#FFFFFF] px-5 py-8">
                    <img className="absolute top-0 right-0" src="/svgs/Glob.svg" alt="" />

                    <p className="text-[18px]">At Orbit Digital Agency <br /> (ODA)</p>
                    <div className="flex flex-col gap-[9px] w-[347px]">
                        <h2 className="text-[24px] leading-[26px]">We believe great design is like a good joke!</h2>
                        <p className="text-[16px] text-neutral-600">We help you figure out what to say, how to say it, and how to make people actually care.</p>
                    </div>
                </div>
            </div>

        </section>
    )
}