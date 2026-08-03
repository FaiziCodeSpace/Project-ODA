'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initLenis, destroyLenis } from '@/lib/lenis'

export default function LenisProvider({ children }) {
  useEffect(() => {
    const lenis = initLenis()

    lenis.on('scroll', ScrollTrigger.update)

    const update = (time) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0) // prevents GSAP's lag-catchup from fighting Lenis's own easing

    return () => {
      gsap.ticker.remove(update)
      destroyLenis()
    }
  }, [])

  return children
}