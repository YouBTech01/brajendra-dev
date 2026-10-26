import { useMemo } from 'react'

import { sm } from '../sm.jsx'

const ease = [0.22, 1, 0.36, 1]

// Splits copy into words and marks which of them fall inside the highlighted phrase.
function tokenise(text, mark) {
  const from = mark ? text.indexOf(mark) : -1
  const to = from + (mark?.length ?? 0)
  let pos = 0
  return text.split(' ').map((t) => {
    const start = text.indexOf(t, pos)
    pos = start + t.length
    return { t, marked: from > -1 && start >= from && pos <= to }
  })
}

const word = {
  hidden: { opacity: 0, y: '0.6em' },
  show: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.75, ease, delay: i } }),
}

// "Staggered Fade Up": every word rises and fades in, one after another. An optional phrase
// then gets a marker-highlight sweep behind it. Only opacity and transform animate, so it
// stays on the GPU; replays whenever it scrolls back into view.
export function StaggerFadeUp({ text, mark, as = 'p', className = '', delay = 0, stagger = 0.055 }) {
  const Tag = sm[as]
  const words = useMemo(() => tokenise(text, mark), [text, mark])
  const markDelay = delay + words.length * stagger * 0.55

  const node = (w, i) => (
    <sm.span key={i} className="fw" variants={word} custom={delay + i * stagger} aria-hidden="true">
      {w.t}
    </sm.span>
  )

  // group consecutive marked words under one highlight so it spans the whole phrase
  const out = []
  for (let i = 0; i < words.length; ) {
    if (words[i].marked) {
      const group = []
      while (i < words.length && words[i].marked) group.push(node(words[i], i++))
      out.push(
        <sm.span
          key={`m${i}`}
          className="mk"
          variants={{
            hidden: { '--mk': '0%' },
            show: { '--mk': '100%', transition: { duration: 0.8, ease, delay: markDelay } },
          }}
        >
          {group.reduce((acc, g, k) => (k ? [...acc, ' ', g] : [g]), [])}
        </sm.span>,
      )
    } else {
      out.push(node(words[i], i++))
    }
    out.push(' ')
  }

  return (
    <Tag
      className={className}
      aria-label={text}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.6 }}
    >
      {out}
    </Tag>
  )
}

// "Mask Reveal Up": section titles slide up out of a clipped line, like an iOS large title.
export function LargeTitle({ children }) {
  return (
    <h2 className="large-title">
      {/* the clipped line is what's observed: the sliding text inside it is hidden by the clip */}
      <sm.span className="mask" initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.9 }}>
        <sm.span
          className="mask-in"
          variants={{ hidden: { y: '112%' }, show: { y: 0, transition: { duration: 0.9, ease } } }}
        >
          {children}
        </sm.span>
      </sm.span>
    </h2>
  )
}
