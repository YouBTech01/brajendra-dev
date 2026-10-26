import { useEffect, useRef } from 'react'

// Fixed full-page canvas behind everything: large soft sky-blue light fields whose hue and
// lightness drift smoothly, so the glass above always has living colour to refract.
const FIELDS = [
  { h: 199, dh: 14, l: 62, x: 0.82, y: 0.08, r: 0.46, sx: 0.00018, sy: 0.00014, ph: 0 },
  { h: 205, dh: 12, l: 74, x: 0.08, y: 0.5, r: 0.42, sx: 0.00015, sy: 0.00021, ph: 2 },
  { h: 211, dh: 10, l: 52, x: 0.72, y: 0.92, r: 0.44, sx: 0.00017, sy: 0.00013, ph: 4 },
  { h: 195, dh: 12, l: 82, x: 0.42, y: 0.22, r: 0.36, sx: 0.00021, sy: 0.00017, ph: 1 },
  { h: 203, dh: 16, l: 60, x: 0.24, y: 0.88, r: 0.38, sx: 0.00013, sy: 0.00019, ph: 3 },
  { h: 208, dh: 10, l: 70, x: 0.96, y: 0.55, r: 0.32, sx: 0.00016, sy: 0.00022, ph: 5 },
]

export function MotionBackground() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 }
    let w = 0
    let h = 0
    let raf = 0

    const resize = () => {
      // soft gradients need no detail: draw at half size and let the browser scale it up
      const scale = 0.5
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.round(w * scale)
      canvas.height = Math.round(h * scale)
      ctx.setTransform(scale, 0, 0, scale, 0, 0)
      if (reduce) draw(0)
    }

    const onMove = (e) => {
      pointer.tx = e.clientX / w
      pointer.ty = e.clientY / h
    }

    const draw = (now) => {
      pointer.x += (pointer.tx - pointer.x) * 0.03
      pointer.y += (pointer.ty - pointer.y) * 0.03
      const dark = document.documentElement.dataset.theme === 'dark'

      // base wash: breathes between two sky tones
      const k = (Math.sin(now * 0.00009) + 1) / 2
      const base = dark ? `hsl(${212 - k * 4}, 72%, ${5 + k * 4}%)` : `hsl(${204 - k * 5}, 88%, ${94 - k * 5}%)`
      ctx.fillStyle = base
      ctx.fillRect(0, 0, w, h)

      const big = Math.max(w, h)
      for (const f of FIELDS) {
        const x = (f.x + Math.sin(now * f.sx + f.ph) * 0.12 + (pointer.x - 0.5) * 0.06) * w
        const y = (f.y + Math.cos(now * f.sy + f.ph) * 0.12 + (pointer.y - 0.5) * 0.06) * h
        const r = f.r * big
        const hue = f.h + Math.sin(now * 0.00012 + f.ph) * f.dh
        const light = f.l + Math.sin(now * 0.0002 + f.ph * 2) * 8 - (dark ? 24 : 0)
        const alpha = dark ? 0.5 : 0.72
        const g = ctx.createRadialGradient(x, y, 0, x, y, r)
        g.addColorStop(0, `hsla(${hue}, 92%, ${light}%, ${alpha})`)
        g.addColorStop(0.55, `hsla(${hue}, 90%, ${light}%, ${alpha * 0.4})`)
        g.addColorStop(1, `hsla(${hue}, 90%, ${light}%, 0)`)
        ctx.fillStyle = g
        ctx.fillRect(x - r, y - r, r * 2, r * 2)
      }

      if (!reduce) raf = requestAnimationFrame(draw)
    }

    resize()
    if (!reduce) raf = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return <canvas ref={ref} className="lg-backdrop" aria-hidden="true" />
}
