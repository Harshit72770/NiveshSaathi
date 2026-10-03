import Icon from './Icon.jsx'
import { useLanguage } from '../i18n/index.js'

/**
 * Horizontal step progress indicator.
 *
 * props:
 *   steps: string[]        — labels (already translated by the caller)
 *   current: number        — index of the active step (0-based)
 *   doneIcon: string       — icon name shown for completed steps
 */
export default function ProgressSteps({ steps = [], current = 0, doneIcon = 'check' }) {
  const { t } = useLanguage()

  return (
    <ol className="steps" aria-label={t('common.progress')}>
      {steps.map((label, i) => {
        const state = i < current ? 'done' : i === current ? 'current' : ''
        return (
          <li
            key={label + i}
            className={`step ${state}`}
            aria-current={i === current ? 'step' : undefined}
          >
            <span className="step__dot">
              {i < current ? <Icon name={doneIcon} size={15} strokeWidth={2.6} /> : i + 1}
            </span>
            <span className="step__label">{label}</span>
          </li>
        )
      })}
    </ol>
  )
}
