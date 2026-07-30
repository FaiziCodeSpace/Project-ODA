// src/components/phases/Home/Phase4.jsx
import Button from "@/components/ui/Button";
import { ArrowUpRight } from 'lucide-react';
import GalaxyHoverCard from "@/components/animations/GalaxyHoverCard";

export default function Phase4() {
    return (
        <section className="flex flex-col gap-8 bg-[#ececec] px-20 py-34">
            <div className="flex justify-between flex-">
                <h2 className="text-[70px] w-[40%] leading-none">Where Big Ideas Find Their Orbit.</h2>
                <div className="flex flex-col gap-[22px] max-w-[465px] text-neutral-600">
                    <p>Every successful brand starts with a bold idea. We turn those ideas into impactful digital experiences that connect with people, build trust, and drive results.</p>
                    <Button
                        content={"Peek at Our Work Work Work"}
                    />
                </div>
            </div>
            <hr className="mt-8 border-dashed border-[#A1A1A1]" />
            {/* Sqaures */}
            <div className="flex gap-2">
                <GalaxyHoverCard radius={100} className="flex flex-col justify-between w-[65%] h-[538px] rounded-[16px] bg-[#FFFFFF] px-11 py-7">
                    <img className="absolute top-0 right-0" src="/svgs/Union.svg" alt="" />
                    <p className="text-[20px]">About Us</p>
                    <div>
                        <div className="flex w-12 h-12 bg-[#151515] rounded-[4px]"><ArrowUpRight className="m-auto" color="white" /></div>
                        <h2 className="text-[40px] w-[342px]">We believe great design is like a <span className="text-[#9a9a9a]">good joke!</span></h2>
                    </div>
                </GalaxyHoverCard>
                <GalaxyHoverCard radius={100} className="flex flex-col justify-between flex-1 rounded-[16px] bg-[#FFFFFF] px-5 py-8">
                    <img className="absolute top-0 right-0" src="/svgs/Glob.svg" alt="" />

                    <p className="text-[18px]">At Orbit Digital Agency <br /> (ODA)</p>
                    <div className=" w-[347px]">

                        <h2 className="text-[24px]">We believe great design is like a good joke!</h2>
                        <p className="text-[16px] text-neutral-600 ">We help you figure out what to say, how to say it, and how to make people actually care.</p>
                    </div>
                </GalaxyHoverCard>
            </div>

        </section>
    )
}