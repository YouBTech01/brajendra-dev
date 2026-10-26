import { useEffect, useSyncExternalStore } from 'react'
import { isBooting } from './boot.js'

// UI sound effects (from the course-video SFX library, normalised into /public/sfx).
// Web Audio gives instant, overlap-friendly playback. Browsers keep audio locked until the
// visitor's first tap, click or key press, so the page shows a "Tap for sound" cue until then.
// There is also an on/off switch in the Dynamic Island.
const BASE = `${import.meta.env.BASE_URL}sfx/`
const KEY = 'sfx'

// per-sound loudness on top of the normalised files
const volume = {
  open: 0.5,
  pop: 0.55,
  close: 0.4,
  click: 0.45,
  select: 0.4,
  toggle: 0.5,
  whoosh: 0.7,
  swipe: 0.5,
  swipe2: 0.55,
  like: 0.6,
  send: 0.5,
  receive: 0.35,
  typing: 0.25,
  shutter: 0.6,
  tick: 0.32,
  done: 0.5,
  notify: 0.5,
  ping: 0.6,
}

let enabled = true
try {
  enabled = localStorage.getItem(KEY) !== 'off'
} catch {
  // storage blocked: default on
}

let ctx = null
let ready = false // audio is unlocked and running
const raw = {} // fetched file bytes
const buffers = {} // decoded audio
const listeners = new Set()
const emit = () => listeners.forEach((fn) => fn())

// start fetching early so the first tap already has its sound
let preloaded = false
let failed = 0
export const preload = () => {
  if (preloaded) return
  preloaded = true
  ensureCtx()
  Object.keys(volume).forEach((name) => {
    fetch(`${BASE}${name}.wav`)
      .then((r) => r.arrayBuffer())
      .then((b) => {
        raw[name] = b
        if (ctx) decode(name)
      })
      .catch(() => {
        failed++
        emit()
      })
  })
}

// how many of the sound files are decoded and ready (failed ones count as done, never block)
export const sfxProgress = () => [Object.keys(buffers).length + failed, Object.keys(volume).length]

const decode = (name) => {
  if (!raw[name] || buffers[name]) return
  const bytes = raw[name]
  raw[name] = null
  ctx.decodeAudioData(
    bytes,
    (buf) => {
      buffers[name] = buf
      emit()
    },
    () => {
      failed++
      emit()
    },
  )
}

function ensureCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC({ latencyHint: 'interactive' })
    ctx.onstatechange = () => {
      const now = ctx.state === 'running'
      if (now !== ready) {
        ready = now
        emit()
      }
    }
    Object.keys(raw).forEach(decode)
  }
  return ctx
}

const ensure = () => {
  if (!ensureCtx()) return null
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

// ---------------------------------------------------------------------------------------------
// One voice at a time. A single "channel" holds the sound that is playing. A new sound never
// overlaps it and never lands right on its tail:
//   - lower or equal priority while the channel is busy: dropped (play) or queued (playAsync)
//   - higher priority (a tap or swipe the visitor just made): cuts the current sound short with
//     a 30 ms fade, so interaction feedback is never late
// priority: 0 ambient (counter ticks, typing), 1 section / automatic, 2 direct interaction
// ---------------------------------------------------------------------------------------------
const GAP = 0.045 // seconds of silence kept after every sound
let cur = null // { src, gain, end, prio }
let waiters = [] // queued playAsync callers, oldest first

const busy = () => cur && ctx && ctx.currentTime < cur.end

function release() {
  cur = null
  const next = waiters.shift()
  if (next) next()
}

function cut(c) {
  try {
    const t = ctx.currentTime
    c.gain.gain.cancelScheduledValues(t)
    c.gain.gain.setValueAtTime(c.gain.gain.value, t)
    c.gain.gain.linearRampToValueAtTime(0, t + 0.03)
    c.src.stop(t + 0.035)
  } catch {
    // already stopped
  }
}

// starts a sound on the channel and hands back its source node (or null when it can't play)
function start(name, { vol = 1, rate = 1, prio = 1 } = {}) {
  if (!enabled || isBooting()) return null // silent while the boot screen warms the page up
  const c = ensure()
  const buf = buffers[name]
  if (!c || !buf) return null
  if (busy()) {
    if (prio <= cur.prio) return null
    cut(cur)
  }
  const src = c.createBufferSource()
  const gain = c.createGain()
  src.buffer = buf
  src.playbackRate.value = rate * (0.98 + Math.random() * 0.04) // tiny variation, never identical
  gain.gain.value = (volume[name] ?? 0.5) * vol
  src.connect(gain).connect(c.destination)
  const at = c.currentTime + 0.005
  src.start(at)
  const mine = { src, gain, prio, end: at + buf.duration / src.playbackRate.value + GAP }
  if (c.state === 'running') cur = mine // a still-locked context must not hold the channel
  src.onended = () => {
    if (cur === mine) release()
  }
  return src
}

export function play(name, opts) {
  start(name, opts)
}

// Plays a sound and resolves when it has finished. If the channel is busy it waits its turn
// (a sequence like the notification stack never drops or doubles a sound); if the sound can't
// play at all (muted, audio still locked) it resolves after a short beat so nothing stalls.
export function playAsync(name, opts) {
  return new Promise((resolve) => {
    const attempt = () => {
      const src = start(name, { prio: 1, ...opts })
      if (!src) return setTimeout(resolve, 450)
      const ms = (src.buffer.duration / src.playbackRate.value) * 1000
      const done = () => resolve()
      src.addEventListener('ended', done)
      setTimeout(done, ms + 250) // fallback if the context is still waking up
    }
    if (enabled && ctx && busy()) {
      waiters.push(attempt)
      setTimeout(() => {
        const i = waiters.indexOf(attempt)
        if (i > -1) {
          waiters.splice(i, 1)
          attempt()
        }
      }, 2500) // never wait forever
    } else attempt()
  })
}

// Same as play(), but ignores calls closer together than `gap` ms (many counters start at once)
const last = {}
export function playThrottled(name, gap, opts) {
  const now = performance.now()
  if (now - (last[name] ?? -1e9) < gap) return
  last[name] = now
  play(name, { prio: 0, ...opts })
}

export const sfxStore = {
  subscribe(fn) {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },
  get: () => enabled,
  getReady: () => ready,
  toggle() {
    enabled = !enabled
    try {
      localStorage.setItem(KEY, enabled ? 'on' : 'off')
    } catch {
      // ignore
    }
    emit()
    if (enabled) play('toggle')
  },
}

export const useSfxEnabled = () => useSyncExternalStore(sfxStore.subscribe, sfxStore.get)
// false until the visitor has tapped / clicked / pressed a key and audio is actually running
export const useSfxReady = () => useSyncExternalStore(sfxStore.subscribe, sfxStore.getReady)

// Wires the whole page: any link or button plays a sound on click. Give an element
// data-sfx="pop" (etc.) to choose its sound, or data-sfx="none" to stay silent.
export function useSfx() {
  useEffect(() => {
    preload()
    // Touch swipes do not count as a tap, so unlock on every kind of real activation
    // (mouse press, touch end, key press) until audio is running.
    const unlockEvents = ['pointerdown', 'pointerup', 'touchend', 'keydown', 'click']
    const unlock = () => {
      ensure()
      if (ctx && ctx.state !== 'suspended') unlockEvents.forEach((n) => document.removeEventListener(n, unlock, true))
    }
    unlockEvents.forEach((n) => document.addEventListener(n, unlock, { capture: true }))

    const onClick = (e) => {
      const el = e.target.closest?.('[data-sfx], a, button')
      if (!el || el.disabled) return
      const name = el.dataset.sfx ?? 'click'
      if (name !== 'none') play(name, { prio: 2 })
    }
    document.addEventListener('click', onClick, true)
    return () => {
      unlockEvents.forEach((n) => document.removeEventListener(n, unlock, true))
      document.removeEventListener('click', onClick, true)
    }
  }, [])
}
