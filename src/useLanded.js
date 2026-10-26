import { useEffect, useState } from 'react'
import { play } from './sfx.js'

// One shared "when did anything last scroll" clock. Capture mode also hears scrolling inside
// nested scrollers (the project reels), which do not bubble to the window.
let lastScroll = 0
if (typeof window !== 'undefined') {
  window.addEventListener('scroll', () => (lastScroll = performance.now()), { passive: true, capture: true })
}

const ratioOf = (amount) => (amount === 'some' ? 0.01 : amount === 'all' ? 1 : (amount ?? 0.55))

// Settle time is tuned per use instead of one number for everything: `idle` is how long the page
// must be still before the section counts as landed. It only has to outlast the gap between two
// scroll frames, so small reveals use very little (they feel instant) while big moments that
// carry a sound wait a touch longer so they never fire while you are still gliding past:
//   reveals (text, cards, rows)  70 ms     reel slides (snap, no glide)  30 ms
//   section moments with sound  130 ms
export const IDLE = { reveal: 70, snap: 30, moment: 130 }

// True once a section has really *landed*: it is mostly on screen AND nothing has scrolled for
// `idle` ms. It resets when the section leaves, so it fires once per visit. Animations and
// sounds start from this instead of from "first pixel visible", so nothing plays while you are
// still scrolling past: the graphic and its sound begin together, when the section settles.
export function useLanded(ref, { amount = 0.55, idle = IDLE.moment, root, watch } = {}) {
  const [landed, setLanded] = useState(false)

  useEffect(() => {
    const el = watch === 'parent' ? ref.current?.parentElement : ref.current
    if (!el) return
    const rootEl = root && 'current' in root ? root.current : (root ?? null)
    let visible = false
    let timer = 0
    // an element taller than the viewport can never be `amount` visible, so scale the target down
    const viewH = rootEl ? rootEl.clientHeight : window.innerHeight
    const need = Math.min(ratioOf(amount), (viewH * 0.85) / Math.max(el.getBoundingClientRect().height, 1))

    const check = () => {
      if (!visible) return
      if (performance.now() - lastScroll >= idle) setLanded(true)
      else timer = setTimeout(check, 25)
    }

    const io = new IntersectionObserver(
      ([e]) => {
        const now = e.intersectionRatio >= need
        if (now === visible) return
        visible = now
        clearTimeout(timer)
        if (now) timer = setTimeout(check, idle)
        else setLanded(false)
      },
      { root: rootEl, threshold: [0, need, 1] },
    )
    io.observe(el)
    return () => {
      clearTimeout(timer)
      io.disconnect()
    }
  }, [ref, amount, idle, root, watch])

  return landed
}

// Plays a sound once each time the section lands (never while still scrolling to it).
export function useLandSound(ref, name, { amount = 0.5, delay = 0, ...opts } = {}) {
  const landed = useLanded(ref, { amount, idle: IDLE.moment })
  useEffect(() => {
    if (!landed) return
    const t = setTimeout(() => play(name, { prio: 1, ...opts }), delay)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [landed])
}
