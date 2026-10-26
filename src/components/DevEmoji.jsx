import { useId } from 'react'

// An original emoji-style character: a developer working on a laptop. It is drawn as SVG, so it
// looks identical on every device (Apple's own emoji artwork can't be bundled, and the system
// emoji changes per platform: Windows, Android, iPhone).
export function DevEmoji({ size = 80, className = '', title = 'Developer working on a laptop' }) {
  const id = useId().replace(/:/g, '')
  const g = (n) => `${n}-${id}`

  return (
    <svg
      className={`dev-emoji ${className}`}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label={title}
    >
      <defs>
        <linearGradient id={g('skin')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffdcbc" />
          <stop offset="1" stopColor="#f1b98c" />
        </linearGradient>
        <linearGradient id={g('hood')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5ab0ff" />
          <stop offset="1" stopColor="#0a6fe8" />
        </linearGradient>
        <linearGradient id={g('lid')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#eef0f5" />
          <stop offset="1" stopColor="#aeb4c1" />
        </linearGradient>
        <radialGradient id={g('glow')} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#bfe3ff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="60" cy="113" rx="36" ry="5" fill="rgba(0,20,60,0.18)" />

      {/* body */}
      <path d="M22 114 C22 88 38 77 60 77 C82 77 98 88 98 114 Z" fill={`url(#${g('hood')})`} />
      <path d="M52 77 Q60 86 68 77" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round" />
      <rect x="52" y="64" width="16" height="16" rx="7" fill="#e6b087" />

      {/* head */}
      <circle cx="38.5" cy="50" r="4.6" fill="#efb68a" />
      <circle cx="81.5" cy="50" r="4.6" fill="#efb68a" />
      <ellipse cx="60" cy="48" rx="21.5" ry="23.5" fill={`url(#${g('skin')})`} />
      <path
        d="M37.5 47 C34 26 49 17 62 18.5 C77 20 87 30 82.5 47 C79 38.5 71 32.5 60 32.5 C49 32.5 41.5 38 37.5 47 Z"
        fill="#2a2b33"
      />
      <path d="M48 24 Q58 19.5 70 22" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="2.2" strokeLinecap="round" />

      {/* face */}
      <g className="dev-eyes">
        <ellipse cx="51" cy="50.5" rx="2.7" ry="3.5" fill="#2a2b33" />
        <ellipse cx="69" cy="50.5" rx="2.7" ry="3.5" fill="#2a2b33" />
        <circle cx="52" cy="49.3" r="0.95" fill="#fff" />
        <circle cx="70" cy="49.3" r="0.95" fill="#fff" />
      </g>
      <path d="M45.5 43.5 Q51 40.5 56 43" fill="none" stroke="#2a2b33" strokeWidth="2" strokeLinecap="round" />
      <path d="M64 43 Q69 40.5 74.5 43.5" fill="none" stroke="#2a2b33" strokeWidth="2" strokeLinecap="round" />
      <path d="M52 59.5 Q60 66.5 68 59.5" fill="none" stroke="#b44a40" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="46" cy="57.5" r="3.4" fill="#ff8a7a" opacity="0.28" />
      <circle cx="74" cy="57.5" r="3.4" fill="#ff8a7a" opacity="0.28" />

      {/* laptop, seen from behind, with a glowing logo */}
      <rect x="27" y="76" width="66" height="35" rx="5" fill={`url(#${g('lid')})`} />
      <rect x="27" y="76" width="66" height="35" rx="5" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
      <circle cx="60" cy="93.5" r="9" fill={`url(#${g('glow')})`} />
      <circle cx="60" cy="93.5" r="3.6" fill="#fff" opacity="0.95" />
      <rect x="21" y="109" width="78" height="5.5" rx="2.75" fill="#99a0ae" />

      {/* hands on the lid */}
      <circle cx="37" cy="77" r="5.6" fill="#f0b98c" />
      <circle cx="83" cy="77" r="5.6" fill="#f0b98c" />
    </svg>
  )
}
