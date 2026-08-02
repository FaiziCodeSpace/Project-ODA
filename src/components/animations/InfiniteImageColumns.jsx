// src/components/animations/InfiniteImageColumns.jsx
"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import gsap from "gsap";

const COLUMNS = [
    ["1-1", "1-2", "1-3"],
    ["2-1", "2-2", "2-3"],
    ["3-1", "3-2", "3-3"],
];

const BASE_IMAGE_WIDTH = 515;
const BASE_IMAGE_HEIGHT = 354;
const ASPECT = BASE_IMAGE_WIDTH / BASE_IMAGE_HEIGHT;

// ---- Responsive layout — tweak these ----
// columns: how many of the COLUMNS entries actually render at this size.
// width: rendered image width in px; height is derived from ASPECT so the
// images never look stretched. Matches Phase3's sm(640)/lg(1024) breakpoints.
const LAYOUT_BY_BREAKPOINT = {
    mobile: { columns: 1, width: 300 },  // 375px and up
    tablet: { columns: 2, width: 340 },  // 640px and up
    desktop: { columns: 3, width: BASE_IMAGE_WIDTH }, // 1024px and up — original size
};

const getBreakpoint = (width) => {
    if (width >= 1024) return "desktop";
    if (width >= 640) return "tablet";
    return "mobile";
};

const InfiniteImageColumns = forwardRef(function InfiniteImageColumns(
    { className = "" },
    ref
) {
    const gridRef = useRef(null);
    const trackRefs = useRef([]);
    const tweens = useRef([]);
    const isRunningRef = useRef(false);

    const [breakpoint, setBreakpoint] = useState(() =>
        typeof window !== "undefined" ? getBreakpoint(window.innerWidth) : "desktop"
    );

    useEffect(() => {
        const handleResize = () => {
            const next = getBreakpoint(window.innerWidth);
            setBreakpoint((prev) => (prev === next ? prev : next));
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const { columns, width: imageWidth } = LAYOUT_BY_BREAKPOINT[breakpoint];
    const imageHeight = Math.round(imageWidth / ASPECT);
    const visibleColumns = COLUMNS.slice(0, columns);

    // (Re)builds the tween for one column. Kill-without-touching-y means a
    // rebuild — whether from startLoop or a dimension change — always
    // continues from wherever the track currently sits, never resets to 0.
    const buildOne = (i, track) => {
        const distance = track.scrollHeight / 2;
        if (!distance) return; // not laid out yet

        tweens.current[i]?.kill();

        tweens.current[i] = gsap.to(track, {
            y: `-=${distance}`,
            duration: 20 + i * 4,
            ease: "none",
            repeat: -1,
            modifiers: {
                y: gsap.utils.unitize((y) => parseFloat(y) % distance),
            },
        });

        // Rebuilding for a resize shouldn't start playback on its own —
        // only keep it running if the loop was already running.
        if (!isRunningRef.current) {
            tweens.current[i].pause();
        }
    };

    useImperativeHandle(ref, () => ({
        el: gridRef.current,
        startLoop: () => {
            isRunningRef.current = true;
            trackRefs.current.forEach((track, i) => {
                if (!track) return;
                if (tweens.current[i] && tweens.current[i].isActive()) return;
                buildOne(i, track);
            });
        },
        stopLoop: () => {
            // freeze in place — no reset, so reversing never jumps
            isRunningRef.current = false;
            tweens.current.forEach((tw) => tw?.pause());
        },
    }));

    // Dimensions/column count change with the breakpoint, so any tween
    // built against the old track height has a stale wrap distance —
    // rebuild it. Columns that disappeared at this breakpoint get their
    // tween killed; columns that just (re)appeared while the loop is
    // running get picked up too.
    useEffect(() => {
        trackRefs.current.forEach((track, i) => {
            if (!track) {
                tweens.current[i]?.kill();
                tweens.current[i] = null;
                return;
            }
            if (tweens.current[i] || isRunningRef.current) {
                buildOne(i, track);
            }
        });
    }, [breakpoint]);

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
                gridTemplateColumns: `repeat(${columns}, ${imageWidth}px)`,
                columnGap: "var(--column-gap, 0px)",
                height: "100%",
            }}
        >
            {visibleColumns.map((images, colIndex) => (
                <div
                    key={colIndex}
                    className="relative h-full overflow-hidden"
                    style={{ width: imageWidth }}
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
                                width={imageWidth}
                                height={imageHeight}
                                className="object-cover shrink-0"
                                style={{ width: imageWidth, height: imageHeight }}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
});

export default InfiniteImageColumns;