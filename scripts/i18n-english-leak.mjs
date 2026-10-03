/**
 * Leftover-English detector.
 *
 *   node scripts/i18n-english-leak.mjs mr      # one language
 *   node scripts/i18n-english-leak.mjs --all    # every non-English language
 *
 * Server-renders every route in the given language and in English, then flags
 * any run of 4+ consecutive English words that appears verbatim in the English
 * render. Single proper nouns (SEBI, NAV, NiveshSaathi) are expected to carry
 * over; whole sentences that did not get translated are not.
 */
import { createServer } from 'vite'
import React from 'react'
import { renderToString } from 'react-dom/server'

const ROUTES = ['/', '/learn', '/check', '/before-invest', '/decisions', '/problem', '/recovery']
const LANGS = [
  'en', 'hi', 'bn', 'te', 'mr', 'ta', 'gu', 'kn', 'ml', 'pa', 'or', 'as', 'ur',
]
const arg = process.argv[2]
const all = arg === '--all'
const codes = all ? LANGS.filter((c) => c !== 'en') : [arg]

if (!arg) {
  console.error('usage: node scripts/i18n-english-leak.mjs <language-code> | --all')
  process.exit(2)
}

/* --------------------------------------------------------------- shims --- */
globalThis.window = globalThis
const store = new Map()
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
}
globalThis.document = {
  documentElement: { lang: 'en', dir: 'ltr' },
  addEventListener() {},
  removeEventListener() {},
  getElementById: () => null,
  querySelector: () => null,
}
try {
  if (!globalThis.navigator) globalThis.navigator = {}
} catch {
  /* read-only global navigator */
}

/* Drop React's SSR-only useLayoutEffect chatter. */
const noise = (m) => m.includes('useLayoutEffect does nothing on the server')
const realError = console.error
console.error = (...a) => (noise(String(a[0] ?? '')) ? undefined : realError(...a))

const server = await createServer({
  root: process.cwd(),
  server: { middlewareMode: true, hmr: false },
  appType: 'custom',
  logLevel: 'error',
})

const { default: App } = await server.ssrLoadModule('/src/App.jsx')
const { MemoryRouter } = await server.ssrLoadModule('react-router-dom')
const { LanguageProvider, isSupported } = await server.ssrLoadModule('/src/i18n/index.js')
const { SIGNAL_CATALOGUE } = await server.ssrLoadModule('/src/data/warningSignals.js')

for (const code of codes) {
  if (!isSupported(code)) {
    console.error(`Unknown language "${code}"`)
    await server.close()
    process.exit(2)
  }
}

/* Include the deep-linked check routes so catalogue prose is covered too. */
const allRoutes = [
  ...ROUTES,
  ...SIGNAL_CATALOGUE.map((s) => `/check?signal=${encodeURIComponent(s.id)}`),
]

const render = (route, lang) => {
  store.clear()
  store.set('niveshsaathi_language', lang)
  store.set('niveshsaathi_language_seen', '1')
  return renderToString(
    React.createElement(
      LanguageProvider,
      null,
      React.createElement(MemoryRouter, { initialEntries: [route] }, React.createElement(App)),
    ),
  )
}

const textOf = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

/** Contiguous runs of English words (lowercased), 4+ words long. */
const englishRuns = (text) => {
  const runs = []
  let current = []
  const flush = () => {
    if (current.length >= 4) runs.push(current.join(' '))
    current = []
  }
  for (const tok of text.split(/\s+/)) {
    if (/^[A-Za-z][A-Za-z'’-]*$/.test(tok)) current.push(tok.toLowerCase())
    else flush()
  }
  flush()
  return runs
}

/* English render is the baseline — compute it once per route. */
const baseline = new Map()
for (const route of allRoutes) {
  baseline.set(route, new Set(englishRuns(textOf(render(route, 'en')))))
}

let anyLeak = 0

for (const code of codes) {
  const seen = new Map() // run -> "route"

  for (const route of allRoutes) {
    const enRuns = baseline.get(route)
    const langText = textOf(render(route, code))
    for (const run of englishRuns(langText)) {
      if (enRuns.has(run) && !seen.has(run)) seen.set(run, route)
    }
  }

  anyLeak += seen.size
  console.log(`leftover English runs in "${code}" across ${allRoutes.length} routes: ${seen.size}`)
  if (seen.size) {
    for (const [run, route] of seen) console.log(`    ${route}  "${run}"`)
  }
}

await server.close()
process.exitCode = anyLeak > 0 ? 1 : 0
