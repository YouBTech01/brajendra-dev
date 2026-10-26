import { useSyncExternalStore } from 'react'

const KEY = 'theme'

const read = () => {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // storage unavailable (private mode): fall through to the system preference
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

let theme = read()
const listeners = new Set()

const apply = () => {
  document.documentElement.dataset.theme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#050d18' : '#eaf4fb')
}
apply()

const toggle = () => {
  theme = theme === 'dark' ? 'light' : 'dark'
  try {
    localStorage.setItem(KEY, theme)
  } catch {
    // ignore: the choice just won't persist
  }
  apply()
  listeners.forEach((fn) => fn())
}

const subscribe = (fn) => {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

// Light / dark theme: follows the system until the visitor picks one, then remembers it.
// One shared store, so every toggle (Dynamic Island, footer) stays in sync.
export function useTheme() {
  return { theme: useSyncExternalStore(subscribe, () => theme), toggle }
}
