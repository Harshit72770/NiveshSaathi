/**
 * GET /api/health — Vercel serverless function.
 *
 * Diagnostics only: proves the function runtime is live and reports whether
 * GROQ_API_KEY is visible to the function. The key value is NEVER returned.
 *
 * Use this after a Vercel deploy to confirm the missing piece was the route,
 * not the environment variable.
 */
import { MODEL } from '../server/index.js'

function sendJson(res, status, payload) {
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    res.status(status).json(payload)
    return
  }
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(payload))
}

export default async function handler(req, res) {
  const configured = Boolean(process.env.GROQ_API_KEY)
  console.log(`[health] GROQ_API_KEY configured=${configured} model=${MODEL}`)
  sendJson(res, 200, {
    ok: true,
    aiConfigured: configured,
    model: MODEL,
    runtime: 'vercel-node',
  })
}
