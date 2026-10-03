/**
 * ===========================================================================
 * NiveshSaathi — Track E input sources (screenshot OCR + link retrieval)
 * ===========================================================================
 *
 * Helpers behind the "Upload Screenshot" and "Analyze Link" options on the
 * Check Content page. Everything runs in the browser:
 *
 *  - Screenshot OCR uses tesseract.js, loaded on demand from the page via a
 *    dynamic import (it never enters the main bundle). The image itself never
 *    leaves the device; only the open-source language model is downloaded
 *    from the public CDN the library ships with — no API keys.
 *
 *  - Link retrieval uses fetch() with credentials omitted. No API keys, no
 *    authentication bypass, no paywall / CAPTCHA / access-control
 *    circumvention: only public, anonymous page content is ever read. The
 *    chain is: direct fetch (works when the site allows CORS) → public
 *    reading relays (allorigins, then r.jina.ai — both keyless, public
 *    content only). When every step fails because of CORS/network
 *    restrictions, the caller shows the plain fallback and the user pastes
 *    the text or uploads a screenshot instead.
 *
 * Extracted text is NEVER analysed automatically: the page shows it for
 * review and correction first, and only the text the user confirms is passed
 * to the existing rule-based contentAnalyzer. Track E guardrails are
 * unchanged — no verdicts, no scores, no recommendations.
 */

/** Accepted screenshot formats (JPG / JPEG / PNG / WEBP). */
export const OCR_ACCEPT = 'image/jpeg,image/jpg,image/png,image/webp'

/** Maximum uploaded image size. */
export const OCR_MAX_BYTES = 10 * 1024 * 1024

/** Cap on retrieved/extracted text so a huge page cannot stall the analyzer. */
export const MAX_TEXT_LENGTH = 20000

/** Below this, a page counts as having no readable content. */
const MIN_TEXT_LENGTH = 40

const IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const IMAGE_EXT = /\.(jpe?g|png|webp)$/i

/**
 * Is this file an acceptable screenshot (format + size)?
 * @param {File} file
 * @returns {boolean}
 */
export function isSupportedImage(file) {
  if (!file) return false
  const typeOk = file.type ? IMAGE_TYPES.includes(file.type) : false
  const nameOk = file.name ? IMAGE_EXT.test(file.name) : false
  if (!typeOk && !nameOk) return false
  if (file.size && file.size > OCR_MAX_BYTES) return false
  return true
}

/* ------------------------------------------------------------------ OCR */

/**
 * tesseract.js language codes for the 13 supported UI languages.
 * Screenshots in India are usually mixed-script, so a non-English UI language
 * reads with its own model plus English.
 */
const OCR_LANGS = {
  en: 'eng',
  hi: 'hin',
  bn: 'ben',
  te: 'tel',
  mr: 'mar',
  ta: 'tam',
  gu: 'guj',
  kn: 'kan',
  ml: 'mal',
  pa: 'pan',
  or: 'ori',
  as: 'asm',
  ur: 'urd',
}

/**
 * Tesseract language string for a UI language code, e.g. 'hi' -> 'hin+eng'.
 * @param {string} language
 * @returns {string}
 */
export function ocrLanguages(language) {
  const primary = OCR_LANGS[language] || 'eng'
  return primary === 'eng' ? 'eng' : `${primary}+eng`
}

/* ------------------------------------------------------------------ URL */

/**
 * Validate and normalise a pasted web address.
 * Accepts bare domains (they become https://…). Only http/https survive.
 * @param {string} raw
 * @returns {string|null} the normalised URL, or null when invalid
 */
export function normalizeUrl(raw) {
  const input = String(raw || '').trim()
  if (!input || input.length > 2048) return null

  const withScheme = /^https?:\/\//i.test(input) ? input : `https://${input}`

  let url
  try {
    url = new URL(withScheme)
  } catch {
    return null
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
  if (!url.hostname || !url.hostname.includes('.')) return null
  return url.href
}

/**
 * GET a URL with safe defaults: no cookies, no credentials, a timeout, and
 * (for direct reads) only plain document content types.
 * Returns { body, type } or null on any CORS/network/status/type failure.
 */
async function getRaw(url, { timeoutMs = 12000, enforceType = true } = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, {
      method: 'GET',
      credentials: 'omit',
      redirect: 'follow',
      signal: controller.signal,
      headers: { Accept: 'text/html, application/xhtml+xml, text/plain;q=0.9, */*;q=0.5' },
    })
    if (!res.ok) return null
    const type = String(res.headers.get('content-type') || '').toLowerCase()
    if (enforceType && type && !/(text\/html|application\/xhtml\+xml|text\/plain|text\/xml)/.test(type)) {
      return null
    }
    const body = await res.text()
    return body ? { body, type } : null
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

/* ------------------------------------------------------------------ SOURCE */

/**
 * Curated list of recognised official domains (Indian financial regulators
 * and exchanges). Matching a name here only establishes what the ADDRESS is —
 * it never makes the claims published on that page legitimate. The list is
 * static and conservative on purpose: nothing is "verified" that cannot be
 * established from the address itself.
 */
const OFFICIAL_DOMAINS = [
  'sebi.gov.in',
  'rbi.org.in',
  'irdai.gov.in',
  'pfrda.gov.in',
  'amfiindia.com',
  'nseindia.com',
  'bseindia.com',
  'mca.gov.in',
]

/**
 * Does this hostname exactly match (or be a subdomain of) a curated official
 * domain? Deliberately strict — `sebi.gov.in.evil.com` must NOT match.
 * @param {string} hostname
 * @returns {boolean}
 */
export function isOfficialDomain(hostname) {
  const h = String(hostname || '')
    .toLowerCase()
    .replace(/\.+$/, '')
  if (!h) return false
  return OFFICIAL_DOMAINS.some((d) => h === d || h.endsWith(`.${d}`))
}

/**
 * Pull the readable text out of an HTML document.
 * Removes boilerplate (scripts, navigation, forms…), prefers <article>/<main>,
 * and returns title + paragraphs. Returns '' when nothing readable remains.
 * @param {string} html
 * @returns {string}
 */
export function extractReadableText(html) {
  return extractHtmlParts(html).text
}

function extractHtmlParts(html) {
  if (typeof DOMParser === 'undefined') return { text: '', title: '' }
  let doc
  try {
    doc = new DOMParser().parseFromString(String(html || ''), 'text/html')
  } catch {
    return { text: '', title: '' }
  }
  if (!doc.body) return { text: '', title: '' }

  doc
    .querySelectorAll('script,style,noscript,svg,canvas,iframe,nav,header,footer,aside,form,button')
    .forEach((el) => el.remove())

  const title = (doc.querySelector('title')?.textContent || '').replace(/\s+/g, ' ').trim()
  const root = doc.querySelector('article, main, [role="main"]') || doc.body

  const seen = new Set()
  const parts = []
  for (const el of root.querySelectorAll(
    'p, h1, h2, h3, h4, li, blockquote, pre, td, th, figcaption, dd',
  )) {
    const txt = (el.textContent || '').replace(/\s+/g, ' ').trim()
    if (txt.length < 2 || seen.has(txt)) continue
    seen.add(txt)
    parts.push(txt)
  }

  let body = parts.join('\n\n').trim()
  if (body.length < MIN_TEXT_LENGTH) {
    body = (root.textContent || '').replace(/\s+/g, ' ').trim()
  }

  const text = [title, body].filter(Boolean).join('\n\n').trim()
  return {
    text: text.length >= MIN_TEXT_LENGTH ? text.slice(0, MAX_TEXT_LENGTH) : '',
    title,
  }
}

/** Decide whether a fetched body is HTML or plain text, and extract text. */
function textFromBody(body) {
  const raw = String(body || '')
  if (!raw.trim()) return { text: '', title: '' }

  const looksHtml =
    /^\s*(<!doctype\s+html|<html[\s>]|<head[\s>]|<body[\s>]|<meta[\s>]|<title[\s>]|<div[\s>]|<p[\s>]|<article[\s>]|<main[\s>])/i.test(
      raw,
    ) || /<\/(html|body|article|main)\s*>/i.test(raw)

  if (looksHtml) return extractHtmlParts(raw)

  const plain = raw.replace(/\r\n?/g, '\n').trim()
  // Reading relays (e.g. r.jina.ai) prefix plain output with `Title: …`.
  const titleMatch = plain.match(/^Title:[ \t]*(.+)$/m)
  return {
    text: plain.length >= MIN_TEXT_LENGTH ? plain.slice(0, MAX_TEXT_LENGTH) : '',
    title: titleMatch ? titleMatch[1].trim().slice(0, 300) : '',
  }
}

/**
 * Attempt to retrieve readable content for a web address.
 *
 * 1. Direct fetch — succeeds when the site allows cross-origin reads.
 * 2. A public reading relay as a fallback for ordinary pages whose CORS
 *    headers block the browser (still public content only, no keys).
 * 3. Anything else → { status: 'blocked' } so the page can show the
 *    "paste the text or upload a screenshot" fallback.
 *
 * On success the result also carries source facts (domain, HTTPS status,
 * page title, official-domain match) so the UI can show WHAT was reached
 * without ever implying that reaching it makes its claims legitimate.
 *
 * @param {string} rawUrl
 * @returns {Promise<{status:'ok', url, text, title, domain, https, official} | {status:'invalid'} | {status:'blocked', url, domain, https, official}>}
 */
export async function fetchPageText(rawUrl) {
  const url = normalizeUrl(rawUrl)
  if (!url) return { status: 'invalid' }

  const parsed = new URL(url)
  const facts = {
    url,
    domain: parsed.hostname,
    https: parsed.protocol === 'https:',
    official: isOfficialDomain(parsed.hostname),
  }

  let out = null

  // 1) Direct fetch — succeeds when the site allows cross-origin reads.
  const direct = await getRaw(url, { enforceType: true })
  if (direct) out = textFromBody(direct.body)

  // 2) Public reading relay #1 — raw HTML of public pages (keyless).
  if (!out || !out.text) {
    const relay = await getRaw(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`, {
      timeoutMs: 12000,
      enforceType: false,
    })
    if (relay) {
      const part = textFromBody(relay.body)
      if (part.text) out = part
    }
  }

  // 3) Public reading relay #2 — readable plain text, CORS-enabled (keyless).
  if (!out || !out.text) {
    const relay = await getRaw(`https://r.jina.ai/${url}`, {
      timeoutMs: 15000,
      enforceType: false,
    })
    if (relay) {
      const part = textFromBody(relay.body)
      if (part.text) out = part
    }
  }

  if (!out || !out.text) return { status: 'blocked', ...facts }

  return { status: 'ok', ...facts, text: out.text, title: out.title || '' }
}

export default fetchPageText
