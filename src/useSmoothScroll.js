import { useEffect } from 'react'
import Lenis from 'lenis'

let lenis = null

// Scrolls with the page's inertial feel (falls back to the browser when Lenis is off).
export function scrollToTarget(target, { immediate = false, duration = 1.4, offset = -20 } = {}) {
  if (lenis) return lenis.scrollTo(target, { immediate, duration, offset })
  const top = typeof target === 'number' ? target : (target?.getBoundingClientRect().top ?? 0) + scrollY + offset
  window.scrollTo({ top, behavior: immediate ? 'instant' : 'smooth' })
}

// iPhone-like inertial page scrolling. Skipped for reduced motion; touch devices keep their
// own native momentum. Anything marked data-lenis-prevent (the phone reel) scrolls on its own.
export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, anchors: { offset: -20 } })
    let raf
    const loop = (t) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      lenis = null
    }
  }, [])
}
