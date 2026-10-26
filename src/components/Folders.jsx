import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, useDragControls } from 'motion/react'
import { sm } from '../sm.jsx'
import { Icon } from './Icon.jsx'
import { LargeTitle } from './Type.jsx'
import { CountUp } from './HomeScreen.jsx'
import { levels, skills } from '../data.js'
import { play } from '../sfx.js'

// Skills as iOS home-screen folders. Tapping one slides up an iOS bottom sheet (grabber, rounded
// top corners, drag down to dismiss) with the app icons and a one-line note for each skill.
export function Folders() {
  const [open, setOpen] = useState(null)
  const folder = skills.find((s) => s.title === open)
  const drag = useDragControls()

  const close = () => {
    setOpen(null)
    play('close')
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <section id="skills" className="section">
      <div className="container">
        <LargeTitle>Skills</LargeTitle>

        <div className="folders">
          {skills.map((s, i) => (
            <sm.button
              key={s.title}
              className="folder"
              data-sfx="pop"
              onClick={() => setOpen(s.title)}
              aria-label={`Open ${s.title} folder`}
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ type: 'spring', stiffness: 200, damping: 16, delay: i * 0.12 }}
              landSound={i === 0 ? { name: 'pop', delay: 120 } : undefined}
              whileHover={{ scale: 1.06, y: -4 }}
              whileTap={{ scale: 0.94 }}
            >
              <span className="folder-face card">
                {s.apps.slice(0, 9).map((a) => (
                  <i key={a.name} className="mini">
                    <Icon name={a.icon} size={20} />
                  </i>
                ))}
              </span>
              <span className="folder-name">{s.title}</span>
            </sm.button>
          ))}
        </div>

        <sm.div
          className="card widget levels"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          landSound={{ name: 'whoosh', delay: 150, vol: 0.5 }}
          transition={{ type: 'spring', stiffness: 110, damping: 20 }}
        >
          <span className="widget-label">
            <Icon name="solar:chart-2-linear" size={14} /> Skill levels
          </span>
          <ul>
            {levels.map((l, i) => (
              <li key={l.name}>
                <span className="level-top">
                  <b>{l.name}</b>
                  <small>{l.group}</small>
                  <em>
                    <CountUp to={l.value} suffix="%" quiet />
                  </em>
                </span>
                <span className="bar">
                  <sm.i
                    style={{ background: l.color }}
                    initial={{ width: '0%' }}
                    whileInView={{ width: l.value + '%' }}
                    viewport={{ once: false, amount: 0.8 }}
                    transition={{ type: 'spring', stiffness: 40, damping: 16, delay: 0.1 + i * 0.08 }}
                  />
                </span>
              </li>
            ))}
          </ul>
        </sm.div>
      </div>

      {createPortal(
        <AnimatePresence>
          {folder && (
            <sm.div
              className="sheet-backdrop"
              data-lenis-prevent
              onClick={close}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <sm.div
                className="sheet"
                role="dialog"
                aria-modal="true"
                aria-label={`${folder.title} skills`}
                onClick={(e) => e.stopPropagation()}
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', stiffness: 240, damping: 30, mass: 1 }}
                drag="y"
                dragControls={drag}
                dragListener={false}
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={{ top: 0.04, bottom: 0.9 }}
                onDragEnd={(_, info) => {
                  if (info.offset.y > 140 || info.velocity.y > 600) close()
                }}
              >
                <div className="sheet-handle" onPointerDown={(e) => drag.start(e)}>
                  <i className="grabber" aria-hidden="true" />
                  <header>
                    <h3>{folder.title}</h3>
                    <button className="sheet-close" data-sfx="none" onClick={close} aria-label="Done">
                      <Icon name="solar:close-linear" size={20} />
                    </button>
                  </header>
                </div>

                <div className="sheet-scroll" data-lenis-prevent>
                  <div className="sheet-apps">
                    {folder.apps.map((a, i) => (
                      <sm.span
                        key={a.name}
                        className="sheet-app"
                        initial={{ opacity: 0, y: 24, scale: 0.7 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.18 + i * 0.05 }}
                      >
                        <i className="app-tile">
                          <Icon name={a.icon} size={34} />
                        </i>
                        <small>{a.name}</small>
                      </sm.span>
                    ))}
                  </div>
                  <ul className="sheet-notes">
                    {folder.notes.map(([name, text]) => (
                      <li key={name}>
                        <b>{name}</b>
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </sm.div>
            </sm.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </section>
  )
}
