const DESIGN_VIEWPORT = 1440;
const MIN_VIEWPORT = 375;
const MAX_VIEWPORT = 1920;

export function fluid(px, { min = MIN_VIEWPORT, max = MAX_VIEWPORT, base = DESIGN_VIEWPORT, minPx, maxPx } = {}) {
    const lo = minPx ?? +(px * (min / base)).toFixed(3);
    const hi = maxPx ?? +(px * (max / base)).toFixed(3);
    const vw = +((px / base) * 100).toFixed(4);
    return `clamp(${lo}px, ${vw}vw, ${hi}px)`;
}

export function fluidValue(px, viewportWidth, { min = MIN_VIEWPORT, max = MAX_VIEWPORT, base = DESIGN_VIEWPORT, minPx, maxPx } = {}) {
    const lo = minPx ?? px * (min / base);
    const hi = maxPx ?? px * (max / base);
    const raw = px * (viewportWidth / base);
    return Math.min(Math.max(raw, lo), hi);
}