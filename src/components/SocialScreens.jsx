import { useState } from 'react'

import { sm } from '../sm.jsx'
import { Icon } from './Icon.jsx'
import { CountUp } from './HomeScreen.jsx'
import { links } from '../data.js'
import './screens.css'

const ext = { target: '_blank', rel: 'noopener noreferrer' }

// The You B Tech brand logo, used as the circular profile picture on every platform
function Logo() {
  return <img className="logo-img" src="/brand/logo.webp" width="96" height="96" alt="You B Tech logo" decoding="async" />
}

function StatusBar() {
  return (
    <div className="sb" aria-hidden="true">
      <b>9:41</b>
      <span className="sb-icons">
        <i className="sb-signal" />
        <i className="sb-wifi" />
        <i className="sb-batt" />
      </span>
    </div>
  )
}

const rise = (i) => ({
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, amount: 0.2 },
  transition: { type: 'spring', stiffness: 120, damping: 20, delay: 0.1 + i * 0.07 },
})

/* ---------------------------------- YouTube ---------------------------------- */
const ytChips = ['AI App Development', 'Android', 'Flutter', 'Websites', 'AI Coding Tools', 'Walkthroughs']

export function YouTubeScreen() {
  const [tab, setTab] = useState(0)
  const [chip, setChip] = useState(0)
  return (
    <article className="screen yt" aria-label="YouTube channel: You B Tech">
      <StatusBar />
      <header className="app-bar">
        <Icon name="solar:arrow-left-linear" size={22} />
        <span />
        <Icon name="solar:magnifer-linear" size={22} />
        <Icon name="solar:menu-dots-bold" size={22} />
      </header>

      <div className="yt-banner" aria-hidden="true">
        <i />
        <i />
      </div>

      <div className="yt-id">
        <span className="yt-avatar">
          <Logo />
        </span>
        <sm.div {...rise(0)}>
          <h3>You B Tech</h3>
          <p>
            @You_B_Tech
          </p>
          <p className="yt-subs">
            <Icon name="solar:users-group-rounded-linear" size={14} />
            <CountUp to={90000} suffix="+" /> subscribers
          </p>
          <p className="more">Programming tutorials and tech content.</p>
        </sm.div>
      </div>

      <sm.div className="yt-actions" {...rise(1)}>
        <a href={links.youtube} className="yt-sub" data-sfx="pop" {...ext}>
          Subscribe
        </a>
        <a href={links.youtube} className="yt-bell" aria-label="Notifications" {...ext}>
          <Icon name="solar:bell-linear" size={20} />
        </a>
      </sm.div>

      <div className="yt-tabs" role="tablist" aria-label="Channel tabs">
        {['Home', 'Videos', 'Shorts', 'Playlists', 'About'].map((t, i) => (
          <span key={t} role="tab" data-sfx="select" aria-selected={tab === i} className={tab === i ? 'on' : ''} onClick={() => setTab(i)}>
            {t}
          </span>
        ))}
      </div>

      <div className="yt-chips">
        {ytChips.map((c, i) => (
          <span key={c} data-sfx="select" aria-pressed={chip === i} className={chip === i ? 'on' : ''} onClick={() => setChip(i)}>
            {c}
          </span>
        ))}
      </div>

      <sm.a href={links.youtube} className="yt-feature" data-sfx="pop" {...ext} {...rise(2)}>
        <span className="yt-thumb" aria-hidden="true">
          <i />
          <i />
          <span className="yt-play">
            <Icon name="solar:play-bold" size={26} />
          </span>
        </span>
        <span className="yt-meta">
          <b>
            <CountUp to={7362860} /> total views
          </b>
          <small>Watch tutorials on You B Tech</small>
        </span>
      </sm.a>

      <nav className="app-nav yt-nav" aria-hidden="true">
        <span className="on">
          <Icon name="solar:home-2-linear" size={22} />
          <small>Home</small>
        </span>
        <span>
          <Icon name="solar:clapperboard-play-linear" size={22} />
          <small>Shorts</small>
        </span>
        <span className="plus">
          <Icon name="solar:add-circle-linear" size={34} />
        </span>
        <span>
          <Icon name="solar:layers-minimalistic-linear" size={22} />
          <small>Subs</small>
        </span>
        <span>
          <Icon name="solar:user-circle-linear" size={22} />
          <small>You</small>
        </span>
      </nav>
    </article>
  )
}

/* --------------------------------- Instagram --------------------------------- */
const highlights = [
  ['solar:smartphone-linear', 'Apps'],
  ['solar:cpu-bolt-linear', 'AI'],
  ['logos:flutter-icon', 'Flutter'],
  ['solar:global-linear', 'Web'],
]
const grid = [
  ['solar:code-linear', '#0a84ff'],
  ['solar:cpu-bolt-linear', '#bf5af2'],
  ['logos:flutter-icon', '#40c8e0'],
  ['solar:cart-large-2-linear', '#ff9f0a'],
  ['solar:smartphone-linear', '#30d158'],
  ['solar:pallete-2-linear', '#ff375f'],
  ['solar:global-linear', '#5e5ce6'],
  ['solar:play-circle-linear', '#ff453a'],
  ['solar:rocket-2-linear', '#0a84ff'],
]

export function InstagramScreen() {
  const [tab, setTab] = useState(0)
  return (
    <article className="screen ig" aria-label="Instagram profile: you_b_tech">
      <StatusBar />
      <header className="app-bar ig-top">
        <span className="ig-user">
          <Icon name="solar:lock-linear" size={14} />
          <b>you_b_tech</b>
        </span>
        <Icon name="solar:add-circle-linear" size={24} />
        <Icon name="solar:hamburger-menu-linear" size={24} />
      </header>

      <div className="ig-head">
        <span className="ig-ring">
          <span className="ig-avatar">
            <Logo />
          </span>
        </span>
        <div className="ig-stats">
          <span>
            <b>
              <CountUp to={50} suffix="+" />
            </b>
            <small>followers</small>
          </span>
          <span>
            <b>50+</b>
            <small>projects</small>
          </span>
        </div>
      </div>

      <sm.div className="ig-bio" {...rise(0)}>
        <b>You B Tech</b>
        <span className="muted">Digital creator</span>
        <span>Project and development updates.</span>
        <a href={links.website} className="ig-link" {...ext}>
          <Icon name="solar:link-round-linear" size={13} /> ybtshop.com
        </a>
      </sm.div>

      <sm.div className="ig-actions" {...rise(1)}>
        <a href={links.instagram} className="ig-follow" data-sfx="pop" {...ext}>
          Follow
        </a>
        <a href={links.instagram} className="ig-msg" {...ext}>
          Message
        </a>
        <span className="ig-add" aria-hidden="true">
          <Icon name="solar:user-plus-linear" size={18} />
        </span>
      </sm.div>

      <div className="ig-hl" aria-hidden="true">
        {highlights.map(([ic, label]) => (
          <span key={label}>
            <i>
              <Icon name={ic} size={22} />
            </i>
            <small>{label}</small>
          </span>
        ))}
      </div>

      <div className="ig-tabs" role="tablist" aria-label="Profile tabs">
        {['solar:widget-4-linear', 'solar:clapperboard-play-linear', 'solar:user-circle-linear'].map((ic, i) => (
          <span key={ic} role="tab" data-sfx="select" aria-selected={tab === i} className={tab === i ? 'on' : ''} onClick={() => setTab(i)}>
            <Icon name={ic} size={22} />
          </span>
        ))}
      </div>

      <div className="ig-grid" aria-hidden="true">
        {grid.map(([ic, c], i) => (
          <sm.i
            key={i}
            style={{ '--c': c }}
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            transition={{ delay: 0.15 + i * 0.04, type: 'spring', stiffness: 180, damping: 18 }}
          >
            <Icon name={ic} size={26} />
          </sm.i>
        ))}
      </div>

      <nav className="app-nav ig-nav" aria-hidden="true">
        <Icon name="solar:home-2-linear" size={24} />
        <Icon name="solar:magnifer-linear" size={24} />
        <Icon name="solar:add-circle-linear" size={24} />
        <Icon name="solar:clapperboard-play-linear" size={24} />
        <span className="ig-me">
          <Logo />
        </span>
      </nav>
    </article>
  )
}

/* --------------------------------- Telegram --------------------------------- */
export function TelegramScreen() {
  return (
    <article className="screen tg" aria-label="Telegram channel: You B Tech">
      <StatusBar />
      <header className="tg-top">
        <Icon name="solar:arrow-left-linear" size={22} />
        <span className="tg-avatar">
          <Logo />
        </span>
        <span className="tg-title">
          <b>You B Tech</b>
          <small>
            <CountUp to={11000} suffix="+" /> subscribers
          </small>
        </span>
        <Icon name="solar:menu-dots-bold" size={22} />
      </header>

      <div className="tg-chat">
        <span className="tg-date">Today</span>

        <sm.div className="tg-msg" {...rise(0)}>
          <p>
            <b>Welcome to You B Tech</b>
          </p>
          <p>Tutorials, projects and tech content for developers.</p>
          <span className="tg-time">
            <Icon name="solar:eye-linear" size={11} /> 9:41
          </span>
        </sm.div>

        <sm.div className="tg-msg" {...rise(1)}>
          <p>Building apps? Join the coding group and ask anything.</p>
          <span className="tg-time">
            <Icon name="solar:eye-linear" size={11} /> 9:42
          </span>
        </sm.div>
        <sm.a href={links.telegramCoding} className="tg-inline" data-sfx="pop" {...ext} {...rise(2)}>
          <Icon name="simple-icons:telegram" size={14} /> Coding group
        </sm.a>
      </div>

      <a href={links.telegram} className="tg-join" data-sfx="pop" {...ext}>
        Join channel
      </a>
      <i className="home-bar" aria-hidden="true" />
    </article>
  )
}

/* ---------------------------------- GitHub ---------------------------------- */
export function GitHubScreen() {
  return (
    <article className="screen gh" aria-label="GitHub profile: YouBTech01">
      <StatusBar />
      <header className="app-bar gh-top">
        <Icon name="solar:hamburger-menu-linear" size={22} />
        <Icon name="simple-icons:github" size={26} />
        <Icon name="solar:bell-linear" size={22} />
      </header>

      <div className="gh-id">
        <span className="gh-avatar">
          <Logo />
        </span>
        <sm.div {...rise(0)}>
          <h3>YouBTech01</h3>
          <p className="muted gh-tags"><Icon name="solar:code-linear" size={13} /> Developer <Icon name="solar:play-circle-linear" size={13} /> YouTuber</p>
        </sm.div>
      </div>

      <sm.p className="gh-bio" {...rise(1)}>
        Developer, YouTuber and app builder. More projects and open contributions.
      </sm.p>

      <sm.a href={links.github} className="gh-follow" data-sfx="pop" {...ext} {...rise(2)}>
        Follow
      </sm.a>

      <sm.ul className="gh-meta" {...rise(3)}>
        <li>
          <Icon name="solar:users-group-two-rounded-linear" size={16} />
          <b>
            <CountUp to={550} suffix="+" />
          </b>{' '}
          followers
        </li>
        <li>
          <Icon name="solar:map-point-linear" size={16} /> Madhya Pradesh, India
        </li>
        <li>
          <Icon name="solar:link-round-linear" size={16} /> ybtshop.com
        </li>
      </sm.ul>

      <sm.div className="gh-list" {...rise(4)}>
        <a href={links.repos} {...ext}>
          <Icon name="solar:book-bookmark-linear" size={20} />
          <span>Repositories</span>
          <Icon name="solar:alt-arrow-right-linear" size={16} />
        </a>
        <a href={links.github} {...ext}>
          <Icon name="solar:user-circle-linear" size={20} />
          <span>Profile</span>
          <Icon name="solar:alt-arrow-right-linear" size={16} />
        </a>
      </sm.div>

      <nav className="app-nav gh-nav" aria-hidden="true">
        <span className="on">
          <Icon name="solar:home-2-linear" size={22} />
          <small>Home</small>
        </span>
        <span>
          <Icon name="solar:bell-linear" size={22} />
          <small>Inbox</small>
        </span>
        <span>
          <Icon name="solar:compass-big-linear" size={22} />
          <small>Explore</small>
        </span>
        <span>
          <Icon name="solar:user-circle-linear" size={22} />
          <small>Profile</small>
        </span>
      </nav>
    </article>
  )
}
