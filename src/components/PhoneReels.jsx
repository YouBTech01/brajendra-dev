import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { sm } from '../sm.jsx'
import { Icon } from './Icon.jsx'
import { CountUp } from './HomeScreen.jsx'
import { links, moreProjects, projects } from '../data.js'
import { play } from '../sfx.js'
import { scrollToTarget } from '../useSmoothScroll.js'

const ext = { target: '_blank', rel: 'noopener noreferrer' }
const total = projects.length + 1 // the last reel points to the YouTube channel
const floaters = [
  ['solar:code-linear', '8%', '18%', 0],
  ['solar:cpu-bolt-linear', '84%', '26%', 1],
  ['solar:smartphone-linear', '12%', '70%', 2],
  ['solar:rocket-2-linear', '86%', '74%', 3],
]
const popIn = {
  hidden: { scale: 0.3, rotate: -30, opacity: 0 },
  show: { scale: 1, rotate: 0, opacity: 1, transition: { type: 'spring', stiffness: 180, damping: 12 } },
}

function Burst() {
  return (
    <sm.span
      className="burst"
      initial={{ scale: 0.4, opacity: 1 }}
      animate={{ scale: 2.2, opacity: 0 }}
      transition={{ duration: 0.6 }}
    />
  )
}

// One GitHub project as a reel: language logo, name, short description, stats and a clear
// "View on GitHub" button, plus like / open / share on the right rail.
function RepoReel({ p, i, root, liked, onLike, onShare }) {
  const view = { root, amount: 0.6 }
  return (
    <article
      className="reel"
      aria-roledescription="slide"
      aria-label={`${i + 1} of ${total}: ${p.name}`}
      style={{ '--r': `${i * 24}deg`, '--lang': p.color }}
    >
      <div className="reel-bg" aria-hidden="true">
        <i />
        <i />
      </div>

      <sm.div className="reel-center" initial="hidden" whileInView="show" viewport={view} aria-hidden="true">
        <sm.span className="reel-tile" variants={popIn}>
          <span className="reel-halo" />
          <sm.span animate={{ y: [0, -6, 0] }} transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}>
            <Icon name={p.logo} size={58} />
          </sm.span>
        </sm.span>
      </sm.div>

      <sm.div
        className="reel-caption"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={view}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h3>{p.name}</h3>
        <p>{p.description}</p>
        <ul className="reel-meta">
          <li>
            <i className="lang-dot" aria-hidden="true" /> {p.language}
          </li>
          <li aria-label={`${p.stars} stars`}>
            <Icon name="solar:star-linear" size={14} /> {p.stars}
          </li>
          <li aria-label={`${p.forks} forks`}>
            <Icon name="solar:branching-paths-up-linear" size={14} /> {p.forks}
          </li>
        </ul>
        <a className="reel-cta" href={p.url} data-sfx="select" {...ext}>
          <Icon name="simple-icons:github" size={16} /> View on GitHub
        </a>
      </sm.div>

      <div className="reel-rail" role="group" aria-label={`Actions for ${p.name}`}>
        <sm.button
          aria-label={liked ? `Unlike ${p.name}` : `Like ${p.name}`}
          aria-pressed={liked}
          data-sfx="like"
          whileTap={{ scale: 0.8 }}
          onClick={onLike}
          className={liked ? 'liked' : ''}
        >
          <Icon name={liked ? 'solar:heart-bold' : 'solar:heart-linear'} size={28} />
          <AnimatePresence>{liked && <Burst key="b" />}</AnimatePresence>
        </sm.button>
        <a href={p.url} aria-label={`Open ${p.name} on GitHub`} data-sfx="select" {...ext}>
          <Icon name="solar:code-linear" size={28} />
        </a>
        <sm.button aria-label={`Share ${p.name}`} data-sfx="none" whileTap={{ scale: 0.85 }} onClick={onShare}>
          <Icon name="solar:share-linear" size={26} />
        </sm.button>
      </div>
    </article>
  )
}

// The last reel: the rest of the projects live on the YouTube channel.
function MoreReel({ root }) {
  const view = { root, amount: 0.6 }
  return (
    <article
      className="reel reel-more"
      aria-roledescription="slide"
      aria-label={`${total} of ${total}: more projects on YouTube`}
      style={{ '--r': '200deg' }}
    >
      <div className="reel-bg" aria-hidden="true">
        <i />
        <i />
      </div>

      <sm.div className="reel-center" initial="hidden" whileInView="show" viewport={view} aria-hidden="true">
        <sm.span className="reel-tile yt" variants={popIn}>
          <span className="reel-halo" />
          <Icon name="simple-icons:youtube" size={58} />
        </sm.span>
      </sm.div>

      <sm.div
        className="reel-caption centered"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={view}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h3 className="reel-big">
          <CountUp to={moreProjects.count} suffix="+" /> projects
        </h3>
        <p>{moreProjects.line}</p>
        <a className="reel-cta yt" href={links.youtube} data-sfx="pop" {...ext}>
          <Icon name="simple-icons:youtube" size={16} /> Watch on YouTube
        </a>
        <a className="reel-link" href={links.repos} data-sfx="select" {...ext}>
          or browse all repositories
          <Icon name="solar:arrow-right-up-linear" size={14} />
        </a>
        {/* on a phone the page edges beside the reel are tiny: this carries on down the page */}
        <button
          className="reel-next"
          data-sfx="swipe"
          onClick={() => scrollToTarget(document.getElementById('channel'), { duration: 1.3 })}
        >
          <Icon name="solar:alt-arrow-down-linear" size={20} />
          <span>Keep scrolling</span>
        </button>
      </sm.div>
    </article>
  )
}

// Projects inside an iPhone: swipe / scroll one project at a time, Instagram Reels style
// (snap, not smooth). At the first and last slide the page scrolls on as normal.
export function PhoneReels() {
  const ref = useRef(null)
  const [active, setActive] = useState(0)
  const [liked, setLiked] = useState({})
  const [toast, setToast] = useState('')
  const toastTimer = useRef(0)

  const jump = useCallback((i) => {
    const el = ref.current
    el.scrollTo({ top: Math.max(0, Math.min(total - 1, i)) * el.clientHeight, behavior: 'instant' })
  }, [])

  useEffect(() => {
    const el = ref.current
    let locked = false
    let last = 0

    const onWheel = (e) => {
      if (Math.abs(e.deltaY) < 8) return
      const next = Math.round(el.scrollTop / el.clientHeight) + (e.deltaY > 0 ? 1 : -1)
      if (next < 0 || next >= total) return
      e.preventDefault()
      if (locked) return
      locked = true
      el.scrollTo({ top: next * el.clientHeight, behavior: 'instant' })
      setTimeout(() => (locked = false), 650)
    }
    const onScroll = () => {
      const i = Math.round(el.scrollTop / el.clientHeight)
      if (i !== last) {
        // forward swipes and back swipes get their own whoosh; the last slide chimes
        play(i === total - 1 ? 'notify' : i > last ? 'swipe' : 'swipe2', { prio: 2 })
        last = i
        setActive(i)
      }
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => () => clearTimeout(toastTimer.current), [])

  const say = (msg) => {
    setToast(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 1800)
  }

  // native share sheet on phones, copied link everywhere else
  const share = async (p) => {
    try {
      if (navigator.share) {
        await navigator.share({ title: p.name, text: p.description, url: p.url })
      } else {
        await navigator.clipboard.writeText(p.url)
        play('pop')
        say('Link copied')
      }
    } catch {
      // share sheet dismissed
    }
  }

  const onKeyDown = (e) => {
    const step = { ArrowDown: 1, PageDown: 1, ArrowUp: -1, PageUp: -1 }[e.key]
    if (!step) return
    const next = active + step
    if (next < 0 || next >= total) return
    e.preventDefault()
    jump(next)
  }

  return (
    <section id="projects" className="reels-section" aria-labelledby="projects-title">
      <h2 id="projects-title" className="sr-only">
        Projects
      </h2>

      {floaters.map(([icon, x, y, i]) => (
        <sm.span
          key={icon}
          className="floater app-icon"
          style={{ left: x, top: y }}
          animate={{ y: [0, -18, 0], rotate: [0, i % 2 ? 8 : -8, 0] }}
          transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          <Icon name={icon} size={26} />
        </sm.span>
      ))}

      <sm.div
        className="phone"
        initial={{ opacity: 0, y: 80, rotateX: 12 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        landSound={{ name: 'open', delay: 150 }}
        transition={{ type: 'spring', stiffness: 70, damping: 18, mass: 1 }}
      >
        <i className="phone-btn b1" />
        <i className="phone-btn b2" />
        <i className="phone-btn b3" />
        <i className="phone-btn b4" />

        <div className="phone-screen">
          <span className="phone-island" aria-hidden="true" />
          <div className="story-bars" aria-hidden="true">
            {Array.from({ length: total }, (_, i) => (
              <span key={i} className={i <= active ? 'on' : ''} />
            ))}
          </div>

          <div
            className="reels"
            ref={ref}
            data-lenis-prevent
            tabIndex={0}
            role="region"
            aria-label="Project reels. Use the up and down arrow keys or swipe."
            onKeyDown={onKeyDown}
          >
            {projects.map((p, i) => (
              <RepoReel
                key={p.repo}
                p={p}
                i={i}
                root={ref}
                liked={!!liked[i]}
                onLike={() => setLiked((l) => ({ ...l, [i]: !l[i] }))}
                onShare={() => share(p)}
              />
            ))}
            <MoreReel root={ref} />
          </div>

          <AnimatePresence>
            {active === 0 && (
              <sm.div
                className="swipe-hint"
                aria-hidden="true"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 1.2 }}
              >
                <sm.span animate={{ y: [0, -6, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}>
                  <Icon name="solar:alt-arrow-down-linear" size={18} className="flip" />
                </sm.span>
              </sm.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {toast && (
              <sm.div
                className="reel-toast"
                role="status"
                initial={{ opacity: 0, y: 14, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8 }}
              >
                <Icon name="solar:check-circle-bold" size={16} /> {toast}
              </sm.div>
            )}
          </AnimatePresence>

          <i className="home-bar light" aria-hidden="true" />
        </div>
      </sm.div>

      <div className="reels-dots" role="tablist" aria-label="Project slides">
        {Array.from({ length: total }, (_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={active === i}
            aria-label={i < projects.length ? projects[i].name : 'More on YouTube'}
            data-sfx="none"
            className={active === i ? 'on' : ''}
            onClick={() => jump(i)}
          />
        ))}
      </div>
    </section>
  )
}
