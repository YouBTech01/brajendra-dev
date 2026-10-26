import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Icon } from './Icon.jsx'
import { DevEmoji } from './DevEmoji.jsx'
import { LargeTitle } from './Type.jsx'
import { connect, links } from '../data.js'
import { play } from '../sfx.js'
import { IDLE, useLanded } from '../useLanded.js'

const ext = { target: '_blank', rel: 'noopener noreferrer' }
const lines = ['Hey! I\'m Brajendra.', 'Got an app idea or want to collaborate?']

function Typing() {
  return (
    <motion.div
      className="bubble in typing"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.6 }}
      style={{ originX: 0 }}
    >
      <i />
      <i />
      <i />
    </motion.div>
  )
}

// Contact as an iMessage thread: typing dots, two messages, then tap-to-reply bubbles.
export function Messages() {
  const ref = useRef(null)
  const inView = useLanded(ref, { amount: 0.5, idle: IDLE.moment })
  const [step, setStep] = useState(0) // 0 idle, 1 typing, 2 first, 3 typing, 4 second, 5 replies

  useEffect(() => {
    if (!inView) {
      const reset = setTimeout(() => setStep(0), 400)
      return () => clearTimeout(reset)
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const times = reduce ? [0, 0, 0, 0, 0] : [300, 1300, 1900, 3000, 3600]
    const sounds = ['typing', 'receive', 'typing', 'receive', null]
    const timers = times.map((t, i) =>
      setTimeout(() => {
        setStep(i + 1)
        if (sounds[i]) play(sounds[i])
      }, t),
    )
    return () => timers.forEach(clearTimeout)
  }, [inView])

  return (
    <section id="contact" className="section">
      <div className="container narrow" ref={ref}>
        <LargeTitle>Contact</LargeTitle>

        <div className="card messages">
          <header className="msg-head">
            <span className="msg-avatar">
              <DevEmoji size={38} />
            </span>
            <b>Brajendra</b>
            <small>iMessage</small>
          </header>

          <div className="msg-body" aria-live="polite">
            {lines.map((l, i) =>
              step >= (i + 1) * 2 ? (
                <motion.div
                  key={l}
                  className="bubble in"
                  initial={{ opacity: 0, scale: 0.6, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                  style={{ originX: 0 }}
                >
                  {l}
                </motion.div>
              ) : null,
            )}
            <AnimatePresence>{(step === 1 || step === 3) && <Typing key="t" />}</AnimatePresence>
            {step >= 5 && (
              <div className="replies">
                {connect.map((c, i) => (
                  <motion.a
                    key={c.label}
                    href={c.url}
                    className="bubble out"
                    data-sfx="send"
                    {...ext}
                    initial={{ opacity: 0, scale: 0.5, x: 30 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 18, delay: i * 0.1 }}
                    whileTap={{ scale: 0.94 }}
                    style={{ originX: 1 }}
                  >
                    <Icon name={c.icon} size={16} /> {c.label}
                  </motion.a>
                ))}
              </div>
            )}
          </div>

          <a href={links.instagram} className="msg-input"
            data-sfx="send" {...ext}>
            <span>iMessage</span>
            <i>
              <Icon name="solar:arrow-right-up-linear" size={16} />
            </i>
          </a>
        </div>
      </div>
    </section>
  )
}
