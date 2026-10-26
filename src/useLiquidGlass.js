import { useEffect } from 'react'

// Enables the refraction filter in Chromium and tracks the pointer for the glass highlight.
export function useLiquidGlass() {
  useEffect(() => {
    const brands = navigator.userAgentData?.brands ?? []
    // the SVG refraction filter is for desktop Chromium: on phones it is heavy and glitches
    if (!matchMedia('(pointer: coarse)').matches && brands.some((b) => b.brand === 'Chromium')) document.documentElement.classList.add('lg-refract')

    const onMove = (e) => {
      const el = e.target.closest?.('.fnav, .card, .btn')
      if (!el) return
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${e.clientX - r.left}px`)
      el.style.setProperty('--my', `${e.clientY - r.top}px`)
    }
    document.addEventListener('pointermove', onMove)
    return () => document.removeEventListener('pointermove', onMove)
  }, [])
}
