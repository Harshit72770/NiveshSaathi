/**
 * Track C — Investor Education for Bharat
 *
 * Language-neutral module REGISTRY: stable ids, icons and related warning
 * signals. All human-readable text lives in src/i18n/languages/*.js under
 * `learn.modules.<id>` and is fetched with getModuleContent(language, id).
 *
 * Content is educational only. It never recommends a product or an action.
 */

/** Correct quiz answer per module (never translated, never re-ordered). */
export const ANSWER_INDEX = {
  nav: 1,
  risk: 0,
  diversification: 1,
  volatility: 0,
  compounding: 1,
  fees: 0,
  nomination: 1,
  leverage: 0,
}

export const MODULE_IDS = [
  'nav',
  'risk',
  'diversification',
  'volatility',
  'compounding',
  'fees',
  'nomination',
  'leverage',
]

/** Warning signals each module connects to (ids, not text). */
const RELATED_SIGNALS = {
  nav: ['high-return-claim', 'social-proof'],
  risk: ['guaranteed-return', 'no-risk-disclosure'],
  diversification: ['social-proof', 'investment-request'],
  volatility: ['guaranteed-return', 'high-return-claim'],
  compounding: ['guaranteed-return', 'get-rich-quick'],
  fees: ['investment-request', 'payment-method'],
  nomination: [],
  leverage: ['investment-request', 'get-rich-quick'],
}

const ICONS = {
  nav: 'chart',
  risk: 'alert',
  diversification: 'filter',
  volatility: 'chart',
  compounding: 'refresh',
  fees: 'money',
  nomination: 'users',
  leverage: 'scale',
}

export const learningData = MODULE_IDS.map((id) => ({
  id,
  icon: ICONS[id],
  relatedSignals: RELATED_SIGNALS[id] || [],
}))

/** Backwards-compatible id lookup used by the Check page. */
export const MODULE_MAP = Object.fromEntries(learningData.map((m) => [m.id, m]))

export default learningData
