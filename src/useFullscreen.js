import { useEffect } from 'react'

// On phones the site goes full screen by itself. Browsers only allow that after a touch, so it
// happens on the visitor's first tap or swipe (Android Chrome and most mobile browsers). iPhone
// Safari has no full-screen API for web pages: there, "Add to Home Screen" opens the site full
// screen through the manifest. Already installed (standalone) or exited by the visitor: left alone.
export function useFullscreen() {
  useEffect(() => {
    const phone = matchMedia('(pointer: coarse)').matches && Math.min(screen.width, screen.height) < 820
    const standalone = matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches
    const root = document.documentElement
    if (!phone || standalone || !document.fullscreenEnabled || !root.requestFullscreen) return

    const events = ['touchend', 'pointerup', 'click']
    const stop = () => events.forEach((n) => document.removeEventListener(n, enter, true))
    function enter() {
      stop() // one attempt only: if the visitor leaves full screen, it stays left
      root.requestFullscreen({ navigationUI: 'hide' }).catch(() => {})
      try {
        screen.orientation?.lock?.('portrait').catch(() => {})
      } catch {
        // not supported
      }
    }
    events.forEach((n) => document.addEventListener(n, enter, { capture: true }))
    return stop
  }, [])
}
