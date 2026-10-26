
import { sm } from '../sm.jsx'
import map from '../map-data.json'
import { Icon } from './Icon.jsx'
import { links } from '../data.js'

const { width: W, height: H, pin, states } = map
const neighbours = ['Rajasthan', 'Uttar Pradesh', 'Maharashtra', 'Gujarat', 'Chhattisgarh']
const mp = states.find((s) => s.mp)

// An Apple Maps style card: the camera flies in on Madhya Pradesh, its outline traces itself,
// and a pin drops with a ripple. Shapes come from real state boundaries (scripts/build-map.mjs).
export function MapWidget() {
  return (
    <div className="card widget map-widget">
      <sm.div
        className="map-camera"
        style={{ transformOrigin: `${(pin[0] / W) * 100}% ${(pin[1] / H) * 100}%` }}
        initial={{ scale: 2.6 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: false, amount: 'some' }}
        transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" role="img" aria-label="Map of Madhya Pradesh, India">
          <rect width={W} height={H} className="m-sea" />
          {states.filter((s) => !s.mp).map((s) => (
            <path key={s.name} d={s.d} className="m-land" />
          ))}

          <sm.path
            d={mp.d}
            className="m-mp-fill"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ delay: 1.2, duration: 1 }}
          />
          <sm.path
            d={mp.d}
            className="m-mp-line"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: false }}
            transition={{ delay: 0.5, duration: 2.2, ease: 'easeInOut' }}
          />

          {states
            .filter((s) => neighbours.includes(s.name))
            .map((s) => (
              <text key={s.name} x={s.c[0]} y={s.c[1]} className="m-label" textAnchor="middle">
                {s.name}
              </text>
            ))}
          <text x={pin[0]} y={pin[1] + 54} className="m-label m-label-main" textAnchor="middle">
            Madhya Pradesh
          </text>

          <g transform={`translate(${pin[0]} ${pin[1]})`}>
            {[0, 1].map((i) => (
              <sm.circle
                key={i}
                r="14"
                className="m-ripple"
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: [0.4, 3.4], opacity: [0.55, 0] }}
                transition={{ duration: 2.6, repeat: Infinity, delay: 2.2 + i * 1.3, ease: 'easeOut' }}
              />
            ))}
            <sm.g
              initial={{ y: -150, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: false }}
              watch="parent"
              landSound={{ name: 'pop', delay: 1950 }}
              transition={{ type: 'spring', stiffness: 220, damping: 11, delay: 1.9 }}
            >
              <ellipse cx="0" cy="2" rx="12" ry="4" className="m-pin-shadow" />
              <path d="M0 0C-14-16-24-27-24-42a24 24 0 0 1 48 0C24-27 14-16 0 0Z" className="m-pin" />
              <circle cx="0" cy="-42" r="9" fill="#fff" />
            </sm.g>
          </g>
        </svg>
      </sm.div>

      <span className="map-label">
        <Icon name="solar:map-point-linear" size={14} /> Maps
      </span>
      <sm.span
        className="compass"
        aria-hidden="true"
        animate={{ rotate: [-14, 14, -14] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      >
        <i />
        <b>N</b>
      </sm.span>

      <sm.div
        className="place-card"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 2.4 }}
      >
        <span>
          <b>Madhya Pradesh</b>
          <small>India</small>
        </span>
        <a href={links.maps} className="directions" target="_blank" rel="noopener noreferrer">
          <Icon name="solar:compass-linear" size={16} /> Open
        </a>
      </sm.div>
    </div>
  )
}
