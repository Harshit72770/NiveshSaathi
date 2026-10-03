/**
 * Text-level hygiene pass for the language dictionaries.
 *
 *   node scripts/i18n-normalize.mjs [--write]
 *
 * Guarantees every file in src/i18n/languages is:
 *   - UTF-8 without BOM (Vite's import analysis rejects a BOM)
 *   - terminated by exactly one newline
 *   - using LF line endings
 *
 * Content is never rewritten — only encoding and whitespace framing.
 * Without --dry-run's opposite flag (`--write`) it only reports.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const LANG_DIR = path.join(process.cwd(), 'src', 'i18n', 'languages')
const write = process.argv.includes('--write')

let changed = 0
for (const name of readdirSync(LANG_DIR).filter((f) => f.endsWith('.js'))) {
  const full = path.join(LANG_DIR, name)
  const raw = readFileSync(full)
  const hadBom = raw[0] === 0xef && raw[1] === 0xbb && raw[2] === 0xbf
  const body = raw.toString('utf8').replace(/^\uFEFF/, '')
  const lf = body.replace(/\r\n/g, '\n')
  const fixed = lf.replace(/\n*$/, '\n')

  const differs = hadBom || fixed !== body
  if (!differs) continue

  changed += 1
  const notes = [
    hadBom ? 'BOM stripped' : null,
    fixed !== lf ? 'trailing newlines normalised' : null,
    lf !== body ? 'CRLF -> LF' : null,
  ].filter(Boolean)

  if (write) writeFileSync(full, fixed, 'utf8')
  console.log(`${write ? 'fixed' : 'would fix'} ${name}: ${notes.join(', ')}`)
}

if (!changed) console.log('All language files are already clean UTF-8/LF.')
else if (!write) console.log(`\n${changed} file(s) need fixing — re-run with --write.`)
else console.log(`\n${changed} file(s) normalised.`)
