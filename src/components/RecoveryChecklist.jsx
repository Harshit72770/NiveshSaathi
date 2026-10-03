import Icon from './Icon.jsx'
import { useLanguage } from '../i18n/index.js'

/**
 * Reusable tickable checklist.
 *
 * props:
 *   items: { id, title, note? }[]
 *   checked: Set<string> | string[]      — ids that are ticked
 *   onToggle(id)                          — toggle handler
 *   showProgress: boolean                 — render a "x of y" progress bar
 *   doneLabel: string                     — already-translated noun for the count
 */
export default function RecoveryChecklist({
  items = [],
  checked = [],
  onToggle,
  showProgress = true,
  doneLabel = '',
}) {
  const { t } = useLanguage()
  const checkedSet = checked instanceof Set ? checked : new Set(checked)
  const doneCount = items.filter((i) => checkedSet.has(i.id)).length
  const pct = items.length ? Math.round((doneCount / items.length) * 100) : 0

  return (
    <div>
      {showProgress && (
        <div className="row row--between" style={{ marginBottom: 12 }}>
          <span className="small text-muted">
            <strong style={{ color: 'var(--ink)' }}>
              {t('common.of', { done: doneCount, total: items.length })}
            </strong>{' '}
            {doneLabel}
          </span>
          <span className="small text-muted" style={{ minWidth: 44, textAlign: 'end' }}>
            {pct}%
          </span>
        </div>
      )}

      {showProgress && (
        <div className="progress" style={{ marginBottom: 16 }}>
          <div className="progress__fill" style={{ width: `${pct}%` }} />
        </div>
      )}

      <ul className="checklist">
        {items.map((item) => {
          const on = checkedSet.has(item.id)
          return (
            <li key={item.id} className={on ? 'checked' : ''}>
              <label>
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => onToggle && onToggle(item.id)}
                />
                <span className="checklist__text">
                  <strong>{item.title}</strong>
                  {item.note && <span>{item.note}</span>}
                </span>
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/**
 * The standing "never share credentials" safety notice used across the app.
 */
export function NeverShareNotice() {
  const { t } = useLanguage()
  return (
    <div className="notice notice--stop" style={{ marginTop: 16 }}>
      <span className="notice__icon">
        <Icon name="lock" size={18} />
      </span>
      <div className="small">
        <strong>{t('safety.neverShareTitle')}</strong> {t('safety.neverShareBody')}
      </div>
    </div>
  )
}
