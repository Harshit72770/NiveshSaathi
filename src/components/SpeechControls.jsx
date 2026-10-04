import { useEffect, useRef, useState } from 'react'

import Icon from './Icon.jsx'
import Button from './Button.jsx'
import { useLanguage, getLanguageMeta } from '../i18n/index.js'
import { isSpeechSupported, speakText, stopSpeech } from '../utils/speech.js'

/**
 * ===========================================================================
 * Track C — Voice controls (free browser Text-to-Speech)
 * ===========================================================================
 *
 * Reads an explanation aloud in the language the user selected. Everything
 * happens on the device — no audio leaves the browser, no paid voice API.
 *
 * Controls: Listen · Pause · Resume · Stop.
 *
 * Graceful degradation:
 *   - No Web Speech API  -> a short notice; the text explanation stays visible.
 *   - No matching voice  -> the browser's default voice is used (see speech.js).
 *   - Any error          -> a short message; the text still shows.
 * ===========================================================================
 */

export default function SpeechControls({ text, langCode, className = '' }) {
  const { language, t } = useLanguage()
  const code = langCode || language

  const [status, setStatus] = useState(() => (isSpeechSupported() ? 'idle' : 'unsupported'))
  const controllerRef = useRef(null)

  // A new explanation or language resets playback; leaving the page stops it.
  useEffect(() => {
    stopSpeech()
    controllerRef.current = null
    setStatus(isSpeechSupported() ? 'idle' : 'unsupported')
  }, [text, code])

  useEffect(() => () => stopSpeech(), [])

  const supported = status !== 'unsupported'
  const speaking = status === 'speaking'
  const paused = status === 'paused'

  const listen = () => {
    if (!isSpeechSupported()) {
      setStatus('unsupported')
      return
    }
    const ctrl = speakText(text, code, (s) => {
      if (s === 'speaking') setStatus('speaking')
      else if (s === 'paused') setStatus('paused')
      else if (s === 'ended') setStatus('idle')
      else if (s === 'error') setStatus('error')
    })
    controllerRef.current = ctrl
  }

  const pause = () => {
    controllerRef.current?.pause()
    setStatus('paused')
  }

  const resume = () => {
    controllerRef.current?.resume()
    setStatus('speaking')
  }

  const stop = () => {
    controllerRef.current?.stop()
    controllerRef.current = null
    setStatus('idle')
  }

  if (!supported) {
    return (
      <div className={`speech-controls ${className}`.trim()}>
        <div className="notice notice--info" style={{ alignItems: 'flex-start' }}>
          <span className="notice__icon">
            <Icon name="volume" size={18} />
          </span>
          <div className="small">{t('ai.voice.unsupported')}</div>
        </div>
      </div>
    )
  }

  const meta = getLanguageMeta(code)

  return (
    <div className={`speech-controls ${className}`.trim()}>
      <div className="speech-controls__row" role="group" aria-label={t('ai.voice.title')}>
        <Button
          variant="soft"
          size="sm"
          icon="volume"
          onClick={listen}
          disabled={speaking || paused}
        >
          {t('ai.voice.listen')}
        </Button>
        <Button variant="ghost" size="sm" icon="pause" onClick={pause} disabled={!speaking}>
          {t('ai.voice.pause')}
        </Button>
        <Button variant="ghost" size="sm" icon="play" onClick={resume} disabled={!paused}>
          {t('ai.voice.resume')}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          icon="stop"
          onClick={stop}
          disabled={!speaking && !paused}
        >
          {t('ai.voice.stop')}
        </Button>

        <span className="speech-controls__lang" title={meta.english}>
          <Icon name="language" size={13} />
          {meta.native}
        </span>
      </div>

      {(speaking || paused) && (
        <span className="badge badge--neutral" role="status" aria-live="polite">
          <Icon name={speaking ? 'volume' : 'pause'} size={12} />
          {speaking ? t('ai.voice.playing') : t('ai.voice.paused')}
        </span>
      )}

      {status === 'error' && (
        <div className="small text-muted" style={{ marginTop: 8 }} role="status" aria-live="polite">
          {t('ai.voice.error')}
        </div>
      )}
    </div>
  )
}
