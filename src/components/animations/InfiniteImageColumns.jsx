"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import gsap from "gsap";

const COLUMNS = [
    ["1-1", "1-2", "1-3"],
    ["2-1", "2-2", "2-3"],
    ["3-1", "3-2", "3-3"],
];

const REFERENCE_VIEWPORT = 1440;
const MIN_VIEWPORT = 375;
const MAX_VIEWPORT = 1920;

const REFERENCE_IMAGE_WIDTH = 515;
const REFERENCE_IMAGE_HEIGHT = 354;

const fluid = (px) => {
    const vw = (px / REFERENCE_VIEWPORT) * 100;
    const min = (vw / 100) * MIN_VIEWPORT;
    const max = (vw / 100) * MAX_VIEWPORT;
    return `clamp(${min.toFixed(2)}px, ${vw.toFixed(4)}vw, ${max.toFixed(2)}px)`;
};

const IMAGE_WIDTH = fluid(REFERENCE_IMAGE_WIDTH);
const ASPECT_RATIO = `${REFERENCE_IMAGE_WIDTH} / ${REFERENCE_IMAGE_HEIGHT}`;

const InfiniteImageColumns = forwardRef(function InfiniteImageColumns(
    { className = "" },
    ref
) {
    const gridRef = useRef(null);
    const trackRefs = useRef([]);
    const tweens = useRef([]);
    const isRunningRef = useRef(false);

    const buildOne = (i, track, onFirstFrame) => {
        const distance = track.scrollHeight / 2;
        if (!distance) return;

        tweens.current[i]?.kill();

        tweens.current[i] = gsap.to(track, {
            y: `-=${distance}`,
            duration: 20 + i * 4,
            ease: "none",
            repeat: -1,
            modifiers: {
                y: gsap.utils.unitize((y) => parseFloat(y) % distance),
            },
            onStart: i === 0 ? onFirstFrame : undefined,
        });

        if (!isRunningRef.current) {
            tweens.current[i].pause();
        }
    };

    const rebuildAll = () => {
        trackRefs.current.forEach((track, i) => {
            if (!track) return;
            if (tweens.current[i] || isRunningRef.current) {
                buildOne(i, track);
            }
        });
    };

    useImperativeHandle(ref, () => ({
        el: gridRef.current,
        startLoop: (onConfirmSliding) => {
            isRunningRef.current = true;
            trackRefs.current.forEach((track, i) => {
                if (!track) return;
                if (tweens.current[i] && tweens.current[i].isActive()) {
                    if (i === 0) onConfirmSliding?.();
                    return;
                }
                buildOne(i, track, i === 0 ? onConfirmSliding : undefined);
            });
        },
        stopLoop: () => {
            isRunningRef.current = false;
            tweens.current.forEach((tw) => tw?.pause());
        },
    }));

    useEffect(() => {
        let timeout;
        const handleResize = () => {
            clearTimeout(timeout);
            timeout = setTimeout(rebuildAll, 200);
        };
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
            clearTimeout(timeout);
        };
    }, []);

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
                gridTemplateColumns: `repeat(3, ${IMAGE_WIDTH})`,
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
                                width={REFERENCE_IMAGE_WIDTH}
                                height={REFERENCE_IMAGE_HEIGHT}
                                className="w-full shrink-0 object-cover"
                                style={{ aspectRatio: ASPECT_RATIO }}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
});

export default InfiniteImageColumns;