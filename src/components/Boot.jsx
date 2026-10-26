import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { endBoot } from '../boot.js'
import { preload, sfxProgress, sfxStore } from '../sfx.js'

const MIN = 1100 // never flash past: the logo is always seen
const MAX = 20000 // only a safety net: take as long as the page needs

const loadImage = (src) =>
  new Promise((done) => {
    const img = new Image()
    img.onload = img.onerror = () => done()
    img.src = src
    img.decode?.().then(done, done)
  })

// iPhone style boot: black screen, the brand logo, and a thin loading line. While it fills, the
// sound effects are fetched and decoded and the fonts and images are loaded, so the moment it
// lifts every section can animate and play smoothly without waiting on anything.
export function Boot() {
  const [show, setShow] = useState(true)
  const [p, setP] = useState(0)

  useEffect(() => {
    document.documentElement.classList.add('booting')
    preload()
    const t0 = performance.now()
    const parts = { fonts: 0, imgs: 0, page: 0 }
    let pages = 0 // fonts + images + page load, 0..1
    const bump = (k) => {
      parts[k] = 1
      pages = (parts.fonts + parts.imgs + parts.page) / 3
    }
    document.fonts?.ready.then(() => bump('fonts'), () => bump('fonts'))
    Promise.all([loadImage(`${import.meta.env.BASE_URL}brand/logo.webp`), ...[...document.images].map((i) => loadImage(i.currentSrc || i.src))]).then(() => bump('imgs'))
    if (document.readyState === 'complete') bump('page')
    else addEventListener('load', () => bump('page'), { once: true })

    // Warm-up: once everything is fetched, scroll the whole page top to bottom behind the black
    // screen. That makes the browser lay out, paint, rasterise and decode every section, and run
    // every animation once (silently), so nothing has to be prepared later while you scroll.
    let warm = 0 // 0..1
    let warming = false
    let warmDone = false
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
    const frames = (n) =>
      new Promise((r) => {
        const f = () => (n-- > 0 ? requestAnimationFrame(f) : r())
        f()
      })
    const warmUp = async () => {
      const step = window.innerHeight * 0.75
      const max = document.documentElement.scrollHeight - window.innerHeight
      for (let y = 0; y < max + step; y += step) {
        scrollTo({ top: Math.min(y, max), behavior: 'instant' })
        warm = Math.min(y / max, 1) * 0.95
        await frames(2)
        await sleep(160) // long enough for each section's animation to start once
      }
      scrollTo({ top: 0, behavior: 'instant' })
      await frames(3)
      await sleep(250) // sections leave view and reset, ready to play again for real
      warm = 1
      warmDone = true
    }

    let raf = 0
    let finished = false
    const tick = () => {
      const [done, total] = sfxProgress()
      const loaded = 0.6 * (total ? done / total : 1) + 0.4 * pages // fetch and decode
      if (loaded >= 1 && !warming) {
        warming = true
        // the scroll-through warm-up is for desktops: on phones it would raster every section
        // at once and exhaust GPU memory, which is what causes the broken blocks
        if (matchMedia('(pointer: coarse)').matches) {
          warm = 1
          warmDone = true
        } else warmUp()
      }
      const real = 0.55 * loaded + 0.45 * warm
      const elapsed = performance.now() - t0
      // the line also advances with time so it always moves smoothly, but never past the real progress
      setP(Math.min(real, 0.05 + elapsed / MIN))
      if (((warmDone && elapsed >= MIN) || elapsed >= MAX) && !finished) {
        finished = true
        scrollTo({ top: 0, behavior: 'instant' })
        setP(1)
        setTimeout(() => setShow(false), 250)
      }
      if (!finished) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    const un = sfxStore.subscribe(() => {})
    return () => {
      cancelAnimationFrame(raf)
      un()
    }
  }, [])

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.documentElement.classList.remove('booting')
        endBoot()
        // hero starts its intro now that the screen is revealed
        window.dispatchEvent(new Event('replay-intro'))
      }}
    >
      {show && (
        <motion.div
          className="boot"
          role="status"
          aria-label="Loading"
          exit={{ opacity: 0, scale: 1.06 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.img
            src={`${import.meta.env.BASE_URL}brand/logo.webp`}
            alt=""
            className="boot-logo"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
          <span className="boot-bar" aria-hidden="true">
            <i style={{ transform: `scaleX(${p})` }} />
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
