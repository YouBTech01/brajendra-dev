import { Icon as Iconify, addCollection } from '@iconify/react'

import { sm } from '../sm.jsx'
import solar from '../icons/solar.json'
import simpleIcons from '../icons/simple-icons.json'
import logos from '../icons/logos.json'

// Icons are bundled locally (see scripts/fetch-icons.mjs), so nothing loads at runtime.
addCollection(solar)
addCollection(simpleIcons)
addCollection(logos)

// Names look like `solar:code-linear`, `simple-icons:github`, `logos:flutter`.
// `pop` adds a spring entrance when scrolled into view; every icon wiggles slightly on hover.
export function Icon({ name, size = 20, className = '', pop = false }) {
  return (
    <sm.span
      className={`icon ${className}`}
      aria-hidden="true"
      initial={pop ? { opacity: 0, scale: 0.4, rotate: -20 } : false}
      whileInView={pop ? { opacity: 1, scale: 1, rotate: 0 } : undefined}
      viewport={{ once: false }}
      whileHover={{ scale: 1.18, rotate: -6 }}
      transition={{ type: 'spring', stiffness: 260, damping: 14 }}
    >
      <Iconify icon={name} width={size} height={size} />
    </sm.span>
  )
}
