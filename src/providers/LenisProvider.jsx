'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initLenis, destroyLenis } from '@/lib/lenis'

gsap.registerPlugin(ScrollTrigger)

export default function LenisProvider({ children }) {
  useEffect(() => {
    const lenis = initLenis()

    lenis.on('scroll', ScrollTrigger.update)

    const update = (time) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    document.fonts.ready.then(refresh)

    return () => {
      gsap.ticker.remove(update)
      window.removeEventListener('load', refresh)
      destroyLenis()
    }
  }, [])

  return children
}