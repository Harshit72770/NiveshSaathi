/**
 * ===========================================================================
 * Vercel serverless function — POST /api/ai/analyze
 * ===========================================================================
 *
 * WHY THIS FILE EXISTS
 * ---------------------
 * The AI route used to live ONLY inside vite.config.js (a `configureServer`
 * hook) and inside `npm run server`. Both are LOCAL-ONLY: Vercel runs
 * `vite build` and serves static `dist/`, it never starts `vite dev` or the
 * Express server. So on Vercel `/api/ai/analyze` had NO handler at all and
 * the browser got 404 (or an HTML page) — which the frontend reported as
 * "AI analysis is temporarily unavailable". The API key was never consulted,
 * because the request never reached a function.
 *
 * This file makes the endpoint a real Vercel function. It re-USES the exact
 * same logic as Express (validateAiRequest / runAiAnalysis from
 * ../../server/index.js) so there is still only ONE Groq integration, one
 * model and one response schema.
 *
 * The browser calls the RELATIVE path /api/ai/analyze, so the same bundle
 * works unchanged on localhost and on Vercel. GROQ_API_KEY is read only here,
 * via process.env — never via VITE_* and never shipped to the client.
 * ===========================================================================
 */

import {
  validateAiRequest,
  runAiAnalysis,
  logApiRequest,
  safeErrorMessage,
  BadRequestError,
  AiServiceError,
} from '../../server/index.js'

/** Matches the Express limit (`express.json({ limit: '256kb' })`). */
const MAX_BODY_BYTES = 256 * 1024

/** Send JSON on both Vercel's `res` and a plain Node `ServerResponse`. */
function sendJson(res, status, payload) {
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    res.status(status).json(payload)
    return
  }
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(payload))
}

/**
 * Read the request body.
 *
 * Vercel's runtime pre-parses `application/json` onto `req.body`; a plain
 * Node server (used for local testing) does not, so we also fall back to
 * reading the raw stream. Both paths are handled here.
 */
async function readJsonBody(req) {
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === 'object') return req.body
    try {
      return JSON.parse(String(req.body))
    } catch {
      throw new BadRequestError('Request body must be valid JSON')
    }
  }

  const chunks = []
  let size = 0
  for await (const chunk of req) {
    size += chunk.length
    if (size > MAX_BODY_BYTES) throw new BadRequestError('Request body is too large')
    chunks.push(chunk)
  }
  const raw = Buffer.concat(chunks).toString('utf8').trim()
  if (!raw) return {}
  try {
    return JSON.parse(raw)
  } catch {
    throw new BadRequestError('Request body must be valid JSON')
  }
}

/**
 * @param {import('node:http').IncomingMessage} req
 * @param {import('node:http').ServerResponse} res
 */
export default async function handler(req, res) {
  // Always answer with CORS-free, same-origin JSON. No API key is ever echoed.
  try {
    res.setHeader?.('Cache-Control', 'no-store')

    if (req.method === 'OPTIONS') {
      res.statusCode = 204
      res.setHeader('Allow', 'POST, OPTIONS')
      res.end()
      return
    }

    if (req.method !== 'POST') {
      res.setHeader?.('Allow', 'POST')
      sendJson(res, 405, { ok: false, error: 'Method not allowed. Use POST.' })
      return
    }

    // #12 — prove the request actually reached the function, and whether the
    // key is present (boolean only; the key value is NEVER logged).
    logApiRequest('vercel')

    const body = await readJsonBody(req)

    // Accept `text` as an alias for `content` (frontend sends `content`).
    if ((body.content === undefined || body.content === null) && typeof body.text === 'string') {
      body.content = body.text
    }

    const input = validateAiRequest(body)
    logApiRequest('vercel', input)

    const analysis = await runAiAnalysis(input)

    // Same success shape as the Express route → passes isAiAnalysisShape()
    // in src/utils/aiAnalysis.js (and therefore CheckContent.jsx).
    sendJson(res, 200, { ...analysis, track: input.track })
  } catch (err) {
    const status =
      err instanceof BadRequestError ? 400 : err instanceof AiServiceError ? 502 : 500
    const message = safeErrorMessage(err) || 'AI analysis failed'

    // Never crash the function — always return a useful JSON body.
    sendJson(res, status, {
      ok: false,
      error: message,
      ...(err instanceof AiServiceError && err.groqStatus
        ? { groqStatus: err.groqStatus }
        : {}),
    })
  }
}
