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

/** Four-level assessment presentation (link analyses only — see utils/assessment.js). */
const LEVEL_TONE = {
  legit: 'notice--ok',
  verify: 'notice--info',
  caution: 'notice--warn',
  warning: 'notice--stop',
}

const LEVEL_ICON = { legit: '🟢', verify: '🟡', caution: '🟠', warning: '🔴' }

/**
 * Evidence Card — the core output of Track E.
 * Reports claims, evidence, gaps and uncertainty. Never a score or a verdict.
 *
 * Text comes from the analyzer's stable `*Keys` arrays so the card follows the
 * selected language without touching the rule engine itself.
 *
 * Report order (Track E flow): overall assessment (link analyses) → source →
 * claim → classify → warning signals → evidence → missing context → intended
 * action → uncertainty → independent verification.
 *
 * `result.source` (set by the Check page when the text came from an uploaded
 * screenshot or a fetched link) is shown for transparency only — source
 * legitimacy is never presented as claim truth.
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
        {/* ---------------------------------------- 1. OVERALL ASSESSMENT */}
        {result.assessment && (
          <div
            className={`notice ${LEVEL_TONE[result.assessment.level] || 'notice--info'}`}
            style={{ margin: '16px 0 0' }}
            role="status"
          >
            <span className="notice__icon" style={{ fontSize: 17, marginTop: 0 }}>
              {LEVEL_ICON[result.assessment.level] || '🟡'}
            </span>
            <div style={{ minWidth: 0 }}>
              <div className="row" style={{ gap: 8 }}>
                <strong>{t('assessment.title')}</strong>
                <span className="badge">
                  {t(`assessment.levels.${result.assessment.level}.label`)}
                </span>
              </div>
              <div className="small" style={{ marginTop: 4 }}>
                {t(`assessment.levels.${result.assessment.level}.body`)}
              </div>

              {result.assessment.positives.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  <strong style={{ fontSize: '0.83rem' }}>
                    {t('assessment.positiveTitle')}
                  </strong>
                  <ul className="ev-list ev-list--have" style={{ marginTop: 6 }}>
                    {result.assessment.positives.map((p) => (
                      <li key={p.key} className="small">
                        {t(p.key, p.vars)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------- 2. SOURCE / URL INFO */}
        {result.source && (
          <div className="notice notice--info" style={{ margin: '16px 0 0' }}>
            <span className="notice__icon">
              <Icon name={result.source.type === 'link' ? 'link' : 'doc'} size={17} />
            </span>
            <div className="small" style={{ minWidth: 0 }}>
              <strong>
                {result.source.type === 'link'
                  ? t('sourceInfo.title')
                  : t('checkContent.source.title')}
              </strong>{' '}
              <span style={{ wordBreak: 'break-all', unicodeBidi: 'isolate' }}>
                {result.source.type === 'link' ? result.source.url : t('checkContent.source.image')}
              </span>

              {result.source.type === 'link' && (
                <div className="stack-sm" style={{ marginTop: 7 }}>
                  <div>
                    <strong>{t('sourceInfo.domain')}:</strong>{' '}
                    <span style={{ wordBreak: 'break-all', unicodeBidi: 'isolate' }}>
                      {result.source.domain}
                    </span>
                  </div>
                  <div>
                    <strong>{t('sourceInfo.secureLabel')}:</strong>{' '}
                    {result.source.https ? t('sourceInfo.secureYes') : t('sourceInfo.secureNo')}
                  </div>
                  <div>
                    <strong>{t('sourceInfo.pageTitle')}:</strong>{' '}
                    {result.source.title ? (
                      result.source.title
                    ) : (
                      <span className="text-muted">{t('sourceInfo.noTitle')}</span>
                    )}
                  </div>
                  <div>{t('sourceInfo.retrieved')}</div>
                </div>
              )}

              <div className="text-muted" style={{ marginTop: 7 }}>
                {result.source.type === 'link'
                  ? t('sourceInfo.linkNote')
                  : t('checkContent.source.caveat')}
              </div>
            </div>
          </div>
        )}

        {/* --------------------------------------------- 3. THE CLAIM */}
        <Block icon="target" title={t('evidence.claim')}>
          <div className="quote-block">{result.claim}</div>
        </Block>

        {/* ------------------------------------------ 4. CLASSIFY (type) */}
        <Block icon="filter" title={t('evidence.contentType')}>
          <p style={{ margin: 0 }}>
            <span className="badge">{contentTypeLabel(t, result.contentType)}</span>
          </p>
          <p className="text-muted small" style={{ margin: '9px 0 0' }}>
            {tv(t, `contentTypes.${slug}.desc`, t('evidence.mixedTypeFallback'))}
          </p>
        </Block>

        {/* ----------------------------------------- 5. WARNING SIGNALS */}
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

        {/* ----------------------------------------- 6. EVIDENCE FOUND */}
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

        {/* --------------------------------------- 7. MISSING CONTEXT */}
        <Block icon="search" title={t('evidence.missingEvidence')}>
          <ul className="ev-list ev-list--missing">
            {list(result.missingEvidence, result.missingEvidenceKeys).map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </Block>

        {/* --------------------------------------- 8. INTENDED ACTION */}
        <Block icon="compass" title={t('evidence.intendedAction')}>
          <ul className="ev-list ev-list--neutral">
            {list(result.intendedAction, result.intendedActionKeys).map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </Block>

        {/* ---------------------------------------- 9. UNCERTAINTY */}
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

        {/* -------------------------------- 10. INDEPENDENT VERIFICATION */}
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
