// src/components/animations/InfiniteImageColumns.jsx
"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import gsap from "gsap";

const COLUMNS = [
    ["1-1", "1-2", "1-3"],
    ["2-1", "2-2", "2-3"],
    ["3-1", "3-2", "3-3"],
];

const IMAGE_WIDTH = 515;
const IMAGE_HEIGHT = 354;

const InfiniteImageColumns = forwardRef(function InfiniteImageColumns(
    { className = "" },
    ref
) {
    const gridRef = useRef(null);
    const trackRefs = useRef([]);
    const tweens = useRef([]);

    useImperativeHandle(ref, () => ({
        el: gridRef.current,
        startLoop: () => {
            trackRefs.current.forEach((track, i) => {
                if (!track) return;
                if (tweens.current[i] && tweens.current[i].isActive()) return;

                const distance = track.scrollHeight / 2;

                // kill the old tween WITHOUT touching y — track stays
                // exactly where it was frozen
                tweens.current[i]?.kill();

                // "-=distance" is relative to the CURRENT y, so this
                // continues from the frozen position, never resets to 0
                tweens.current[i] = gsap.to(track, {
                    y: `-=${distance}`,
                    duration: 20 + i * 4,
                    ease: "none",
                    repeat: -1,
                    modifiers: {
                        // re-wraps every frame instead of snapping once
                        // per lap — this is what makes it seamless
                        y: gsap.utils.unitize((y) => parseFloat(y) % distance),
                    },
                });
            });
        },
        stopLoop: () => {
            // freeze in place — no reset, so reversing never jumps
            tweens.current.forEach((tw) => tw?.pause());
        },
    }));

    useEffect(() => {
        return () => {
            tweens.current.forEach((tw) => tw?.kill());
        };
    }, []);

    return (
        <div
            ref={gridRef}
            className={`grid ${className}`}
            style={{
                gridTemplateColumns: `repeat(${COLUMNS.length}, ${IMAGE_WIDTH}px)`,
                columnGap: "var(--column-gap, 0px)",
                height: "100%",
            }}
        >
            {COLUMNS.map((images, colIndex) => (
                <div
                    key={colIndex}
                    className="relative h-full overflow-hidden"
                    style={{ width: IMAGE_WIDTH }}
                >
                    <div
                        ref={(el) => (trackRefs.current[colIndex] = el)}
                        className="flex flex-col"
                        style={{ gap: "var(--row-gap, 0px)" }}
                    >
                        {[...images, ...images].map((name, i) => (
                            <img
                                key={i}
                                src={`/images/${name}.png`}
                                alt={name}
                                width={IMAGE_WIDTH}
                                height={IMAGE_HEIGHT}
                                className="object-cover shrink-0"
                                style={{ width: IMAGE_WIDTH, height: IMAGE_HEIGHT }}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
});

export default InfiniteImageColumns;