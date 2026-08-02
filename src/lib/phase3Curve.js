// src/lib/phase3Curve.js

export const PEAK_Y = 0;
export const PEAK_X = 0.5;
export const CP1_X = 0;
export const CP2_X = 0.2;
export const CP3_X = 0.8;
export const CP4_X = 1;

export const CORNER_DEPTH_BY_BREAKPOINT = {
    mobile: 0.05,
    tablet: 0.08,
    desktop: 0.1,
};

export const getBreakpoint = (width) => {
    if (width >= 1024) return "desktop";
    if (width >= 640) return "tablet";
    return "mobile";
};

export const curvePath = (cornerY, peakY) =>
    `M 0,${cornerY} C ${CP1_X},${cornerY} ${CP2_X},${peakY} ${PEAK_X},${peakY} C ${CP3_X},${peakY} ${CP4_X},${cornerY} 1,${cornerY} L 1,1 L 0,1 Z`;

const lerp = (a, b, t) => a + (b - a) * t;

export const flattenPeakToCorner = (cornerY, progress) =>
    curvePath(cornerY, lerp(PEAK_Y, cornerY, progress));