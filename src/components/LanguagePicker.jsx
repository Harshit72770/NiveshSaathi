import { useEffect, useRef } from 'react'
import Icon from './Icon.jsx'
import { useLanguage } from '../i18n/index.js'

/**
 * First-visit "Choose your language" screen.
 *
 * Shown once (niveshsaathi_language_seen). No account, no signup, no data.
 * Selecting a language saves it and continues straight into the app.
 */
export default function LanguagePicker() {
  const { languages, setLanguage, dismissPicker, t, language } = useLanguage()
  const ref = useRef(null)

  // Focus the dialog when it appears so keyboard users land inside it.
  useEffect(() => {
    ref.current?.focus()
  }, [])

  // Escape closes (keeping the default language) and Tab is trapped inside
  // the dialog, so background content can never receive focus.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        dismissPicker()
        return
      }
      if (e.key !== 'Tab') return

      const node = ref.current
      if (!node) return
      const focusables = [...node.querySelectorAll('button, [href], input, select, textarea')].filter(
        (el) => !el.disabled && el.offsetParent !== null,
      )
      if (focusables.length === 0) return

      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [dismissPicker])

  return (
    <div className="picker-overlay" role="presentation">
      <div
        className="picker-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="picker-title"
        aria-describedby="picker-subtitle"
        tabIndex={-1}
        ref={ref}
      >
        <div className="picker-dialog__badge" aria-hidden="true">
          <Icon name="shield" size={26} strokeWidth={2.1} />
        </div>

        <h2 id="picker-title" className="picker-dialog__title">
          {t('picker.title')}
        </h2>
        <p id="picker-subtitle" className="picker-dialog__sub">
          {t('picker.subtitle')}
        </p>

        <ul className="picker-grid">
          {languages.map((l) => {
            const selected = l.code === language
            return (
              <li key={l.code}>
                <button
                  type="button"
                  className={`picker-grid__item${selected ? ' is-selected' : ''}`}
                  lang={l.code}
                  dir={l.dir}
                  onClick={() => setLanguage(l.code)}
                >
                  <span className="picker-grid__native">{l.native}</span>
                  <span className="picker-grid__english">{l.english}</span>
                </button>
              </li>
            )
          })}
        </ul>

        <div className="picker-dialog__foot">
          <button type="button" className="btn btn--ghost btn--sm" onClick={dismissPicker}>
            {t('picker.continueEnglish')}
          </button>
        </div>
      </div>
    </div>
  )
}
