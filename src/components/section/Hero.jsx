// src/components/section/Hero.jsx
"use client";

import Phase2 from "../phases/Home/Phase2";
import Phase3 from "../phases/Home/Phase3";
import Phase4 from "../phases/Home/Phase4";
import Phase5 from "../phases/Home/Phase5";
import Phase6 from "../phases/Home/Phase6";

export function Hero() {
    return (
        <main className="bg-black relative">
            <Phase2 />
            <Phase3 />
            <Phase4/>
            <Phase5/>
            <Phase6/>
        </main>
    );
}