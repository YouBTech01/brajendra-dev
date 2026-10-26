import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Icon } from './Icon.jsx'
import { LargeTitle } from './Type.jsx'
import { CountUp } from './HomeScreen.jsx'
import { social } from '../data.js'
import { playAsync } from '../sfx.js'
import { IDLE, useLanded } from '../useLanded.js'

const ext = { target: '_blank', rel: 'noopener noreferrer' }
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

// Social stats as a stack of iOS notification banners. Once the section has landed, they arrive
// one by one: each banner drops in with its own ping and the next one only appears when that
// ping has finished.
export function Social() {
  const ref = useRef(null)
  const landed = useLanded(ref, { amount: 0.5, idle: IDLE.moment })
  const [shown, setShown] = useState(0)

  useEffect(() => {
    if (!landed) {
      const t = setTimeout(() => setShown(0), 350)
      return () => clearTimeout(t)
    }
    let cancelled = false
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ;(async () => {
      for (let i = 1; i <= social.length; i++) {
        if (cancelled) return
        setShown(i)
        if (reduce) continue
        await playAsync('ping')
        await wait(0)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [landed])

  return (
    <section id="social" className="section">
      <div className="container narrow">
        <LargeTitle>Social</LargeTitle>
        <div className="notif-stack" ref={ref}>
          {social.map((s, i) =>
            i < shown ? (
              <motion.a
                key={s.name}
                href={s.url}
                className="notif"
                {...ext}
                initial={{ opacity: 0, y: -46, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="app-icon" style={{ background: s.bg }}>
                  <Icon name={s.icon} size={24} />
                </span>
                <span className="notif-text">
                  <span className="notif-app">{s.name}</span>
                  {s.to ? (
                    <span>
                      <b>
                        <CountUp to={s.to} suffix={s.suffix} quiet />
                      </b>{' '}
                      {s.unit}
                    </span>
                  ) : (
                    <span>{s.text}</span>
                  )}
                </span>
                <small>now</small>
              </motion.a>
            ) : (
              <span key={s.name} className="notif-slot" aria-hidden="true" />
            ),
          )}
        </div>
      </div>
    </section>
  )
}
