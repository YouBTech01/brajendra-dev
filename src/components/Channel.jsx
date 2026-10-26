import { useCallback, useEffect, useRef, useState } from 'react'
import { animate, useMotionValue } from 'motion/react'
import { sm } from '../sm.jsx'
import { Icon } from './Icon.jsx'
import { LargeTitle } from './Type.jsx'
import { GitHubScreen, InstagramScreen, TelegramScreen, YouTubeScreen } from './SocialScreens.jsx'
import { play } from '../sfx.js'

const screens = [
  { id: 'youtube', label: 'YouTube', Screen: YouTubeScreen },
  { id: 'instagram', label: 'Instagram', Screen: InstagramScreen },
  { id: 'telegram', label: 'Telegram', Screen: TelegramScreen },
  { id: 'github', label: 'GitHub', Screen: GitHubScreen },
]
const N = screens.length
const wrap = (i) => ((i % N) + N) % N
// signed distance from the active screen, going the short way round (this is what makes it infinite)
const offsetOf = (i, active) => {
  const d = wrap(i - active)
  return d > N / 2 ? d - N : d
}

const pose = (o, gap) => {
  if (o === 0) return { x: 0, scale: 1, rotateY: 0, opacity: 1, zIndex: 3 }
  if (Math.abs(o) === 1) return { x: o * gap, scale: 0.82, rotateY: -o * 22, opacity: 0.6, zIndex: 2 }
  return { x: 0, scale: 0.62, rotateY: 0, opacity: 0, zIndex: 1 } // waiting behind the phone
}

// Your channels as a coverflow of phone screens: the active app sits in the middle, the
// previous and next ones peek out behind it on both sides. Swipe, drag, use the arrows or tap
// a side phone to switch. It loops forever. Touch-friendly on Android and iOS, mouse on desktop.
export function Channel() {
  const [active, setActive] = useState(0)
  const [gap, setGap] = useState(230)
  const stage = useRef(null)
  const dragX = useMotionValue(0)
  const panning = useRef(false)

  const current = useRef(0)

  const go = useCallback((to) => {
    const next = wrap(to)
    if (next === current.current) return
    current.current = next
    setActive(next)
    play('swipe2')
  }, [])

  // side phones sit far enough out to peek on wide screens, and close in on narrow ones
  useEffect(() => {
    const measure = () => {
      const el = stage.current
      const card = el?.querySelector('.deck-card')
      if (!card) return
      const cw = card.offsetWidth
      setGap(el.clientWidth < cw * 1.5 ? cw * 0.8 : cw * 0.68)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(stage.current)
    return () => ro.disconnect()
  }, [])

  const onPan = (_, info) => {
    panning.current = true
    dragX.set(info.offset.x * 0.45) // the stack follows the finger a little
  }
  const onPanEnd = (_, info) => {
    animate(dragX, 0, { type: 'spring', stiffness: 260, damping: 28 })
    if (info.offset.x < -50 || info.velocity.x < -400) go(active + 1)
    else if (info.offset.x > 50 || info.velocity.x > 400) go(active - 1)
    setTimeout(() => (panning.current = false), 60)
  }

  return (
    <section id="channel" className="section">
      <div className="container narrow wide-ish">
        <LargeTitle>Channel</LargeTitle>
      </div>

      <sm.div
        className="deck"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        landSound={{ name: 'whoosh', delay: 100, vol: 0.55 }}
        transition={{ type: 'spring', stiffness: 110, damping: 20, mass: 0.9 }}
      >
        <sm.div
          className="deck-stage"
          ref={stage}
          role="group"
          aria-roledescription="carousel"
          aria-label="My social channels. Swipe left or right."
          tabIndex={0}
          onPan={onPan}
          onPanEnd={onPanEnd}
          onClickCapture={(e) => panning.current && (e.preventDefault(), e.stopPropagation())}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') go(active + 1)
            if (e.key === 'ArrowLeft') go(active - 1)
          }}
        >
          <sm.div className="deck-drag" style={{ x: dragX }}>
            {screens.map(({ id, label, Screen }, i) => {
              const o = offsetOf(i, active)
              const isActive = o === 0
              return (
                <sm.div
                  key={id}
                  className={`deck-card ${isActive ? 'is-active' : 'side'}`}
                  initial={false}
                  animate={pose(o, gap)}
                  transition={{ type: 'spring', stiffness: 170, damping: 24, mass: 0.9 }}
                  aria-hidden={isActive ? undefined : true}
                  inert={isActive ? undefined : true}
                >
                  <Screen />
                  {Math.abs(o) === 1 && (
                    <button className="deck-hit" tabIndex={-1} aria-label={`Show ${label}`} data-sfx="none" onClick={() => go(i)} />
                  )}
                </sm.div>
              )
            })}
          </sm.div>
        </sm.div>

        <button className="deck-arrow prev" aria-label="Previous channel" data-sfx="none" onClick={() => go(active - 1)}>
          <Icon name="solar:alt-arrow-right-linear" size={22} />
        </button>
        <button className="deck-arrow next" aria-label="Next channel" data-sfx="none" onClick={() => go(active + 1)}>
          <Icon name="solar:alt-arrow-right-linear" size={22} />
        </button>

        <div className="deck-dots" role="tablist" aria-label="Channels">
          {screens.map((s, i) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={active === i}
              aria-label={s.label}
              data-sfx="none"
              className={active === i ? 'on' : ''}
              onClick={() => go(i)}
            />
          ))}
        </div>
        <p className="deck-hint">Swipe left or right</p>
      </sm.div>
    </section>
  )
}
