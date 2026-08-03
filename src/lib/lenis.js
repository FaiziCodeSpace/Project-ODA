import Lenis from 'lenis'

let lenisInstance = null

export function initLenis() {
  if (lenisInstance) return lenisInstance

  lenisInstance = new Lenis({
    duration: 1.15, // scroll settle time — 1.1-1.3 is the sweet spot, higher feels floaty/laggy
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo-out, classic awwwards feel
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1, // keep at 1, don't amplify wheel input or it feels twitchy
    touchMultiplier: 1.3, // slightly higher for touch since raw touch delta feels sluggish otherwise
    infinite: false,
    autoRaf: false, // important — we drive the raf loop manually via gsap.ticker below
  })

  return lenisInstance
}

export function getLenis() {
  return lenisInstance
}

export function destroyLenis() {
  if (lenisInstance) {
    lenisInstance.destroy()
    lenisInstance = null
  }
}