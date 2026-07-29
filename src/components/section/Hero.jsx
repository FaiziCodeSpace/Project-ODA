// src/components/section/Hero.jsx
"use client";

import Phase2 from "../phases/Home/Phase2";
import Phase3 from "../phases/Home/Phase3";

export function Hero() {
    return (
        <main className="bg-black relative">
            <Phase2 />
            <Phase3 />
        </main>
    );
}