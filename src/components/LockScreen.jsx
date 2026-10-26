import { useEffect, useRef, useState } from 'react'
import { animate, motion, useMotionValue, useMotionValueEvent, useScroll, useTransform } from 'motion/react'
import { Icon } from './Icon.jsx'
import { DevEmoji } from './DevEmoji.jsx'
import { links, roles } from '../data.js'
import { IDLE, useLanded } from '../useLanded.js'
import { play, useSfxEnabled, useSfxReady } from '../sfx.js'

const ext = { target: '_blank', rel: 'noopener noreferrer' }
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// iOS-style spring: smooth, no wobble
const smooth = { type: 'spring', stiffness: 110, damping: 20, mass: 0.9 }

// Types each role, holds, deletes it, then moves to the next.
function useTyped(words) {
  const [text, setText] = useState(() => (reducedMotion() ? words.join(', ') : ''))

  useEffect(() => {
    if (reducedMotion()) return
    let word = 0
    let len = 0
    let deleting = false
    let timer

    const tick = () => {
      const current = words[word]
      setText(current.slice(0, len))
      let wait = deleting ? 40 : 85
      if (!deleting && len === current.length) {
        deleting = true
        wait = 1500
      } else if (deleting && len === 0) {
        deleting = false
        word = (word + 1) % words.length
        wait = 300
      } else {
        len += deleting ? -1 : 1
      }
      timer = setTimeout(tick, wait)
    }
    tick()
    return () => clearTimeout(timer)
  }, [words])

  return text
}

const fmtTime = (d) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).replace(/\s?[AP]M/i, '')
const fmtDate = (d) => d.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })

function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

// Activity-ring style widget: the ring draws itself when it appears.
function Ring({ value, big, label, delay }) {
  const r = 37
  return (
    <motion.div
      className="ring-widget"
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ ...smooth, delay }}
    >
      <svg viewBox="0 0 84 84" aria-hidden="true">
        <circle cx="42" cy="42" r={r} className="ring-track" />
        <motion.circle
          cx="42"
          cy="42"
          r={r}
          className="ring-bar"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: value }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: delay + 0.25 }}
        />
      </svg>
      <b>{big}</b>
      <small>{label}</small>
    </motion.div>
  )
}

// The hero is an iPhone lock screen: live clock, notification, widgets, shortcuts.
// It plays its intro again every time you scroll back to it, and eases away as you swipe up.
export function LockScreen() {
  const typed = useTyped(roles)
  const soundOn = useSfxEnabled()
  const soundReady = useSfxReady()
  const now = useClock()
  const ref = useRef(null)
  const [run, setRun] = useState(0)

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) setRun((r) => r + 1)
    })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  // the notification chimes as it drops in, once the screen has settled (silent until the visitor
  // has tapped once)
  const landed = useLanded(ref, { amount: 0.5, idle: IDLE.moment })
  useEffect(() => {
    if (!landed) return
    const t = setTimeout(() => play('notify'), 650)
    return () => clearTimeout(t)
  }, [landed])

  // "Replay" in the footer: wake the lock screen up again from scratch
  useEffect(() => {
    const replay = () => setRun((r) => r + 1)
    window.addEventListener('replay-intro', replay)
    return () => window.removeEventListener('replay-intro', replay)
  }, [])

  // Swipe up to open: the lock screen follows your finger, then either flies away (open) or
  // springs back. Past ~1/5 of the screen, or a quick flick, opens it.
  const dragY = useMotionValue(0)
  const pull = 420
  const dragOpacity = useTransform(dragY, [0, -pull], [1, 0.12])
  const dragScale = useTransform(dragY, [0, -pull], [1, 0.93])
  const unlockP = useTransform(dragY, [0, -pull], [0, 1], { clamp: true })
  const opening = useRef(false)

  // the wallpaper blurs as you pull, like the real unlock
  useMotionValueEvent(unlockP, 'change', (v) => document.documentElement.style.setProperty('--unlock', v.toFixed(3)))

  const unlock = async () => {
    if (opening.current) return
    opening.current = true
    play('whoosh')
    await animate(dragY, -window.innerHeight, { type: 'spring', stiffness: 130, damping: 24, mass: 0.9 })
    const next = document.getElementById('about')
    window.scrollTo({ top: next.offsetTop - 20, behavior: 'instant' })
    setTimeout(() => {
      dragY.set(0)
      opening.current = false
    }, 250)
  }

  const onDragEnd = (_, info) => {
    if (info.offset.y < -window.innerHeight * 0.2 || info.velocity.y < -600) unlock()
    else animate(dragY, 0, { type: 'spring', stiffness: 320, damping: 30 })
  }

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, -110])
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9])

  return (
    <section id="home" className="lock" ref={ref}>
      <h1 className="sr-only">Brajendra: developer, YouTuber and tech creator</h1>
      <motion.div className="lock-scroll" style={{ y, opacity, scale }}>
        <motion.div
          key={run}
          className="lock-inner"
          drag="y"
          dragConstraints={{ top: -pull * 3, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.2 }}
          dragMomentum={false}
          onDragEnd={onDragEnd}
          style={{ y: dragY, opacity: dragOpacity, scale: dragScale }}
        >
        <div className="lock-body">
          <motion.p
            className="lock-date"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 0.85, y: 0 }}
            transition={{ ...smooth, delay: 0.15 }}
          >
            {fmtDate(now)}
          </motion.p>
          <motion.p
            className="lock-time"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 90, damping: 18, mass: 1, delay: 0.05 }}
          >
            {fmtTime(now)}
          </motion.p>

          <motion.div
            className="notif lock-notif"
            initial={{ opacity: 0, y: -30, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ ...smooth, delay: 0.55 }}
          >
            <span className="app-icon wave">
              <DevEmoji size={32} />
            </span>
            <span className="notif-text">
              <b>Hi, I'm Brajendra</b>
              <span>
                I'm a <em>{typed}</em>
                <i className="caret" aria-hidden="true" />
              </span>
            </span>
            <small>now</small>
          </motion.div>

          <div className="rings">
            <Ring value={0.86} big="7.3M" label="views" delay={0.8} />
            <Ring value={0.64} big="90K+" label="subs" delay={0.92} />
            <Ring value={0.5} big="50+" label="projects" delay={1.04} />
          </div>

          {soundOn && !soundReady && (
            <motion.button
              className="sound-prompt"
              data-sfx="none"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
            >
              <Icon name="solar:volume-loud-linear" size={16} /> Tap for sound
            </motion.button>
          )}
        </div>

        <div className="lock-foot">
          <motion.a
            href={links.github}
            className="round-btn"
            aria-label="GitHub"
            data-sfx="toggle"
            {...ext}
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...smooth, delay: 1 }}
            whileTap={{ scale: 0.88 }}
          >
            <Icon name="simple-icons:github" size={22} />
          </motion.a>

          <motion.a
            href="#about"
            className="swipe"
            data-sfx="none"
            onClick={(e) => {
              e.preventDefault()
              unlock()
            }}
            aria-label="Swipe up to open"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...smooth, delay: 1.1 }}
          >
            <motion.span
              className="swipe-arrow"
              animate={{ y: [0, -6, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Icon name="solar:alt-arrow-down-linear" size={20} className="up" />
            </motion.span>
            <span className="shimmer">Swipe up to open</span>
            <i className="home-bar" />
          </motion.a>

          <motion.a
            href={links.instagram}
            className="round-btn"
            aria-label="Instagram"
            data-sfx="shutter"
            {...ext}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...smooth, delay: 1 }}
            whileTap={{ scale: 0.88 }}
          >
            <Icon name="simple-icons:instagram" size={22} />
          </motion.a>
        </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
