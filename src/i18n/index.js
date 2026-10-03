/**
 * ===========================================================================
 * NiveshSaathi — Centralised multilingual system (i18n)
 * ===========================================================================
 *
 * Design rules:
 *  - ONE source of language state: LanguageContext (currentLanguage, setLanguage)
 *  - ONE translation function: t('section.key')  — no scattered `if (lang === 'hi')`
 *  - Selection persists in localStorage under `niveshsaathi_language`
 *  - Falls back to English, then to the key itself (never renders "undefined")
 *  - 100% offline: local dictionaries only, no API, no network calls
 *
 * Future AI translation: see ./dynamic.js (translateDynamicContent) — a stub
 * today, a backend-proxied service later. No API key ever ships to the browser.
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  createElement,
} from 'react'

import en from './languages/en.js'
import hi from './languages/hi.js'
import bn from './languages/bn.js'
import te from './languages/te.js'
import mr from './languages/mr.js'
import ta from './languages/ta.js'
import gu from './languages/gu.js'
import kn from './languages/kn.js'
import ml from './languages/ml.js'
import pa from './languages/pa.js'
import or from './languages/or.js'
import as from './languages/as.js'
import ur from './languages/ur.js'

/* -------------------------------------------------------------------------- */
/* Language registry — native script names, exactly as they should be shown.  */
/* -------------------------------------------------------------------------- */

export const LANGUAGES = [
  { code: 'en', native: 'English', english: 'English', dir: 'ltr', locale: 'en-IN' },
  { code: 'hi', native: 'हिन्दी', english: 'Hindi', dir: 'ltr', locale: 'hi-IN' },
  { code: 'bn', native: 'বাংলা', english: 'Bengali', dir: 'ltr', locale: 'bn-IN' },
  { code: 'te', native: 'తెలుగు', english: 'Telugu', dir: 'ltr', locale: 'te-IN' },
  { code: 'mr', native: 'मराठी', english: 'Marathi', dir: 'ltr', locale: 'mr-IN' },
  { code: 'ta', native: 'தமிழ்', english: 'Tamil', dir: 'ltr', locale: 'ta-IN' },
  { code: 'gu', native: 'ગુજરાતી', english: 'Gujarati', dir: 'ltr', locale: 'gu-IN' },
  { code: 'kn', native: 'ಕನ್ನಡ', english: 'Kannada', dir: 'ltr', locale: 'kn-IN' },
  { code: 'ml', native: 'മലയാളം', english: 'Malayalam', dir: 'ltr', locale: 'ml-IN' },
  { code: 'pa', native: 'ਪੰਜਾਬੀ', english: 'Punjabi', dir: 'ltr', locale: 'pa-IN' },
  { code: 'or', native: 'ଓଡ଼ିଆ', english: 'Odia', dir: 'ltr', locale: 'or-IN' },
  { code: 'as', native: 'অসমীয়া', english: 'Assamese', dir: 'ltr', locale: 'as-IN' },
  { code: 'ur', native: 'اردو', english: 'Urdu', dir: 'rtl', locale: 'ur-PK' },
]

export const LANGUAGE_CODES = LANGUAGES.map((l) => l.code)

const DICTS = { en, hi, bn, te, mr, ta, gu, kn, ml, pa, or, as, ur }

export const DEFAULT_LANGUAGE = 'en'
export const STORAGE_KEY = 'niveshsaathi_language'
export const SEEN_KEY = 'niveshsaathi_language_seen'
/** Legacy key used by the old single-page language switch on /learn. */
const LEGACY_KEY = 'niveshsaathi:lang'

export const getLanguageMeta = (code) =>
  LANGUAGES.find((l) => l.code === code) || LANGUAGES[0]

export const isSupported = (code) => Boolean(code) && Boolean(DICTS[code])

/* -------------------------------------------------------------------------- */
/* Lookup helpers                                                             */
/* -------------------------------------------------------------------------- */

function readAny(dict, path) {
  if (!dict) return undefined
  let cursor = dict
  const parts = String(path).split('.')
  for (let i = 0; i < parts.length; i += 1) {
    if (cursor == null || typeof cursor !== 'object') return undefined
    cursor = cursor[parts[i]]
  }
  // Only accept leaf values (string / array). Objects are sections, not text.
  if (cursor === undefined) return undefined
  if (typeof cursor === 'object' && !Array.isArray(cursor)) return undefined
  return cursor
}

const INTERP = /\{\{\s*([\w.]+)\s*\}\}/g

function interpolate(template, vars) {
  if (!vars) return template
  return template.replace(INTERP, (whole, name) =>
    vars[name] === undefined || vars[name] === null ? whole : String(vars[name]),
  )
}

/**
 * Resolve a key against a dictionary.
 * Order: requested language -> English -> the key itself.
 * The key fallback guarantees we never render the literal word "undefined".
 *
 * Returns a string (with {{var}} interpolation) or an array of strings —
 * lists such as complaint routes and document checklists live in the
 * dictionaries too, so they translate with everything else.
 */
export function translateWith(dict, key, vars, fallbackDict = en) {
  const direct = readAny(dict, key)
  if (direct !== undefined) {
    if (typeof direct === 'string') return interpolate(direct, vars)
    return direct
  }
  const fallback = readAny(fallbackDict, key)
  if (fallback !== undefined) {
    if (typeof fallback === 'string') return interpolate(fallback, vars)
    return fallback
  }
  // Last resort: return the key itself. We never render "undefined", but a raw
  // key path is still a bug — surface it loudly during development so the
  // i18n audits can catch it. Compiled away in production builds.
  if (import.meta.env?.DEV && typeof console !== 'undefined') {
    console.warn(`[i18n] unresolved key: ${key}`)
  }
  return String(key)
}

/** Raw lookup that reports whether a key exists (used by the dev key audit). */
export function hasKey(dict, key) {
  return readAny(dict, key) !== undefined
}

/* -------------------------------------------------------------------------- */
/* Context                                                                    */
/* -------------------------------------------------------------------------- */

const LanguageContext = createContext(null)

function loadInitialLanguage() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (isSupported(saved)) return saved

    // Migrate the old /learn tab preference so nothing the user chose is lost.
    const legacyRaw = window.localStorage.getItem(LEGACY_KEY)
    const legacy = legacyRaw ? JSON.parse(legacyRaw) : null
    if (isSupported(legacy)) {
      window.localStorage.setItem(STORAGE_KEY, legacy)
      return legacy
    }
  } catch {
    /* storage blocked — fall through to the default */
  }
  return DEFAULT_LANGUAGE
}

function hasSeenPicker() {
  try {
    return window.localStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(loadInitialLanguage)
  const [pickerOpen, setPickerOpen] = useState(() => !hasSeenPicker())

  const setLanguage = useCallback((code) => {
    const next = isSupported(code) ? code : DEFAULT_LANGUAGE
    setLanguageState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
      // Choosing a language satisfies the first-visit prompt.
      window.localStorage.setItem(SEEN_KEY, '1')
    } catch {
      /* storage blocked — the UI still updates for this session */
    }
    setPickerOpen(false)
  }, [])

  const dismissPicker = useCallback(() => {
    try {
      window.localStorage.setItem(SEEN_KEY, '1')
    } catch {
      /* ignore */
    }
    setPickerOpen(false)
  }, [])

  // Keep <html lang> / <html dir> in sync so fonts, screen readers and
  // bidi rendering all follow the chosen language.
  useEffect(() => {
    const meta = getLanguageMeta(language)
    document.documentElement.lang = language
    document.documentElement.dir = meta.dir
  }, [language])

  const dict = DICTS[language] || en

  const t = useCallback(
    (key, vars) => translateWith(dict, key, vars),
    [dict],
  )

  /** Does this key exist in the active language or in English? */
  const has = useCallback(
    (key) => hasKey(dict, key) || hasKey(en, key),
    [dict],
  )

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      languages: LANGUAGES,
      dir: getLanguageMeta(language).dir,
      locale: getLanguageMeta(language).locale,
      t,
      has,
      pickerOpen,
      dismissPicker,
      openPicker: () => setPickerOpen(true),
    }),
    [language, setLanguage, t, has, pickerOpen, dismissPicker],
  )

  return createElement(LanguageContext.Provider, { value }, children)
}

/** Full language state: { language, setLanguage, t, dir, locale, ... }. */
export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (ctx) return ctx
  // Outside a provider (unit tests / isolated components): English-only shim.
  return SHIM
}

/** Just the translation function — the common case inside components. */
export function useT() {
  return useLanguage().t
}

const SHIM = {
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {},
  languages: LANGUAGES,
  dir: 'ltr',
  locale: 'en-IN',
  t: (key, vars) => translateWith(en, key, vars),
  has: (key) => hasKey(en, key),
  pickerOpen: false,
  dismissPicker: () => {},
  openPicker: () => {},
}

/** `has(key)` — true when the key exists in the current language or English. */
export function useHas() {
  return useLanguage().has
}

/* -------------------------------------------------------------------------- */
/* Convenience helpers used across the app                                    */
/* -------------------------------------------------------------------------- */

/**
 * "Back" buttons reuse the forward arrow mirrored so it points backwards.
 * In RTL, the stylesheet mirrors arrowRight to point left (forward), so the
 * back button explicitly cancels that and keeps pointing right.
 */
export function backArrowStyle(dir) {
  return dir === 'rtl' ? { transform: 'none' } : { transform: 'scaleX(-1)' }
}

/** Stable content-type id -> translated label. */
export function contentTypeLabel(t, contentType) {
  const slug = String(contentType || '')
    .toLowerCase()
    .replace(/[^a-z]/g, '')
  return t(`contentTypes.${slug}.label`, contentType || '')
}

/**
 * Translate `key`, but fall back to a known-English string when the key is
 * absent from every dictionary. Guarantees the UI never shows a raw key path
 * for analyzer-generated prose.
 */
export function tv(t, key, fallback) {
  const value = t(key)
  return value === key ? (fallback == null ? key : fallback) : value
}

/** Warning-signal id -> its dictionary key (label text, not the "why"). */
export const SIGNAL_LABEL_KEYS = {
  'guaranteed-return': 'signals.guaranteed-return.label',
  'high-return-claim': 'signals.high-return-claim.label',
  urgency: 'signals.urgency.label',
  'limited-slots': 'signals.limited-slots.label',
  'private-group': 'signals.private-group.label',
  'investment-request': 'signals.investment-request.label',
  'registration-claim': 'signals.registration-claim.label',
  'social-proof': 'signals.social-proof.label',
  'get-rich-quick': 'signals.get-rich-quick.label',
  'immediate-pressure': 'signals.immediate-pressure.label',
  'recovery-pressure': 'signals.recovery-pressure.label',
  'insider-tip': 'signals.insider-tip.label',
  'unsolicited-buy-sell': 'signals.unsolicited-buy-sell.label',
  'payment-method': 'signals.payment-method.label',
  impersonation: 'signals.impersonation.label',
  'forward-share': 'signals.forward-share.label',
  'income-claim': 'signals.income-claim.label',
  'no-risk-disclosure': 'signals.no-risk-disclosure.label',
}

/** Pick a localised block from an object keyed by language code. */
export function pickLocalized(source, language, fallback = 'en') {
  if (!source) return undefined
  return source[language] || source[fallback] || undefined
}

/* -------------------------------------------------------------------------- */
/* Track C — learning module content                                          */
/* -------------------------------------------------------------------------- */

const ANSWER_INDEX = {
  nav: 1,
  risk: 0,
  diversification: 1,
  volatility: 0,
  compounding: 1,
  fees: 0,
  nomination: 1,
  leverage: 0,
}

/**
 * Localised content block for one learning module, with the (language
 * independent) quiz answer index merged back in.
 */
export function getModuleContent(language, id) {
  const dict = DICTS[language] || en
  const modules = (dict.learn && dict.learn.modules) || {}
  const fallbackModules = en.learn.modules
  const block = modules[id] || fallbackModules[id]
  if (!block) return undefined
  return {
    ...block,
    quiz: block.quiz ? { ...block.quiz, answerIndex: ANSWER_INDEX[id] ?? 0 } : undefined,
  }
}

/* -------------------------------------------------------------------------- */
/* Option-value translation                                                   */
/* -------------------------------------------------------------------------- */

const CONFIDENCE_IDS = ['veryLow', 'low', 'uncertain', 'fairlyHigh', 'high']
const HORIZON_IDS = ['under6', 'sixMonthsTo3', 'threeTo7', 'over7', 'notSure']

export const OPTION_IDS = [...CONFIDENCE_IDS, ...HORIZON_IDS]

/**
 * Stored option values (English tokens written into localStorage by the
 * reflection form and the decision journal) -> dictionary keys.
 * Keeping the stored value English means entries saved before translation
 * still read correctly after a language switch.
 */
const OPTION_KEY_MAP = {
  /* horizon */
  'Less than 6 months': 'beforeInvest.options.under6',
  '6 months – 3 years': 'beforeInvest.options.sixMonthsTo3',
  '3 – 7 years': 'beforeInvest.options.threeTo7',
  'More than 7 years': 'beforeInvest.options.over7',
  'Not sure yet': 'beforeInvest.options.notSure',
  /* confidence */
  'Very low': 'decisions.confidence.veryLow',
  Low: 'decisions.confidence.low',
  Uncertain: 'decisions.confidence.uncertain',
  'Fairly high': 'decisions.confidence.fairlyHigh',
  High: 'decisions.confidence.high',
  /* yes / no */
  yes: 'common.yes',
  no: 'common.no',
  unsure: 'common.notSure',
}

/** Every value the two forms can store — used by the audits. */
export const OPTION_VALUES = Object.keys(OPTION_KEY_MAP)

/**
 * Translate a stored option value; pass through free text untouched so old
 * journal entries with typed answers still read correctly.
 */
export function optionLabel(t, value) {
  const raw = value == null ? '' : String(value)
  if (!raw) return raw

  const resolve = (key) => {
    const label = t(key)
    return label === key ? raw : label
  }

  if (OPTION_KEY_MAP[raw]) return resolve(OPTION_KEY_MAP[raw])
  if (CONFIDENCE_IDS.includes(raw)) return resolve(`decisions.confidence.${raw}`)
  if (HORIZON_IDS.includes(raw)) return resolve(`beforeInvest.options.${raw}`)
  if (raw === 'unsure') return resolve('common.notSure')

  return raw
}

export default LanguageContext
