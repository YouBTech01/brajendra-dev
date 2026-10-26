import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Icon } from './Icon.jsx'
import { nav, social } from '../data.js'
import { play, sfxStore, useSfxEnabled } from '../sfx.js'
import { scrollToTarget } from '../useSmoothScroll.js'
import { useTheme } from '../useTheme.js'
import { startStats, toggleLike, useStats } from '../useStats.js'

const ext = { target: '_blank', rel: 'noopener noreferrer' }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const tourIds = nav.map((n) => n.id)

const fmt = (s) => (s.to ? `${s.to.toLocaleString('en-US')}${s.suffix ?? ''}` : s.text)

// Site footer: brand, section links, social links with live counts, and quick actions:
// Start from Home, Replay (a sleep / wake of the lock screen that re-runs every intro),
// a guided Tour through the sections, plus sound and theme switches.
export function Footer() {
  const sound = useSfxEnabled()
  const { theme, toggle } = useTheme()
  const [touring, setTouring] = useState(false)
  const [asleep, setAsleep] = useState(false)
  const tour = useRef({ timer: 0, step: 0 })
  const stats = useStats()

  useEffect(startStats, [])

  const goHome = () => scrollToTarget(0, { duration: 1.8 })

  const replay = async () => {
    if (asleep) return
    stopTour()
    setAsleep(true)
    play('toggle')
    await sleep(520)
    scrollToTarget(0, { immediate: true })
    window.dispatchEvent(new Event('replay-intro'))
    await sleep(380)
    setAsleep(false)
    await sleep(500)
    play('notify')
  }

  const stopTour = useCallback(() => {
    clearTimeout(tour.current.timer)
    setTouring(false)
  }, [])

  const startTour = () => {
    if (touring) return stopTour()
    tour.current.step = 0
    setTouring(true)
    const next = () => {
      const id = tourIds[tour.current.step]
      const el = document.getElementById(id)
      if (!el) return stopTour()
      play('whoosh', { vol: 0.5 })
      scrollToTarget(id === 'home' ? 0 : el, { duration: 1.6 })
      tour.current.step += 1
      if (tour.current.step >= tourIds.length) {
        tour.current.timer = setTimeout(stopTour, 3200)
      } else {
        tour.current.timer = setTimeout(next, 4200)
      }
    }
    next()
  }

  // any manual scroll / tap / key press ends the tour
  useEffect(() => {
    if (!touring) return
    const halt = (e) => {
      if (e.target.closest?.('[data-tour]')) return
      stopTour()
    }
    const evs = ['wheel', 'touchstart', 'keydown', 'pointerdown']
    evs.forEach((n) => window.addEventListener(n, halt, { passive: true }))
    return () => evs.forEach((n) => window.removeEventListener(n, halt))
  }, [touring, stopTour])

  useEffect(() => () => clearTimeout(tour.current.timer), [])

  return (
    <footer className="site-footer">
      <div className="card foot-card">
        <div className="foot-brand">
          <span className="foot-logo">
            <img src={`${import.meta.env.BASE_URL}brand/logo.webp`} width="64" height="64" alt="" decoding="async" loading="lazy" />
          </span>
          <div>
            <b>
              Brajendra <span className="bkc-chip">BKC</span>
            </b>
            <p>Developer, YouTuber and tech creator from Madhya Pradesh, India.</p>
          </div>
        </div>

        <div className="foot-cols">
          <nav aria-label="Sections">
            <h3>Explore</h3>
            <ul className="foot-links">
              {nav.map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} data-sfx="select">
                    <Icon name={n.icon} size={18} />
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3>Connect</h3>
            <ul className="foot-social">
              {social.map((s) => (
                <li key={s.name}>
                  <a href={s.url} aria-label={`${s.name}: ${fmt(s)}`} {...ext}>
                    <span className="app-icon" style={{ background: s.bg }}>
                      <Icon name={s.icon} size={20} />
                    </span>
                    <span className="foot-soc-text">
                      <b>{s.name}</b>
                      <small>{fmt(s)}</small>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="foot-stats" role="group" aria-label="Site statistics">
          <span className="stat" title="Website views">
            <Icon name="solar:eye-linear" size={18} />
            <b>{stats.views.toLocaleString('en-US')}</b>
            <small>{stats.views === 1 ? 'view' : 'views'}</small>
          </span>
          <button
            className={`stat like${stats.liked ? ' on' : ''}`}
            onClick={toggleLike}
            data-sfx={stats.liked ? 'close' : 'like'}
            aria-pressed={stats.liked}
            aria-label={stats.liked ? 'Remove your like' : 'Like this website'}
          >
            <motion.span key={String(stats.liked)} initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 12 }}>
              <Icon name={stats.liked ? 'solar:heart-bold' : 'solar:heart-linear'} size={18} />
            </motion.span>
            <b>{stats.likes.toLocaleString('en-US')}</b>
            <small>{stats.likes === 1 ? 'like' : 'likes'}</small>
          </button>
        </div>

        <div className="foot-actions" role="group" aria-label="Quick actions">
          <button className="foot-btn primary" onClick={goHome} data-sfx="whoosh">
            <Icon name="solar:arrow-up-linear" size={18} /> Start from Home
          </button>
          <button className="foot-btn" onClick={replay} data-sfx="none">
            <Icon name="solar:restart-linear" size={18} /> Replay
          </button>
          <button className="foot-btn" onClick={startTour} data-tour data-sfx="none" aria-pressed={touring}>
            <Icon name={touring ? 'solar:stop-circle-linear' : 'solar:play-circle-linear'} size={18} />
            {touring ? 'Stop tour' : 'Play tour'}
          </button>
          <button className="foot-btn icon" onClick={sfxStore.toggle} data-sfx="none" aria-pressed={sound} aria-label={sound ? 'Turn sounds off' : 'Turn sounds on'}>
            <Icon name={sound ? 'solar:volume-loud-linear' : 'solar:volume-cross-linear'} size={18} />
          </button>
          <button className="foot-btn icon" onClick={toggle} data-sfx="toggle" aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
            <Icon name={theme === 'dark' ? 'solar:sun-2-linear' : 'solar:moon-linear'} size={18} />
          </button>
        </div>

        <p className="foot-copy">
          <i className="home-bar" aria-hidden="true" />
          © 2026 Brajendra
        </p>
      </div>

      <AnimatePresence>
        {asleep && (
          <motion.div
            className="sleep"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </AnimatePresence>
    </footer>
  )
}
