// The "mini JSON database" for site views and likes: one document, { views, likes }.
// The same rules run in the Netlify function (live site) and in the Vite dev/preview server
// (data/stats.json), so both behave identically.
export const EMPTY = { views: 0, likes: 0 }

const num = (n) => (Number.isFinite(n) && n > 0 ? Math.floor(n) : 0)

export const clean = (doc) => ({ views: num(doc?.views), likes: num(doc?.likes) })

// view: +1 view. like / unlike: +1 / -1 like (never below zero).
export function apply(doc, action) {
  const d = clean(doc)
  if (action === 'view') d.views += 1
  else if (action === 'like') d.likes += 1
  else if (action === 'unlike') d.likes = Math.max(0, d.likes - 1)
  else return null // unknown action
  return d
}
