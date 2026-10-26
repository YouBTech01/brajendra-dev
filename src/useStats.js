import { useSyncExternalStore } from 'react'

// Site views and likes. The numbers come from the mini JSON database behind /api/stats.
//  - one view is counted per browser session
//  - a visitor can like once, and tap again to take the like back
// Counts are cached in localStorage, so the footer never shows empty, even if the API is slow.
const API = '/api/stats'
const CACHE = 'stats-cache'
const LIKED = 'stats-liked'
const VIEWED = 'stats-viewed'

const read = (store, key) => {
  try {
    return store.getItem(key)
  } catch {
    return null
  }
}
const write = (store, key, value) => {
  try {
    store.setItem(key, value)
  } catch {
    // storage blocked: the page still works, it just forgets
  }
}

let state = { views: 0, likes: 0, liked: false, ready: false }
try {
  const c = JSON.parse(read(localStorage, CACHE) ?? 'null')
  if (c) state = { ...state, views: c.views | 0, likes: c.likes | 0, ready: true }
} catch {
  // ignore a broken cache
}
state.liked = read(localStorage, LIKED) === '1'

const listeners = new Set()
const set = (patch) => {
  state = { ...state, ...patch }
  write(localStorage, CACHE, JSON.stringify({ views: state.views, likes: state.likes }))
  listeners.forEach((fn) => fn())
}

async function call(action) {
  const res = await fetch(
    API,
    action ? { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ action }) } : undefined,
  )
  if (!res.ok) throw new Error(String(res.status))
  return res.json()
}

let started = false
export function startStats() {
  if (started) return
  started = true
  const first = read(sessionStorage, VIEWED) !== '1'
  // the first load of a session counts a view; later loads just read the numbers
  call(first ? 'view' : null)
    .then((d) => {
      if (first) write(sessionStorage, VIEWED, '1')
      set({ views: d.views, likes: d.likes, ready: true })
    })
    .catch(() => {})
  // keep the numbers fresh when the visitor comes back to the tab
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') call(null).then((d) => set({ views: d.views, likes: d.likes }), () => {})
  })
}

let busy = false
export async function toggleLike() {
  if (busy) return
  busy = true
  const liking = !state.liked
  const before = state
  // instant feedback first, then the real number from the database
  set({ liked: liking, likes: Math.max(0, state.likes + (liking ? 1 : -1)) })
  write(localStorage, LIKED, liking ? '1' : '0')
  try {
    const d = await call(liking ? 'like' : 'unlike')
    set({ views: d.views, likes: d.likes })
  } catch {
    set({ liked: before.liked, likes: before.likes }) // could not save: put it back
    write(localStorage, LIKED, before.liked ? '1' : '0')
  } finally {
    busy = false
  }
}

const subscribe = (fn) => {
  listeners.add(fn)
  return () => listeners.delete(fn)
}
export const useStats = () => useSyncExternalStore(subscribe, () => state)
