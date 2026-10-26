import fs from 'node:fs'
import path from 'node:path'
import { EMPTY, apply, clean } from './stats-core.js'

// Serves /api/stats during `npm run dev` and `npm run preview`, storing the numbers in
// data/stats.json: a real, human-readable JSON database file.
export function miniDb() {
  const file = path.resolve('data/stats.json')
  let queue = Promise.resolve() // writes run one at a time, so no two requests can race

  const read = () => {
    try {
      return clean(JSON.parse(fs.readFileSync(file, 'utf8')))
    } catch {
      return { ...EMPTY }
    }
  }
  const write = (doc) => {
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, JSON.stringify(doc, null, 2) + '\n')
  }

  const handler = (req, res, next) => {
    if (req.url.split('?')[0] !== '/api/stats') return next()
    const send = (status, body) => {
      res.statusCode = status
      res.setHeader('content-type', 'application/json')
      res.setHeader('cache-control', 'no-store')
      res.end(JSON.stringify(body))
    }
    if (req.method === 'GET') return send(200, read())
    if (req.method !== 'POST') return send(405, { error: 'method not allowed' })

    let raw = ''
    req.on('data', (c) => (raw += c))
    req.on('end', () => {
      queue = queue.then(() => {
        let action
        try {
          action = JSON.parse(raw).action
        } catch {
          return send(400, { error: 'bad request' })
        }
        const next = apply(read(), action)
        if (!next) return send(400, { error: 'unknown action' })
        write(next)
        send(200, next)
      })
    })
  }

  return {
    name: 'mini-json-db',
    // (no `return`: a returned function would be run by Vite as a post-hook)
    configureServer(s) {
      s.middlewares.use(handler)
    },
    configurePreviewServer(s) {
      s.middlewares.use(handler)
    },
  }
}
