import { useState, useRef } from 'react'

import Icon from './Icon.jsx'
import Button from './Button.jsx'
import AiAnalysisPanel from './AiAnalysisPanel.jsx'
import { fetchAiAnalysis } from '../utils/aiAnalysis.js'
import { formatDate } from '../utils/localStorage.js'
import { useLanguage, optionLabel } from '../i18n/index.js'

const ROW_KEYS = ['why', 'horizon', 'risk', 'evidence', 'reconsider']

/** Compose a journal entry into readable text for the AI request. */
function composeEntryText(entry, t) {
  const lines = [`Title: ${entry.title || ''}`]
  for (const key of ROW_KEYS) {
    const value = entry[key]
    if (value && String(value).trim()) {
      const label = t(`decisions.rows.${key}`)
      lines.push(`${label}: ${value}`)
    }
  }
  if (entry.confidence) {
    lines.push(`${t('decisions.confidence.label')}: ${entry.confidence}`)
  }
  return lines.join('\n')
}

/**
 * One saved decision-journal entry.
 * No score, no ranking — a record the user wrote for themselves.
 *
 * The optional "Analyze with AI" button adds an AI interpretation
 * (Track D) below the entry. It is opt-in, and the entry's own
 * rule-free record above it is never modified.
 */
export default function JournalEntry({ entry, onDelete }) {
  const { language, t, locale } = useLanguage()

  /* AI interpretation (Track D) for this entry only. */
  const [aiState, setAiState] = useState('idle') // idle | loading | done | error
  const [aiResult, setAiResult] = useState(null)
  const aiJobRef = useRef(0)
  const aiRetryRef = useRef(null)

  if (!entry) return null

  const rows = ROW_KEYS.map((k) => ({
    key: k,
    label: t(`decisions.rows.${k}`),
    value: k === 'horizon' ? optionLabel(t, entry[k]) : entry[k],
  })).filter((r) => r.value && String(r.value).trim())

  const confidenceLabel = entry.confidence
    ? `${t('decisions.confidence.prefix')} ${optionLabel(t, entry.confidence)}`
    : ''

  /** Request the AI behavioural reading for this entry. */
  const analyzeEntry = (content) => {
    const job = ++aiJobRef.current
    aiRetryRef.current = content
    setAiResult(null)
    setAiState('loading')
    fetchAiAnalysis({
      track: 'D',
      content,
      language,
      existingAnalysis: {
        framework: 'Track D decision journal',
        ruleBasedObservations: [],
      },
    })
      .then((ai) => {
        if (job !== aiJobRef.current) return
        setAiResult(ai)
        setAiState('done')
      })
      .catch(() => {
        if (job !== aiJobRef.current) return
        setAiResult(null)
        setAiState('error')
      })
  }

  const analyzeWithAi = () => {
    const content = composeEntryText(entry, t)
    if (content.trim()) analyzeEntry(content)
  }

  return (
    <article className="card animate-in">
      <div className="row row--between" style={{ alignItems: 'flex-start', gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <h3 style={{ margin: '0 0 5px', fontSize: '1.05rem' }}>{entry.title}</h3>
          <div className="small text-muted">
            <Icon name="clock" size={13} style={{ verticalAlign: '-2px', marginInlineEnd: 5 }} />
            {formatDate(entry.createdAt, locale)}
          </div>
        </div>

        <div className="row" style={{ gap: 8, flexShrink: 0 }}>
          <Button
            variant="ghost"
            size="sm"
            icon="sparkle"
            onClick={analyzeWithAi}
            disabled={aiState === 'loading'}
          >
            {t('ai.analyzeEntry')}
          </Button>
          {onDelete && (
            <button
              type="button"
              className="btn btn--danger btn--sm"
              onClick={() => onDelete(entry.id)}
              aria-label={t('decisions.deleteLabel', { title: entry.title })}
            >
              <Icon name="trash" size={14} /> {t('common.delete')}
            </button>
          )}
        </div>
      </div>

      <div className="stack-sm" style={{ marginTop: 16 }}>
        {rows.map((r) => (
          <div key={r.key}>
            <div className="ev-block__title" style={{ marginBottom: 5 }}>
              <Icon name="check" size={13} />
              {r.label}
            </div>
            <p
              className="small"
              style={{ margin: 0, color: 'var(--ink-soft)', lineHeight: 1.65 }}
            >
              {r.value}
            </p>
          </div>
        ))}

        {confidenceLabel && (
          <div>
            <div className="ev-block__title" style={{ marginBottom: 5 }}>
              <Icon name="check" size={13} />
              {t('decisions.confidence.label')}
            </div>
            <p
              className="small"
              style={{ margin: 0, color: 'var(--ink-soft)', lineHeight: 1.65 }}
            >
              {confidenceLabel}
            </p>
          </div>
        )}
      </div>

      {/* AI interpretation for this entry — never modifies the record above */}
      {aiState !== 'idle' && (
        <div style={{ marginTop: 18 }}>
          <AiAnalysisPanel
            state={aiState}
            analysis={aiResult}
            track="D"
            onRetry={() => {
              const content = aiRetryRef.current
              if (content) analyzeEntry(content)
            }}
          />
        </div>
      )}
    </article>
  )
}
