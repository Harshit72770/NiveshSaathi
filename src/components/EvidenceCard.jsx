import Icon from './Icon.jsx'
import WarningSignal from './WarningSignal.jsx'
import { useLanguage, tv, contentTypeLabel } from '../i18n/index.js'

function Block({ icon, title, children }) {
  return (
    <div className="ev-block">
      <div className="ev-block__title">
        <Icon name={icon} size={15} />
        {title}
      </div>
      <div className="ev-block__content">{children}</div>
    </div>
  )
}

function typeSlug(contentType) {
  return String(contentType || '')
    .toLowerCase()
    .replace(/[^a-z]/g, '')
}

/**
 * Evidence Card — the core output of Track E.
 * Reports claims, evidence, gaps and uncertainty. Never a score or a verdict.
 *
 * Text comes from the analyzer's stable `*Keys` arrays so the card follows the
 * selected language without touching the rule engine itself.
 */
export default function EvidenceCard({ result }) {
  const { t } = useLanguage()

  if (!result || result.isEmpty) return null

  const list = (strings, keys) =>
    (strings || []).map((text, i) => tv(t, keys?.[i], text))

  const slug = typeSlug(result.contentType)

  return (
    <article className="evidence animate-in" aria-label={t('evidence.ariaLabel')}>
      <header className="evidence__head">
        <Icon name="doc" size={30} strokeWidth={1.7} />
        <div>
          <h3>{t('evidence.title')}</h3>
          <p>{t('evidence.subtitle')}</p>
        </div>
      </header>

      <div className="evidence__body">
        <Block icon="target" title={t('evidence.claim')}>
          <div className="quote-block">{result.claim}</div>
        </Block>

        <Block icon="filter" title={t('evidence.contentType')}>
          <p style={{ margin: 0 }}>
            <span className="badge">{contentTypeLabel(t, result.contentType)}</span>
          </p>
          <p className="text-muted small" style={{ margin: '9px 0 0' }}>
            {tv(t, `contentTypes.${slug}.desc`, t('evidence.mixedTypeFallback'))}
          </p>
        </Block>

        <Block icon="checkCircle" title={t('evidence.evidenceProvided')}>
          {result.evidence.length > 0 ? (
            <ul className="ev-list ev-list--have">
              {list(result.evidence, result.evidenceKeys).map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted" style={{ margin: 0 }}>
              {t('evidence.evidenceEmpty')}
            </p>
          )}
        </Block>

        <Block icon="search" title={t('evidence.missingEvidence')}>
          <ul className="ev-list ev-list--missing">
            {list(result.missingEvidence, result.missingEvidenceKeys).map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </Block>

        <Block
          icon="alert"
          title={t('evidence.warningSignals', { count: result.signalCount })}
        >
          {result.signalCount > 0 ? (
            <>
              {result.warningSignals.map((s) => (
                <WarningSignal key={s.id} signal={s} />
              ))}
            </>
          ) : (
            <div className="notice notice--ok" style={{ marginTop: 2 }}>
              <span className="notice__icon">
                <Icon name="checkCircle" size={18} />
              </span>
              <div>
                <strong>{t('evidence.noSignalsTitle')}</strong>
                <div className="small text-muted" style={{ marginTop: 4 }}>
                  {t('evidence.noSignalsBody')}
                </div>
              </div>
            </div>
          )}
        </Block>

        <Block icon="help" title={t('evidence.uncertainty')}>
          <p className="text-muted small" style={{ margin: '0 0 9px' }}>
            {t('evidence.uncertaintyIntro')}
          </p>
          <ul className="ev-list ev-list--neutral">
            {list(result.uncertainty, result.uncertaintyKeys).map((u, i) => (
              <li key={i}>{u}</li>
            ))}
          </ul>
        </Block>

        <Block icon="compass" title={t('evidence.intendedAction')}>
          <ul className="ev-list ev-list--neutral">
            {list(result.intendedAction, result.intendedActionKeys).map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </Block>

        <Block icon="eye" title={t('evidence.independentVerification')}>
          <p style={{ margin: '0 0 12px' }}>{t('evidence.verifyIntro')}</p>
          <div className="stack-sm">
            {result.verificationSources.map((v, i) => (
              <div key={v.key || v.label} className="notice notice--info">
                <span className="notice__icon">
                  <Icon name="link" size={17} />
                </span>
                <div>
                  <strong>{tv(t, `verify.${v.key}.label`, v.label)}</strong>
                  <div className="small" style={{ marginTop: 3 }}>
                    {tv(t, `verify.${v.key}.detail`, v.detail)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Block>

        <div
          className="notice"
          style={{ marginTop: 20, background: '#f8fafc', borderStyle: 'dashed' }}
        >
          <span className="notice__icon">
            <Icon name="info" size={18} />
          </span>
          <div className="small">
            <strong>{t('evidence.importantTitle')}</strong> {t('evidence.importantBody')}
          </div>
        </div>
      </div>
    </article>
  )
}
