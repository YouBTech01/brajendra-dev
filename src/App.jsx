import { MotionConfig } from 'motion/react'
import { Boot } from './components/Boot.jsx'
import { Island } from './components/Island.jsx'
import { LockScreen } from './components/LockScreen.jsx'
import { HomeScreen } from './components/HomeScreen.jsx'
import { Focus } from './components/Focus.jsx'
import { Folders } from './components/Folders.jsx'
import { PhoneReels } from './components/PhoneReels.jsx'
import { Channel } from './components/Channel.jsx'
import { Social } from './components/Social.jsx'
import { Messages } from './components/Messages.jsx'
import { Footer } from './components/Footer.jsx'
import { GlassFilter } from './components/Glass.jsx'
import { MotionBackground } from './components/MotionBackground.jsx'
import { useLiquidGlass } from './useLiquidGlass.js'
import { useSmoothScroll } from './useSmoothScroll.js'
import { useSfx } from './sfx.js'
import { useFullscreen } from './useFullscreen.js'
import './ios.css'
import './liquid-glass.css'

// The whole portfolio is an iPhone: lock screen, home screen widgets, Focus settings, folders,
// an app in a phone, a YouTube channel card, notifications and a message thread, navigated
// from a Dynamic Island.
export default function App() {
  useLiquidGlass()
  useSmoothScroll()
  useSfx()
  useFullscreen()

  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Boot />
      <GlassFilter />
      <MotionBackground />
      <Island />
      <main id="main">
        <LockScreen />
        <HomeScreen />
        <Focus />
        <Folders />
        <PhoneReels />
        <Channel />
        <Social />
        <Messages />
      </main>
      <Footer />
    </MotionConfig>
  )
}
