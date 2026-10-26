import { getStore } from '@netlify/blobs'
import { EMPTY, apply, clean } from '../../server/stats-core.js'

// GET  /api/stats            -> { views, likes }
// POST /api/stats {action}   -> updated { views, likes }   (action: view | like | unlike)
// The numbers live in one JSON document in Netlify Blobs. Writes use the document's etag, so two
// visitors at the same moment never overwrite each other: the loser re-reads and tries again.
const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'no-store',
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, POST, OPTIONS',
      'access-control-allow-headers': 'content-type',
    },
  })

export default async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'access-control-allow-origin': '*',
        'access-control-allow-methods': 'GET, POST, OPTIONS',
        'access-control-allow-headers': 'content-type',
      },
    })
  }

  const store = getStore('site-stats')
  const KEY = 'stats'

  if (req.method === 'GET') {
    return json(clean((await store.get(KEY, { type: 'json' })) ?? EMPTY))
  }
  if (req.method !== 'POST') return json({ error: 'method not allowed' }, 405)

  let action
  try {
    action = (await req.json()).action
  } catch {
    return json({ error: 'bad request' }, 400)
  }

  for (let attempt = 0; attempt < 8; attempt++) {
    const found = await store.getWithMetadata(KEY, { type: 'json' })
    const next = apply(found?.data ?? EMPTY, action)
    if (!next) return json({ error: 'unknown action' }, 400)
    const res = await store.setJSON(KEY, next, found ? { onlyIfMatch: found.etag } : { onlyIfNew: true })
    if (res.modified) return json(next)
  }
  return json({ error: 'busy, try again' }, 503)
}

export const config = { path: '/api/stats' }
