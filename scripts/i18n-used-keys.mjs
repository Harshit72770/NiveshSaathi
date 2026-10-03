/**
 * Static audit of every translation key the source code asks for.
 *
 *   node scripts/i18n-used-keys.mjs
 *
 * Finds `t('a.b.c')` / `tv(t, 'a.b.c', ...)` literals in src/, plus known
 * dynamic prefixes (t(`x.${id}.y`)), then reports keys that en.js cannot
 * resolve - those would render a raw key path in the UI.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

const ROOT = path.join(process.cwd())
const SRC = path.join(ROOT, 'src')

const en = (await import(pathToFileURL(path.join(SRC, 'i18n', 'languages', 'en.js')).href)).default

function hasPath(dict, key) {
  let cursor = dict
  for (const part of String(key).split('.')) {
    if (cursor == null || typeof cursor !== 'object') return false
    cursor = cursor[part]
  }
  return cursor !== undefined && (typeof cursor === 'string' || Array.isArray(cursor))
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, out)
    else if (/\.(jsx?|mjs)$/.test(entry)) out.push(full)
  }
  return out
}

/* static t('...') and tv(t, '...') calls */
const STATIC = /\b(?:t|tv)\(\s*(?:t\s*,\s*)?['"]([\w.]+)['"]/g
/* template literals with a single interpolation at a known depth */
const TEMPLATE = /\bt\(`([^`$]*)\$\{[^}]+\}([^`]*)`/g

const files = walk(SRC)
const used = new Set()
const dynamicPrefixes = new Set()

/* Strip comments first so prose like `t('section.key')` in a doc block is
   not mistaken for a real call. */
const stripComments = (code) =>
  code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1')

for (const file of files) {
  const code = stripComments(readFileSync(file, 'utf8'))
  for (const m of code.matchAll(STATIC)) used.add(m[1])
  for (const m of code.matchAll(TEMPLATE)) {
    const suffix = m[2]
    dynamicPrefixes.add(`${m[1]}*${suffix}`)
  }
}

const missing = [...used].filter((k) => !hasPath(en, k)).sort()

console.log(`files scanned: ${files.length}`)
console.log(`static keys referenced: ${used.size}`)
console.log(`dynamic patterns: ${dynamicPrefixes.size}`)
console.log('')

/* ---------------------------------------------------------------------- *
 * Track E: every key the rule-based analyzer emits must resolve in en.js
 * ---------------------------------------------------------------------- */
const { analyzeContent } = await import(
  pathToFileURL(path.join(SRC, 'utils', 'contentAnalyzer.js')).href
)
const { DEMO_MESSAGES } = await import(
  pathToFileURL(path.join(SRC, 'data', 'demoContent.js')).href
)

const analyzerKeys = new Set()
const record = (k) => {
  if (k) analyzerKeys.add(k)
}

for (const demo of DEMO_MESSAGES) {
  const result = analyzeContent(demo.text)
  if (result.isEmpty) continue
  record(result.contentTypeKey)
  for (const key of [
    'evidenceKeys',
    'missingEvidenceKeys',
    'uncertaintyKeys',
    'intendedActionKeys',
    'safetyActionKeys',
    'verificationKeys',
    'verificationDetailKeys',
  ]) {
    for (const k of result[key] || []) record(k)
  }
  for (const signal of result.warningSignals || []) {
    record(signal.labelKey)
    record(signal.whyKey)
  }
}

/*
 * Deep-linked routes are not hit by the demo run (/check?signal=... renders
 * the catalogue entries, plain /check does not), and content-type badges only
 * appear for the types a demo happens to classify as. Validate them directly.
 */
const { SIGNAL_CATALOGUE, CONTENT_TYPES } = await import(
  pathToFileURL(path.join(SRC, 'data', 'warningSignals.js')).href
)
for (const s of SIGNAL_CATALOGUE) {
  record(`signals.${s.id}.label`)
  record(`signals.${s.id}.why`)
  record(`catalogue.${s.id}.title`)
  record(`catalogue.${s.id}.detail`)
}
for (const type of CONTENT_TYPES) {
  const slug = String(type).toLowerCase().replace(/[^a-z]/g, '')
  record(`contentTypes.${slug}.label`)
  record(`contentTypes.${slug}.desc`)
}

const missingAnalyzer = [...analyzerKeys].filter((k) => !hasPath(en, k)).sort()
console.log(`analyzer emits ${analyzerKeys.size} distinct keys across ${DEMO_MESSAGES.length} demos`)

const missingAll = [...missing, ...missingAnalyzer].sort()

if (dynamicPrefixes.size) {
  console.log('dynamic patterns (verify manually):')
  for (const p of [...dynamicPrefixes].sort()) console.log(`  ${p}`)
  console.log('')
}

if (missingAll.length) {
  console.log(`MISSING from en.js (${missingAll.length}):`)
  for (const k of missingAll) console.log(`  ${k}`)
  process.exitCode = 1
} else {
  console.log('OK - every statically referenced and analyzer-emitted key resolves in en.js.')
}
