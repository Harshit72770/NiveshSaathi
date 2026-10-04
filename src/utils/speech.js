/**
 * ===========================================================================
 * NiveshSaathi — browser Text-to-Speech helper (Web Speech API)
 * ===========================================================================
 *
 * Track C reads an AI explanation aloud using the browser's built-in
 * `window.speechSynthesis`. This is:
 *   - FREE — no paid voice API, no API key, no dependency added;
 *   - PRIVATE — speech is synthesised on the device; nothing is uploaded
 *     and no audio is ever sent to Groq or anywhere else;
 *   - OPTIONAL — every function degrades gracefully when a browser or an
 *     installed voice is unavailable, and never throws into the UI.
 *
 * Only used by src/components/SpeechControls.jsx.
 * ===========================================================================
 */

/** App language code -> a sensible BCP-47 tag for speech synthesis. */
const LANG_TO_BCP47 = {
  en: 'en-IN',
  hi: 'hi-IN',
  bn: 'bn-IN',
  te: 'te-IN',
  mr: 'mr-IN',
  ta: 'ta-IN',
  gu: 'gu-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  pa: 'pa-IN',
  or: 'or-IN',
  as: 'as-IN',
  ur: 'ur-IN',
}

/** Is the Web Speech API available in this browser at all? */
export function isSpeechSupported() {
  return (
    typeof window !== 'undefined' &&
    typeof window.speechSynthesis !== 'undefined' &&
    typeof window.SpeechSynthesisUtterance === 'function'
  )
}

/** BCP-47 tag for an app language code (defaults to en-IN). */
export function speechLangFor(code) {
  return LANG_TO_BCP47[code] || 'en-IN'
}

/** The current voice list ([] when unsupported or on any error). */
function getVoices() {
  if (!isSpeechSupported()) return []
  try {
    return window.speechSynthesis.getVoices() || []
  } catch {
    return []
  }
}

/**
 * Voices load asynchronously in several browsers (notably Chrome fires
 * `voiceschanged`). Resolve with whatever is available, waiting briefly.
 */
export function waitForVoices(timeoutMs = 1200) {
  return new Promise((resolve) => {
    if (!isSpeechSupported()) return resolve([])

    const existing = getVoices()
    if (existing.length) return resolve(existing)

    let settled = false
    const finish = () => {
      if (settled) return
      settled = true
      try {
        window.speechSynthesis.removeEventListener('voiceschanged', finish)
      } catch {
        /* ignore */
      }
      resolve(getVoices())
    }

    try {
      window.speechSynthesis.addEventListener('voiceschanged', finish)
    } catch {
      /* ignore — older browsers only support onvoiceschanged */
    }
    window.setTimeout(finish, timeoutMs)
  })
}

/**
 * Pick the best available voice for a language.
 * Preference: exact BCP-47 match -> same base language -> null.
 * Returning null lets the browser use its own default voice.
 */
export function pickVoice(code, voices = getVoices()) {
  if (!voices || !voices.length) return null
  const target = speechLangFor(code).toLowerCase()
  const base = target.split('-')[0]

  return (
    voices.find((v) => String(v.lang || '').toLowerCase() === target) ||
    voices.find((v) => String(v.lang || '').toLowerCase().split('-')[0] === base) ||
    null
  )
}

/**
 * Speak `text` in `code`, reporting state changes through `onState`.
 * Returns a small controller: { pause, resume, stop, dispose }.
 * `onState` receives: 'speaking' | 'paused' | 'ended' | 'error'.
 */
export function speakText(text, code, onState) {
  if (!isSpeechSupported()) return null

  const synth = window.speechSynthesis
  const emit = (s) => {
    try {
      onState && onState(s)
    } catch {
      /* a listener must never break speech */
    }
  }

  try {
    synth.cancel()
    const utter = new window.SpeechSynthesisUtterance(String(text))
    utter.lang = speechLangFor(code)
    const voice = pickVoice(code)
    if (voice) utter.voice = voice
    utter.rate = 0.95
    utter.pitch = 1

    utter.onstart = () => emit('speaking')
    utter.onpause = () => emit('paused')
    utter.onresume = () => emit('speaking')
    utter.onend = () => emit('ended')
    utter.onerror = () => emit('error')

    synth.speak(utter)

    return {
      pause: () => {
        try {
          synth.pause()
        } catch {
          /* ignore */
        }
      },
      resume: () => {
        try {
          synth.resume()
        } catch {
          /* ignore */
        }
      },
      stop: () => {
        try {
          synth.cancel()
        } catch {
          /* ignore */
        }
        emit('ended')
      },
    }
  } catch {
    emit('error')
    return null
  }
}

/** Cancel any speech currently playing (safe to call anywhere). */
export function stopSpeech() {
  if (!isSpeechSupported()) return
  try {
    window.speechSynthesis.cancel()
  } catch {
    /* ignore */
  }
}
