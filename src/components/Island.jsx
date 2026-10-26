import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Icon } from './Icon.jsx'
import { nav } from '../data.js'
import { useTheme } from '../useTheme.js'
import { play, sfxStore, useSfxEnabled } from '../sfx.js'

// Navigation as an iPhone Dynamic Island: a small live pill showing the current section,
// which morphs open into an app-style launcher with an iOS appearance switch.
export function Island() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('home')
  const [openWidth, setOpenWidth] = useState(360)
  const { theme, toggle } = useTheme()
  const sound = useSfxEnabled()
  const ref = useRef(null)
  const [away, setAway] = useState(false)
  const awayNow = useRef(false)

  // the reel phone has its own Dynamic Island, so ours slides up out of the way and returns after
  useEffect(() => {
    const el = document.getElementById('projects')
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        const hide = e.intersectionRatio > 0.35
        if (hide !== awayNow.current) play('swipe', { vol: 0.8 }) // one swipe away, one swipe back
        awayNow.current = hide
        setAway(hide)
        if (hide) setOpen(false)
      },
      { threshold: [0, 0.2, 0.35, 0.5, 0.75, 1] },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    nav.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return
    const close = () => {
      setOpen(false)
      play('close')
    }
    const onKey = (e) => e.key === 'Escape' && close()
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && close()
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [open])

  const current = nav.find((n) => n.id === active) ?? nav[0]

  return (
    <div className="island-wrap">
      <motion.div
        ref={ref}
        className={`island ${open ? 'is-open' : ''} ${away ? 'is-away' : ''}`}
        inert={away || undefined}
        initial={{ y: -60, opacity: 0 }}
        animate={{
          y: away ? -90 : 0,
          opacity: away ? 0 : 1,
          width: open ? openWidth : 182,
          height: open ? 324 : 38,
          borderRadius: open ? 34 : 22,
        }}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {!open ? (
            <motion.button
              key="closed"
              className="island-live"
              data-sfx="open"
              aria-label="Open navigation"
              aria-expanded="false"
              onClick={() => {
                setOpenWidth(Math.min(window.innerWidth * 0.92, 372))
                setOpen(true)
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
            >
              <Icon name={current.icon} size={16} />
              <span>{current.label}</span>
              <span className="eq" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
            </motion.button>
          ) : (
            <motion.div
              key="open"
              className="island-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, delay: 0.08 }}
            >
              <nav className="island-grid" aria-label="Primary">
                {nav.map((n, i) => (
                  <motion.a
                    key={n.id}
                    href={`#${n.id}`}
                    className={active === n.id ? 'on' : ''}
                    data-sfx="select"
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 + i * 0.04 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <span className="tile">
                      <Icon name={n.icon} size={24} />
                    </span>
                    <small>{n.label}</small>
                  </motion.a>
                ))}
              </nav>
              <button
                className="island-switch"
                role="switch"
                aria-checked={theme === 'dark'}
                data-sfx="toggle"
                onClick={toggle}
              >
                <span>
                  <Icon name={theme === 'dark' ? 'solar:moon-linear' : 'solar:sun-2-linear'} size={18} />
                  {theme === 'dark' ? 'Dark' : 'Light'} appearance
                </span>
                <i className="switch" data-on={theme === 'dark'}>
                  <motion.b layout transition={{ type: 'spring', stiffness: 600, damping: 32 }} />
                </i>
              </button>
              <button
                className="island-switch"
                role="switch"
                aria-checked={sound}
                data-sfx="none"
                onClick={sfxStore.toggle}
              >
                <span>
                  <Icon name={sound ? 'solar:volume-loud-linear' : 'solar:volume-cross-linear'} size={18} />
                  Sounds
                </span>
                <i className="switch" data-on={sound}>
                  <motion.b layout transition={{ type: 'spring', stiffness: 600, damping: 32 }} />
                </i>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
