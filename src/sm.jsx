import { forwardRef, useCallback, useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { IDLE, useLanded } from './useLanded.js'
import { play } from './sfx.js'

// Drop-in for `motion.*` whose `whileInView` waits until the element has *landed* (mostly on
// screen and the page has stopped scrolling) instead of firing on the first visible pixel.
// Leaving the screen resets it, so it replays on every visit. Elements without `whileInView`
// render as plain motion elements and cost nothing extra.
function build(tag) {
  const M = motion[tag]

  const Gated = forwardRef(function Gated({ whileInView, viewport, initial, landSound, watch, ...rest }, fwd) {
    const ref = useRef(null)
    const set = useCallback(
      (n) => {
        ref.current = n
        if (typeof fwd === 'function') fwd(n)
        else if (fwd) fwd.current = n
      },
      [fwd],
    )
    const on = useLanded(ref, { amount: viewport?.amount ?? 'some', root: viewport?.root,
      watch,
      idle: viewport?.root ? IDLE.snap : IDLE.reveal,
    })
    // `landSound` ({ name, delay ms, vol }) plays with this element's animation, once per visit
    useEffect(() => {
      if (!on || !landSound) return
      const { name, delay = 0, ...o } = landSound
      const t = setTimeout(() => play(name, { prio: 1, ...o }), delay)
      return () => clearTimeout(t)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [on])
    return <M ref={set} initial={initial} animate={on ? whileInView : (initial ?? 'hidden')} {...rest} />
  })

  return forwardRef(function Settled({ landSound, watch, ...props }, fwd) {
    return props.whileInView === undefined ? <M ref={fwd} {...props} /> : <Gated ref={fwd} landSound={landSound} watch={watch} {...props} />
  })
}

const cache = {}
export const sm = new Proxy({}, { get: (_, tag) => (cache[tag] ??= build(tag)) })
