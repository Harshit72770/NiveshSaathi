/**
 * Locate the line where a dictionary file's brace depth first becomes wrong.
 *
 *   node scripts/find-brace-error.mjs src/i18n/languages/pa.js
 *
 * Tracks {}, () and [] depth while ignoring string literals, template
 * literals, escapes and comments, then reports:
 *   - any top-level section ("  name: {") that does not open at depth 1
 *   - the depth at the end of the file (expected 0)
 * Useful when `node --check` only says "Unexpected end of input".
 */
import { readFileSync } from 'node:fs'

const file = process.argv[2]
if (!file) {
  console.error('usage: node scripts/find-brace-error.mjs <file>')
  process.exit(2)
}

const src = readFileSync(file, 'utf8').replace(/^\uFEFF/, '')
const lines = src.split(/\r?\n/)

const open = { '{': 1, '(': 1, '[': 1 }
const matching = { '}': '{', ')': '(', ']': '[' }

let depth = 0
let inString = null // current quote character
let escaped = false
let inLineComment = false
let inBlockComment = false
let line = 0

const report = []

for (const text of lines) {
  line += 1

  const topSection = /^  ([A-Za-z_]\w*): \{/.exec(text)
  if (topSection && depth !== 1) {
    report.push(
      `line ${line}: top-level section "${topSection[1]}" opens at depth ${depth} (expected 1)`
    )
  }

  for (let k = 0; k < text.length; k += 1) {
    const c = text[k]

    if (inLineComment) continue
    if (inBlockComment) {
      if (c === '*' && text[k + 1] === '/') {
        inBlockComment = false
        k += 1
      }
      continue
    }
    if (inString) {
      if (escaped) {
        escaped = false
      } else if (c === '\\') {
        escaped = true
      } else if (c === inString) {
        inString = null
      }
      continue
    }

    if (c === '/' && text[k + 1] === '/') {
      inLineComment = true
      continue
    }
    if (c === '/' && text[k + 1] === '*') {
      inBlockComment = true
      k += 1
      continue
    }
    if (c === "'" || c === '"' || c === '`') {
      inString = c
      continue
    }
    if (open[c]) depth += 1
    else if (matching[c]) depth -= 1
  }

  if (inString) {
    report.push(`line ${line}: unterminated ${inString} string -> ${text.slice(0, 90)}`)
    inString = null
  }
  inLineComment = false
}

for (const r of report) console.log(r)
console.log(`final depth = ${depth} (expected 0)`)
if (report.length || depth !== 0) process.exitCode = 1
