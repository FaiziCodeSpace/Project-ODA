export const PEAK_Y = 0;
export const PEAK_X = 0.5;
export const CP1_X = 0;
export const CP2_X = 0.2;
export const CP3_X = 0.8;
export const CP4_X = 1;

const MIN_VIEWPORT_WIDTH = 375;
const MAX_VIEWPORT_WIDTH = 1440;
const MIN_CORNER_DEPTH = 0.05;
const MAX_CORNER_DEPTH = 0.1;

const clamp01 = (t) => Math.min(1, Math.max(0, t));
const lerp = (a, b, t) => a + (b - a) * t;

export const getCornerDepth = (width) => {
    const t = (width - MIN_VIEWPORT_WIDTH) / (MAX_VIEWPORT_WIDTH - MIN_VIEWPORT_WIDTH);
    return lerp(MIN_CORNER_DEPTH, MAX_CORNER_DEPTH, clamp01(t));
};

export const curvePath = (cornerY, peakY) =>
    `M 0,${cornerY} C ${CP1_X},${cornerY} ${CP2_X},${peakY} ${PEAK_X},${peakY} ` +
    `C ${CP3_X},${peakY} ${CP4_X},${cornerY} 1,${cornerY} L 1,1 L 0,1 Z`;

export const flattenPeakToCorner = (cornerY, progress) =>
    curvePath(cornerY, lerp(PEAK_Y, cornerY, clamp01(progress)));