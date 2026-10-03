/**
 * i18n key-parity auditor.
 *
 *   node scripts/i18n-audit.mjs
 *
 * Verifies every language file in src/i18n/languages exposes exactly the same
 * leaf keys as the canonical English dictionary, and that:
 *   - no value is empty / the literal string "undefined"
 *   - {{placeholders}} match the English source
 */
import { readdirSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

const LANG_DIR = path.join(process.cwd(), 'src', 'i18n', 'languages')

function flatten(value, prefix = '', out = new Map()) {
  if (Array.isArray(value)) {
    out.set(prefix, value)
    return out
  }
  if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      flatten(v, prefix ? `${prefix}.${k}` : k, out)
    }
    return out
  }
  out.set(prefix, value)
  return out
}

const files = readdirSync(LANG_DIR).filter((f) => f.endsWith('.js'))
const dicts = {}
const broken = {}

/*
 * Optional argument limits the report to one language:
 *   node scripts/i18n-audit.mjs hi
 * Useful when several translations are being written in parallel, so one
 * author only ever sees their own file's problems.
 */
const only = process.argv[2] || null

/*
 * Languages are authored in parallel, so one mid-write file must not stop the
 * others from being audited. Anything that fails to parse is reported as
 * BROKEN rather than crashing the run.
 */
for (const f of files) {
  const code = f.replace(/\.js$/, '')
  try {
    const mod = await import(pathToFileURL(path.join(LANG_DIR, f)).href)
    dicts[code] = mod.default
  } catch (err) {
    if (code === 'en' || code === only) {
      console.error(`FATAL: src/i18n/languages/${f} failed to import.`)
      console.error(String(err.message || err))
      process.exit(2)
    }
    broken[code] = String(err.message || err).split('\n')[0]
  }
}

if (only && !dicts[only]) {
  console.error(`Unknown language code "${only}". Known: ${Object.keys(dicts).join(', ')}`)
  process.exit(2)
}

const en = flatten(dicts.en)
const enKeys = [...en.keys()]

console.log(`English dictionary: ${enKeys.length} leaf keys in en.js, ${files.length} files found\n`)

const placeholdersOf = (v) => {
  const s = Array.isArray(v) ? v.join(' ') : String(v == null ? '' : v)
  return [...s.matchAll(/\{\{\s*([\w.]+)\s*\}\}/g)].map((m) => m[1]).sort().join('|')
}

let problems = 0
const report = (lang, key, why) => {
  problems += 1
  if (problems <= 80) console.log(`  [${lang}] ${key} — ${why}`)
}

for (const [code, dict] of Object.entries(dicts)) {
  if (code === 'en') continue
  if (only && code !== only) continue
  const flat = flatten(dict)
  const missing = enKeys.filter((k) => !flat.has(k))
  const extra = [...flat.keys()].filter((k) => !en.has(k))
  const empty = [...flat.entries()]
    .filter(([k, v]) => en.has(k) && (v === '' || v == null || v === 'undefined'))
    .map(([k]) => k)
  const badPlaceholders = enKeys.filter(
    (k) => flat.has(k) && placeholdersOf(en.get(k)) !== placeholdersOf(flat.get(k)),
  )
  const sameAsEnglish = [...flat.entries()]
    .filter(([k, v]) => en.has(k) && typeof v === 'string' && v === en.get(k))
    .map(([k]) => k)

  console.log(
    `${code}: ${flat.size} keys | missing=${missing.length} extra=${extra.length} ` +
      `empty=${empty.length} placeholderMismatch=${badPlaceholders.length} identicalToEnglish=${sameAsEnglish.length}`,
  )
  missing.forEach((k) => report(code, k, 'MISSING'))
  extra.forEach((k) => report(code, k, 'EXTRA (not present in English)'))
  empty.forEach((k) => report(code, k, 'EMPTY / literal "undefined"'))
  badPlaceholders.forEach((k) =>
    report(
      code,
      k,
      `placeholders differ (en="${placeholdersOf(en.get(k))}" vs "${placeholdersOf(flat.get(k))}")`,
    ),
  )
}

/* With a filter, other authors' half-written files are not this run's problem. */
const brokenCodes = only ? [] : Object.keys(broken)
if (Object.keys(broken).length) {
  console.log('')
  console.log(`BROKEN - failed to parse (${brokenCodes.length}):`)
  for (const code of brokenCodes) console.log(`  ${code}.js — ${broken[code]}`)
}

console.log('')
if (problems === 0 && brokenCodes.length === 0) {
  console.log('OK - every dictionary matches English key-for-key.')
} else {
  console.log(`${problems} problem(s) found${brokenCodes.length ? `, ${brokenCodes.length} file(s) unparseable` : ''}.`)
}
process.exitCode = problems > 0 || brokenCodes.length > 0 ? 1 : 0
