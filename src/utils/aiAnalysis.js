/**
 * ===========================================================================
 * NiveshSaathi — client helper for the server-side AI analysis API
 * ===========================================================================
 *
 * This module NEVER holds an API key. The browser only calls the
 * same-origin /api/ai/analyze route, which is served by the Express
 * backend (production: `npm run server`; development: mounted inside
 * the Vite dev server by vite.config.js). The GROQ_API_KEY lives
 * exclusively in the git-ignored .env file on the server.
 *
 * The deterministic analyzer (src/utils/contentAnalyzer.js) remains the
 * safety foundation: this helper only ADDS an AI interpretation on top
 * of the existing analysis. If the request fails for any reason, callers
 * must keep showing the rule-based result unchanged.
 * ===========================================================================
 */

/** Tracks supported by the API (see server/index.js). */
export const AI_TRACKS = {
  FRAUD: 'A',
  RIGHTS: 'B',
  EDUCATION: 'C',
  BEHAVIOUR: 'D',
  MISINFORMATION: 'E',
}

const STRING_FIELDS = [
  'summary',
  'whatContentIsTryingToDo',
  'uncertainty',
  'trackSpecificInsight',
]

const ARRAY_FIELDS = [
  'whatIsBeingClaimed',
  'supportingEvidence',
  'missingContext',
  'aiWarningSignals',
  'verificationSteps',
  'safeNextSteps',
]

/** Does this object look like a complete AI analysis response? */
export function isAiAnalysisShape(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  return (
    STRING_FIELDS.every((f) => typeof value[f] === 'string') &&
    ARRAY_FIELDS.every((f) => Array.isArray(value[f]))
  )
}

/**
 * POST /api/ai/analyze
 *
 * @param {object} args
 * @param {'A'|'B'|'C'|'D'|'E'} args.track
 * @param {string} args.content          — the text to analyze
 * @param {string} [args.language]       — UI language code, e.g. 'en', 'hi'
 * @param {object} [args.existingAnalysis] — the rule-based result, so the
 *                                           AI complements rather than repeats it
 * @returns {Promise<object>} the validated AI analysis
 * @throws when the server is unreachable or the response is malformed
 */
export async function fetchAiAnalysis({ track, content, language, existingAnalysis }) {
  let res
  try {
    res = await fetch('/api/ai/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ track, content, language, existingAnalysis }),
    })
  } catch (err) {
    throw new Error(`AI analysis request failed: ${err?.message || 'network error'}`)
  }

  if (!res.ok) {
    throw new Error(`AI analysis request failed (HTTP ${res.status})`)
  }

  const data = await res.json().catch(() => null)
  if (!isAiAnalysisShape(data)) {
    throw new Error('AI analysis response had an unexpected shape')
  }

  return data
}
