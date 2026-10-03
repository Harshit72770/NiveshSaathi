import Icon from './Icon.jsx'
import { formatDate } from '../utils/localStorage.js'
import { useLanguage, optionLabel } from '../i18n/index.js'

const ROW_KEYS = ['why', 'horizon', 'risk', 'evidence', 'reconsider']

/**
 * One saved decision-journal entry.
 * No score, no ranking — a record the user wrote for themselves.
 */
export default function JournalEntry({ entry, onDelete }) {
  const { t, locale } = useLanguage()

  if (!entry) return null

  const rows = ROW_KEYS.map((k) => ({
    key: k,
    label: t(`decisions.rows.${k}`),
    value: k === 'horizon' ? optionLabel(t, entry[k]) : entry[k],
  })).filter((r) => r.value && String(r.value).trim())

  const confidenceLabel = entry.confidence
    ? `${t('decisions.confidence.prefix')} ${optionLabel(t, entry.confidence)}`
    : ''

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
    </article>
  )
}
