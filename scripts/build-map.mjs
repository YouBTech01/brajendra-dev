// Builds src/map-data.json (SVG paths for Madhya Pradesh and its neighbours) from an Indian
// states GeoJSON, e.g. https://github.com/Subhash9325/GeoJson-Data-of-Indian-States
// Usage: node scripts/build-map.mjs path/to/Indian_States.geojson
import { readFile, writeFile } from 'node:fs/promises'
import { geoMercator, geoPath } from 'd3-geo'

const W = 800
const H = 900

const geo = JSON.parse(await readFile(process.argv[2], 'utf8'))
const mp = geo.features.find((f) => f.properties.NAME_1 === 'Madhya Pradesh')

const projection = geoMercator().fitExtent(
  [
    [150, 230],
    [W - 150, H - 250],
  ],
  mp,
)

// Douglas-Peucker in screen space keeps the file small without visible loss
const simplify = (pts, tol) => {
  if (pts.length < 3) return pts
  const [a, b] = [pts[0], pts[pts.length - 1]]
  let max = 0
  let idx = 0
  for (let i = 1; i < pts.length - 1; i++) {
    const [x, y] = pts[i]
    const dx = b[0] - a[0]
    const dy = b[1] - a[1]
    const len = Math.hypot(dx, dy) || 1
    const d = Math.abs(dy * x - dx * y + b[0] * a[1] - b[1] * a[0]) / len
    if (d > max) [max, idx] = [d, i]
  }
  if (max <= tol) return [a, b]
  return [...simplify(pts.slice(0, idx + 1), tol).slice(0, -1), ...simplify(pts.slice(idx), tol)]
}

const ringToPath = (ring) => {
  const all = ring.map((c) => projection(c))
  // rings are closed (first == last), so split at the point farthest from the start first
  let far = 0
  all.forEach((p, i) => {
    if (Math.hypot(p[0] - all[0][0], p[1] - all[0][1]) > Math.hypot(all[far][0] - all[0][0], all[far][1] - all[0][1])) far = i
  })
  const pts = [...simplify(all.slice(0, far + 1), 0.7).slice(0, -1), ...simplify(all.slice(far), 0.7)]
  return pts.length < 3 ? '' : 'M' + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L') + 'Z'
}
const geomToPath = (g) => {
  const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates
  return polys.map((poly) => poly.map(ringToPath).join('')).join('')
}

const path = geoPath(projection)
// keep every state that shows up inside the map view
const features = geo.features.filter((f) => {
  const [[x0, y0], [x1, y1]] = path.bounds(f)
  return x1 > 0 && x0 < W && y1 > 0 && y0 < H
})
const [cx, cy] = path.centroid(mp)
const out = {
  width: W,
  height: H,
  pin: [Math.round(cx), Math.round(cy)],
  states: features.map((f) => ({
    name: f.properties.NAME_1,
    mp: f === mp,
    c: path.centroid(f).map(Math.round),
    d: geomToPath(f.geometry),
  })),
}
await writeFile(new URL('../src/map-data.json', import.meta.url), JSON.stringify(out))
console.log('pin', out.pin, 'states', out.states.map((s) => `${s.name}:${s.d.length}`).join(' '))
