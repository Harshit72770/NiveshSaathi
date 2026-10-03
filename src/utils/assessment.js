/**
 * ===========================================================================
 * NiveshSaathi — Track E assessment levels for link analyses (rule-based)
 * ===========================================================================
 *
 * Turns the existing analyzer output + source facts into ONE of four
 * user-facing assessments. Deterministic, transparent, and deliberately
 * conservative. There is no AI, no score, and no probability anywhere here.
 *
 * Hard rules (must be preserved):
 *  - Never a verdict: no "scam", no "definitely safe", no TRUE/FALSE.
 *  - A warning signal is NOT proof of fraud — levels only say how much to
 *    slow down and verify.
 *  - Website/source legitimacy is kept SEPARATE from claim truth: an
 *    official domain never upgrades a level away from caution/warning, and
 *    never silences warning signals found in the page's claims.
 *  - HTTPS, professional design, or "the page loaded" are NEVER treated as
 *    evidence of legitimacy (they are shown as plain facts only).
 *  - 🟢 requires meaningful positive evidence; the mere ABSENCE of warning
 *    keywords is not enough (0 signals + nothing verifiable → 🟡).
 *
 * The ladder (first match wins):
 *  🔴 Strong warning signals — ≥2 high-severity signals, or ≥5 signals total
 *  🟠 Caution                — ≥1 signal, but not enough to reach 🔴
 *  🟢 Likely legitimate       — no signals AND ≥2 positive indicators
 *  🟡 Needs verification      — everything else (nothing meaningful verified)
 */

/**
 * Signals that record a GAP in the content rather than manipulation (the app
 * itself documents these as "a gap to note, not proof of wrongdoing"). They
 * still appear in the Warning signals list, but they never drive 🟠/🔴 on
 * their own — a neutral page that never mentions risk must not be pushed to
 * Caution, and the mere absence of a disclosure is not a misleading claim.
 */
const GAP_SIGNAL_IDS = new Set(['no-risk-disclosure'])

/** Positive indicators — only things that can actually be established. */
function collectPositiveIndicators(result, source) {
  const evidence = new Set(result.evidenceKeys || [])
  const has = (...keys) => keys.some((k) => evidence.has(k))
  const positives = []

  if (source && source.official) {
    positives.push({
      key: 'assessment.positives.official-domain',
      vars: { domain: source.domain || '' },
    })
  }
  if (has('evidenceItems.registration-number', 'evidenceItems.sebi-reg-number', 'evidenceItems.cin')) {
    positives.push({ key: 'assessment.positives.registration-reference' })
  }
  if (has('evidenceItems.source-named', 'evidenceItems.regulator-named')) {
    positives.push({ key: 'assessment.positives.source-attribution' })
  }
  if (has('evidenceItems.audited-statements')) {
    positives.push({ key: 'assessment.positives.audited-figures' })
  }
  if (has('evidenceItems.risk-disclosure')) {
    positives.push({ key: 'assessment.positives.risk-disclosure' })
  }
  if (
    has(
      'evidenceItems.official-document',
      'evidenceItems.scheme-document',
      'evidenceItems.terms-conditions',
      'evidenceItems.scheme-identifier',
      'evidenceItems.web-link',
    )
  ) {
    positives.push({ key: 'assessment.positives.supporting-material' })
  }
  if ((result.highSignalCount || 0) === 0) {
    positives.push({ key: 'assessment.positives.no-major-signals' })
  }

  return positives
}

/**
 * Compute the four-level assessment for one analysis.
 *
 * @param {object} result  — the object returned by analyzeContent()
 * @param {object|null} source — { type:'link', domain, https, official, ... }
 * @returns {{level: 'legit'|'verify'|'caution'|'warning',
 *            positives: Array<{key: string, vars?: object}>}}
 */
export function computeAssessment(result, source) {
  const high = result.highSignalCount || 0
  const signals = result.warningSignals || []
  // Ladder counts only signals that describe actual warning behaviour;
  // pure disclosure gaps never escalate a level by themselves.
  const total = signals.length
    ? signals.filter((s) => !GAP_SIGNAL_IDS.has(s.id)).length
    : result.signalCount || 0
  const positives = collectPositiveIndicators(result, source)

  let level
  if (high >= 2 || total >= 5) level = 'warning'
  else if (total >= 1) level = 'caution'
  else if (positives.length >= 2) level = 'legit'
  else level = 'verify'

  return { level, positives }
}

export default computeAssessment
