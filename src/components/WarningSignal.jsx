import Icon from './Icon.jsx'
import { useLanguage, tv } from '../i18n/index.js'

/**
 * Single warning signal row with an explanation of WHY it was detected.
 * Never states that the content is fraudulent.
 *
 * `signal.labelKey` / `signal.whyKey` come from the analyzer; the English
 * `label` / `why` strings remain as the fallback.
 */
export default function WarningSignal({ signal }) {
  const { t } = useLanguage()
  const high = signal.severity === 'high'

  return (
    <div className={`signal${high ? ' signal--high' : ''}`} role="note">
      <span className="signal__icon">
        <Icon name={high ? 'alert' : 'info'} size={20} />
      </span>
      <div style={{ minWidth: 0 }}>
        <div className="signal__title">{tv(t, signal.labelKey, signal.label)}</div>
        <p className="signal__why">{tv(t, signal.whyKey, signal.why)}</p>

        {signal.matches && signal.matches.length > 0 && (
          <div className="signal__meta">
            {t('evidence.matched')}{' '}
            {signal.matches.map((m, i) => (
              <span key={i}>
                {i > 0 && ' · '}
                <em>&ldquo;{m}&rdquo;</em>
              </span>
            ))}
          </div>
        )}

        <div className="signal__meta" style={{ fontStyle: 'italic' }}>
          {t('safety.signalNotProof')}
        </div>
      </div>
    </div>
  )
}
