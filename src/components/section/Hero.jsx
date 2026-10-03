"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Phase2 from "../phases/Home/Phase2";
import Phase3 from "../phases/Home/Phase3";
import Phase4 from "../phases/Home/Phase4";
import Phase5 from "../phases/Home/Phase5";
import Phase6 from "../phases/Home/Phase6";
import Phase7 from "../phases/Home/Phase7";
import Phase8 from "../phases/Home/Phase8";

export function Hero() {
    useEffect(() => {

        const frame = requestAnimationFrame(() => {
            ScrollTrigger.refresh();
        });

        return () => cancelAnimationFrame(frame);
    }, []);

    return (
        <main className="relative bg-black">
            <Phase2 />
            <Phase3 />
            <Phase4 />
            <Phase5 />
            <Phase6 />
            <Phase7 />
            <Phase8 />
        </main>
    );
}