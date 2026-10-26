
import { sm } from '../sm.jsx'
import { Icon } from './Icon.jsx'
import { LargeTitle } from './Type.jsx'
import { focus } from '../data.js'

// Focus areas as an iOS Settings list: each row slides in and its switch flips on.
export function Focus() {
  return (
    <section id="focus" className="section">
      <div className="container narrow wide-ish">
        <LargeTitle>Focus</LargeTitle>

        <div className="card settings">
          {focus.map((f, i) => (
            <sm.div
              key={f.label}
              className="row"
              initial={{ opacity: 0, x: -36 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.8 }}
              transition={{ type: 'spring', stiffness: 130, damping: 20, delay: i * 0.05 }}
            >
              <i className="app-icon" style={{ '--c': f.color }}>
                <Icon name={f.icon} size={20} />
              </i>
              <span>{f.label}</span>
              <sm.i
                className="toggle"
                initial={{ backgroundColor: 'rgba(120,130,150,0.35)' }}
                whileInView={{ backgroundColor: '#30d158' }}
                viewport={{ once: false, amount: 0.8 }}
                landSound={{ name: 'toggle', delay: 500 + i * 160 }}
                transition={{ delay: 0.5 + i * 0.16, duration: 0.3 }}
              >
                <sm.b
                  initial={{ x: 0 }}
                  whileInView={{ x: 18 }}
                  viewport={{ once: false, amount: 0.8 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30, delay: 0.5 + i * 0.16 }}
                />
              </sm.i>
            </sm.div>
          ))}
        </div>
      </div>
    </section>
  )
}
