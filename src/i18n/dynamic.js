/**
 * ===========================================================================
 * translateDynamicContent — future AI translation seam
 * ===========================================================================
 *
 * TODAY: this is a local, offline no-op. NiveshSaathi ships zero API keys and
 * makes zero network calls. Anything that arrives here (an analyst's pasted
 * text, a generated summary) is returned unchanged.
 *
 * TOMORROW: when a server-side translation endpoint exists, register it with
 * setTranslationProvider(). The provider runs on YOUR backend, where the
 * Groq/LLM key lives — never in the browser bundle.
 *
 *   // server route (pseudocode — never shipped to the client)
 *   app.post('/api/translate', async (req, res) => {
 *     const { text, targetLanguage } = req.body
 *     const out = await llm.translate({ text, targetLanguage })
 *     res.json({ text: out })
 *   })
 *
 *   // client
 *   setTranslationProvider(async ({ text, targetLanguage }) => {
 *     const r = await fetch('/api/translate', {
 *       method: 'POST',
 *       headers: { 'Content-Type': 'application/json' },
 *       body: JSON.stringify({ text, targetLanguage }),
 *     })
 *     return (await r.json()).text
 *   })
 *
 * Rules that must survive any future integration:
 *  - No API key in frontend code.
 *  - Never translate into a verdict: the analyzer output stays an Evidence
 *    Card (no probability %, no TRUE/FALSE, no "this is a scam").
 *  - Static UI strings always come from the local dictionaries in
 *    ./languages/*.js — they are never fetched at runtime.
 */

/** @type {null | ((args: {text: string, targetLanguage: string}) => Promise<string> | string)} */
let provider = null

/** Register (or clear, by passing null) a server-side translation provider. */
export function setTranslationProvider(fn) {
  provider = typeof fn === 'function' ? fn : null
}

export function hasTranslationProvider() {
  return provider !== null
}

/**
 * Translate free-form, dynamically generated text.
 *
 * @param {string} text        - text produced at runtime
 * @param {string} targetLanguage - BCP-47 / language code, e.g. 'hi', 'bn'
 * @returns {Promise<string>}  - translated text, or the input when no
 *                               provider is registered (current behaviour)
 */
export async function translateDynamicContent(text, targetLanguage) {
  const input = text == null ? '' : String(text)
  if (!input.trim() || !provider) return input

  try {
    const out = await provider({ text: input, targetLanguage })
    return typeof out === 'string' && out.trim() ? out : input
  } catch {
    // A failed translation must never break the UI — fall back to the source.
    return input
  }
}

export default translateDynamicContent
