import { useState } from 'react'

import Icon from './Icon.jsx'
import Button from './Button.jsx'
import { useLanguage } from '../i18n/index.js'

/**
 * ===========================================================================
 * AI-Assisted Analysis panel
 * ===========================================================================
 *
 * Renders the server-side AI interpretation returned by
 * POST /api/ai/analyze. It is shown ALONGSIDE — never instead of —
 * the deterministic NiveshSaathi analysis:
 *
 *   - Everything produced by the rule engine keeps its existing
 *     "Detected by NiveshSaathi rules" presentation (EvidenceCard).
 *   - Everything in this panel is explicitly labelled
 *     "AI interpretation".
 *
 * The panel never assigns a verdict, a score or a percentage; the AI
 * response schema is fixed by the server and contains only qualitative
 * fields. If the AI request fails, the panel shows the required
 * "temporarily unavailable" notice and the rule-based result above it
 * remains fully intact.
 *
 * Props:
 *   state     — 'idle' | 'loading' | 'error' | 'done'
 *   analysis  — validated AI response object (when state === 'done')
 *   track     — 'A' | 'B' | 'C' | 'D' | 'E'
 *   onRetry   — re-run the AI request
 * ===========================================================================
 */

function Section({ icon, title, children, tone }) {
  return (
    <div className="ev-block">
      <div
        className="ev-block__title"
        style={tone === 'warn' ? { color: 'var(--amber-700)' } : undefined}
      >
        <Icon name={icon} size={15} />
        {title}
      </div>
      <div className="ev-block__content">{children}</div>
    </div>
  )
}

function List({ items, tone = 'neutral', emptyText }) {
  if (!items || items.length === 0) {
    return <p className="text-muted" style={{ margin: 0 }}>{emptyText}</p>
  }
  return (
    <ul className={`ev-list ev-list--${tone}`} style={{ marginTop: 4 }}>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  )
}

/** Numbered list — used for reflection questions. */
function OrderedList({ items, emptyText }) {
  if (!items || items.length === 0) {
    return <p className="text-muted" style={{ margin: 0 }}>{emptyText}</p>
  }
  return (
    <ol
      className="ev-list ev-list--neutral"
      style={{ marginTop: 4, paddingInlineStart: 22, listStyle: 'decimal', display: 'grid', gap: 7 }}
    >
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ol>
  )
}

/**
 * Track B — the AI grievance draft, with a one-tap copy control.
 * The text is only ever shown and copied; it is never sent anywhere and
 * never modifies the user's own local draft above it.
 */
function DraftBlock({ text }) {
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <>
      <pre className="draft-block">{text}</pre>
      <div className="row" style={{ marginTop: 10 }}>
        <Button variant="soft" size="sm" icon="copy" onClick={copy}>
          {copied ? t('common.copied') : t('ai.copyDraft')}
        </Button>
      </div>
    </>
  )
}

export default function AiAnalysisPanel({ state, analysis, track, onRetry }) {
  const { t } = useLanguage()

  if (state === 'idle') return null

  const trackKey = `ai.tracks.${track}`

  return (
    <section className="card card--pad-lg animate-in" aria-label={t('ai.title')}>
      <div
        className="row row--between"
        style={{ alignItems: 'flex-start', gap: 12 }}
      >
        <div className="ev-block__title" style={{ marginBottom: 0 }}>
          <Icon name="sparkle" size={15} />
          {t('ai.title')}
        </div>
        <span className="badge badge--neutral">{t('ai.badgeAi')}</span>
      </div>

      <p className="small text-muted" style={{ margin: '6px 0 18px' }}>
        {t('ai.subtitle')}
      </p>

      {/* ------------------------------------------------------- LOADING */}
      {state === 'loading' && (
        <div className="notice notice--info">
          <span className="notice__icon">
            <Icon name="compass" size={18} />
          </span>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="small" style={{ marginBottom: 8 }}>
              {t('ai.loading')}
            </div>
            <div
              className="progress"
              role="progressbar"
              aria-label={t('ai.loading')}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={50}
            >
              <div className="progress__fill ai-progress__fill" />
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------- ERROR (AI unavailable) */}
      {state === 'error' && (
        <div className="notice notice--warn">
          <span className="notice__icon">
            <Icon name="alert" size={18} />
          </span>
          <div style={{ minWidth: 0 }}>
            <strong>{t('ai.unavailableTitle')}</strong>
            <div className="small" style={{ marginTop: 4 }}>
              {t('ai.unavailableBody')}
            </div>
            {onRetry && (
              <div className="row" style={{ marginTop: 10 }}>
                <Button variant="soft" size="sm" icon="refresh" onClick={onRetry}>
                  {t('ai.retry')}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------ DONE */}
      {state === 'done' && analysis && (
        <div className="stack">
          {/* Track the AI ran — keeps A–E behaviour explicit in the UI */}
          <div className="row" style={{ gap: 8 }}>
            <span className="badge badge--neutral">
              <Icon name="compass" size={12} />
              {t(trackKey)}
            </span>
          </div>

          {/* 1. AI Summary */}
          <Section icon="target" title={t('ai.summary')}>
            <p style={{ margin: 0, lineHeight: 1.7 }}>{analysis.summary}</p>
          </Section>

          {/* 2. Track-specific insight */}
          {analysis.trackSpecificInsight && (
            <div className="notice notice--info">
              <span className="notice__icon">
                <Icon name="sparkle" size={17} />
              </span>
              <div>
                <strong>{t('ai.trackInsight')}</strong>
                <div className="small" style={{ marginTop: 4, lineHeight: 1.65 }}>
                  {analysis.trackSpecificInsight}
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------- Track B — rights & grievance */}
          {track === 'B' && analysis.situationUnderstanding && (
            <Section icon="help" title={t('ai.situationUnderstanding')}>
              <p style={{ margin: 0, lineHeight: 1.7 }}>{analysis.situationUnderstanding}</p>
            </Section>
          )}

          {track === 'B' && (
            <Section icon="folder" title={t('ai.relevantDocuments')}>
              <List items={analysis.relevantDocuments} emptyText={t('ai.emptyList')} />
            </Section>
          )}

          {track === 'B' && analysis.grievanceDraft && (
            <Section icon="doc" title={t('ai.grievanceDraft')}>
              <DraftBlock text={analysis.grievanceDraft} />
              <div className="small text-muted" style={{ marginTop: 8 }}>
                {t('ai.grievanceDraftNote')}
              </div>
            </Section>
          )}

          {track === 'B' && analysis.nextStepExplanation && (
            <Section icon="compass" title={t('ai.nextStep')}>
              <p style={{ margin: 0, lineHeight: 1.7 }}>{analysis.nextStepExplanation}</p>
            </Section>
          )}

          {/* ------------------------------------------- Track C — education */}
          {track === 'C' && analysis.everydayExample && (
            <Section icon="chart" title={t('ai.everydayExample')}>
              <p style={{ margin: 0, lineHeight: 1.7 }}>{analysis.everydayExample}</p>
            </Section>
          )}

          {/* --------------------------------- Track D — behavioural reflection */}
          {track === 'D' && (
            <>
              <Section icon="eye" title={t('ai.observedPatterns')}>
                <List
                  items={analysis.observedPatterns}
                  tone="missing"
                  emptyText={t('ai.noPatterns')}
                />
              </Section>

              {analysis.whyItMayMatter && (
                <Section icon="info" title={t('ai.whyItMayMatter')}>
                  <p style={{ margin: 0, lineHeight: 1.7 }}>{analysis.whyItMayMatter}</p>
                </Section>
              )}

              <Section icon="help" title={t('ai.reflectionQuestions')}>
                <OrderedList items={analysis.reflectionQuestions} emptyText={t('ai.emptyList')} />
              </Section>

              {analysis.coolingOffSuggestion && (
                <div className="notice notice--info" style={{ alignItems: 'flex-start' }}>
                  <span className="notice__icon">
                    <Icon name="pause" size={18} />
                  </span>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div className="ev-block__title" style={{ marginBottom: 4 }}>
                      {t('ai.coolingOff')}
                    </div>
                    <div className="small" style={{ lineHeight: 1.65 }}>
                      {analysis.coolingOffSuggestion}
                    </div>
                  </div>
                </div>
              )}

              <Section icon="shield" title={t('ai.saferProcess')}>
                <List
                  items={analysis.saferDecisionProcess}
                  tone="have"
                  emptyText={t('ai.emptyList')}
                />
              </Section>

              <div className="row">
                <Button to="/before-invest" variant="soft" size="sm" icon="pause">
                  {t('ai.coolingOffButton')}
                </Button>
              </div>
            </>
          )}

          {/* Content-claim view — Tracks A, B, C, E. Hidden for Track D,
              where a personal reflection has no "claims" to assess. */}
          {track !== 'D' && (
            <>
          {/* 3. What is being claimed? */}
          <Section icon="doc" title={t('ai.claimed')}>
            <List
              items={analysis.whatIsBeingClaimed}
              emptyText={t('ai.emptyList')}
            />
          </Section>

          {/* 4. What is this content trying to make you do? */}
          <Section icon="compass" title={t('ai.tryingToDo')}>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              {analysis.whatContentIsTryingToDo}
            </p>
          </Section>

          {/* 5. AI warning signals — explicitly an AI interpretation */}
          <div
            className="notice notice--warn"
            style={{ alignItems: 'flex-start' }}
          >
            <span className="notice__icon" style={{ marginTop: 0 }}>
              <Icon name="alert" size={18} />
            </span>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                className="ev-block__title"
                style={{ color: 'var(--amber-700)', marginBottom: 6 }}
              >
                {t('ai.warningSignals')}
              </div>
              <List
                items={analysis.aiWarningSignals}
                tone="missing"
                emptyText={t('ai.noWarningSignals')}
              />
              <div className="small text-muted" style={{ marginTop: 8 }}>
                {t('ai.warningSignalsNote')}
              </div>
            </div>
          </div>

          {/* 6. Supporting evidence */}
          <Section icon="checkCircle" title={t('ai.supportingEvidence')}>
            <List
              items={analysis.supportingEvidence}
              tone="have"
              emptyText={t('ai.emptyEvidence')}
            />
          </Section>

          {/* 7. Missing context */}
          <Section icon="search" title={t('ai.missingContext')}>
            <List
              items={analysis.missingContext}
              tone="missing"
              emptyText={t('ai.emptyList')}
            />
          </Section>
            </>
          )}

          {/* 8. Uncertainty */}
          <Section icon="help" title={t('ai.uncertainty')}>
            <p style={{ margin: 0, lineHeight: 1.7 }}>{analysis.uncertainty}</p>
          </Section>

          {/* 9. How to verify independently */}
          {track !== 'D' && (
          <Section icon="eye" title={t('ai.verification')}>
            {analysis.verificationSteps.length > 0 ? (
              <ol
                style={{
                  margin: '4px 0 0',
                  paddingLeft: 22,
                  display: 'grid',
                  gap: 7,
                  fontSize: '0.95rem',
                  color: 'var(--ink-soft)',
                }}
              >
                {analysis.verificationSteps.map((step, i) => (
                  <li key={i} style={{ lineHeight: 1.65 }}>
                    {step}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-muted" style={{ margin: 0 }}>
                {t('ai.emptyList')}
              </p>
            )}
          </Section>
          )}

          {/* 10. Safe next steps */}
          <Section icon="shield" title={t('ai.safeNextSteps')}>
            <List
              items={analysis.safeNextSteps}
              tone="have"
              emptyText={t('ai.emptyList')}
            />
          </Section>

          {/* Disclaimer — AI interpretation, not a verdict */}
          <div
            className="notice"
            style={{ background: '#f8fafc', borderStyle: 'dashed' }}
          >
            <span className="notice__icon">
              <Icon name="info" size={18} />
            </span>
            <div className="small">
              <strong>{t('ai.disclaimerTitle')}</strong> {t('ai.disclaimerBody')}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
