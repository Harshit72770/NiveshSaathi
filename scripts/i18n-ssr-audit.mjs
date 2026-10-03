/**
 * SSR render audit — proves every route renders in every language without
 * falling back to a raw key path or the literal string "undefined".
 *
 *   node scripts/i18n-ssr-audit.mjs
 *
 * It boots Vite in middleware mode, server-renders <App/> through a
 * MemoryRouter for each route x language combination, and captures the
 * `[i18n] unresolved key:` warning that src/i18n/index.js emits when a key
 * exists in no dictionary.
 */
import { createServer } from 'vite'
import React from 'react'
import { renderToString } from 'react-dom/server'

const ROUTES = ['/', '/learn', '/check', '/before-invest', '/decisions', '/problem', '/recovery']
const LANGS = [
  'en',
  'hi',
  'bn',
  'te',
  'mr',
  'ta',
  'gu',
  'kn',
  'ml',
  'pa',
  'or',
  'as',
  'ur',
]

/* ---------------------------------------------------------------- shims --- */
globalThis.window = globalThis
const store = new Map()
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
}
globalThis.document = {
  documentElement: { lang: 'en', dir: 'ltr' },
  addEventListener() {},
  removeEventListener() {},
  getElementById: () => null,
  querySelector: () => null,
}
try {
  if (!globalThis.navigator) {
    globalThis.navigator = { clipboard: { writeText: async () => {} } }
  }
} catch {
  /* Node >= 21 exposes a read-only navigator — nothing to do */
}

/* ------------------------------------------------------------- capture --- */
const unresolved = new Map() // key -> "lang@route"
let currentLabel = '?'

const isReactSsrNoise = (msg) =>
  msg.includes('useLayoutEffect does nothing on the server') ||
  msg.includes('https://reactjs.org/link/uselayouteffect-ssr')

const realWarn = console.warn
const realError = console.error
console.warn = (...args) => {
  const first = String(args[0] ?? '')
  if (first.includes('[i18n] unresolved key:')) {
    const key = first.split('unresolved key:')[1].trim()
    if (!unresolved.has(key)) unresolved.set(key, currentLabel)
    return
  }
  if (isReactSsrNoise(first)) return
  realWarn(...args)
}
console.error = (...args) => {
  if (isReactSsrNoise(String(args[0] ?? ''))) return
  realError(...args)
}

/* ----------------------------------------------------------------- boot --- */
const server = await createServer({
  root: process.cwd(),
  server: { middlewareMode: true, hmr: false },
  appType: 'custom',
  logLevel: 'error',
})

const { default: App } = await server.ssrLoadModule('/src/App.jsx')
const { MemoryRouter } = await server.ssrLoadModule('react-router-dom')
const { LanguageProvider } = await server.ssrLoadModule('/src/i18n/index.js')
const { SIGNAL_CATALOGUE } = await server.ssrLoadModule('/src/data/warningSignals.js')

/*
 * /check?signal=<id> renders the deep-linked catalogue notice that a plain
 * /check never shows, so every signal's title + detail needs coverage too.
 */
const allRoutes = [
  ...ROUTES,
  ...SIGNAL_CATALOGUE.map((s) => `/check?signal=${encodeURIComponent(s.id)}`),
]

const render = (route, lang) =>
  renderToString(
    React.createElement(
      LanguageProvider,
      null,
      React.createElement(
        MemoryRouter,
        { initialEntries: [route] },
        React.createElement(App),
      ),
    ),
  )

let failures = 0
const problems = []

for (const lang of LANGS) {
  store.clear()
  store.set('niveshsaathi_language', lang)
  store.set('niveshsaathi_language_seen', '1')
  store.set('journal', JSON.stringify([]))
  store.set('recovery-evidence', JSON.stringify([]))
  store.set('nominee-checklist', JSON.stringify([]))
  store.set('iepf-checklist', JSON.stringify([]))

  let chars = 0
  for (const route of allRoutes) {
    currentLabel = `${lang}@${route}`
    let html = ''
    try {
      html = render(route, lang)
    } catch (err) {
      failures += 1
      problems.push(`${lang} ${route} — RENDER THREW: ${err.message}`)
      continue
    }
    chars += html.length
    const text = html.replace(/<[^>]+>/g, ' ')
    if (/\bundefined\b/.test(text)) {
      failures += 1
      problems.push(`${lang} ${route} — contains the literal word "undefined"`)
    }
    if (/\bNaN\b/.test(text)) {
      failures += 1
      problems.push(`${lang} ${route} — contains "NaN"`)
    }
    if (html.length < 2000) {
      failures += 1
      problems.push(`${lang} ${route} — suspiciously short output (${html.length} chars)`)
    }
  }
  console.log(`${lang}: ${allRoutes.length} routes rendered, ${chars} chars total`)
}

/* first-visit picker must render when the "seen" flag is absent */
store.clear()
store.set('niveshsaathi_language', 'hi')
currentLabel = 'hi@first-visit-picker'
const pickerHtml = render('/', 'hi')
const pickerOk = pickerHtml.includes('picker-dialog')
console.log(`first-visit picker renders in Hindi: ${pickerOk}`)
if (!pickerOk) {
  failures += 1
  problems.push('first-visit language picker did not render')
}

/* ------------------------------------------------------------- report --- */
console.log('')
if (unresolved.size) {
  console.log(`UNRESOLVED KEYS (${unresolved.size}):`)
  for (const [key, where] of unresolved) console.log(`  ${key}   (first seen: ${where})`)
  failures += unresolved.size
  console.log('')
}

if (problems.length) {
  console.log('RENDER PROBLEMS:')
  for (const p of problems) console.log(`  ${p}`)
  console.log('')
}

console.log(
  failures === 0
    ? `OK - ${allRoutes.length} routes x ${LANGS.length} languages render clean.`
    : `${failures} problem(s) found.`,
)

await server.close()
process.exitCode = failures > 0 ? 1 : 0
