import { useState } from 'react'
import Icon from './Icon.jsx'
import Button from './Button.jsx'
import { useLanguage } from '../i18n/index.js'

/**
 * Track D — cooling-off circuit breaker.
 *
 * 8 reflective questions. No score, no ranking, no advice.
 * On submit, neutral pattern observations are returned (never "good/bad investor").
 *
 * Radio `value` stays a stable English token so answers saved in an earlier
 * session remain readable; only the visible label is translated.
 */

export const HORIZON_OPTIONS = [
  { value: 'Less than 6 months', key: 'under6' },
  { value: '6 months – 3 years', key: 'sixMonthsTo3' },
  { value: '3 – 7 years', key: 'threeTo7' },
  { value: 'More than 7 years', key: 'over7' },
  { value: 'Not sure yet', key: 'notSure' },
]

export const QUESTIONS = [
  { id: 'why', type: 'text' },
  { id: 'lossRecovery', type: 'yesno' },
  { id: 'borrowed', type: 'yesno' },
  { id: 'horizon', type: 'choice', options: HORIZON_OPTIONS },
  { id: 'changed', type: 'text' },
  { id: 'risk', type: 'text' },
  { id: 'evidence', type: 'textarea' },
  { id: 'reconsider', type: 'textarea' },
]

/** Neutral, non-judgemental pattern observations (ids only — text is i18n). */
export function deriveReflections(answers) {
  const out = []
  const add = (id, icon) => out.push({ id, icon })
  const a = answers || {}

  if (a.lossRecovery === 'yes') add('loss-chasing', 'refresh')
  if (a.borrowed === 'yes') add('borrowed-money', 'money')

  if (a.horizon === 'Less than 6 months') add('short-horizon', 'clock')
  if (a.horizon === 'Not sure yet') add('no-horizon', 'clock')

  const evText = String(a.evidence || '').trim()
  if (evText.length === 0) {
    add('no-evidence', 'search')
  } else if (
    /\b(friend|msg|message|whatsapp|telegram|youtube|influencer|tip|group|reel|video)\b/i.test(
      evText,
    )
  ) {
    add('social-source', 'users')
  }

  const riskText = String(a.risk || '').trim()
  if (riskText.length === 0) add('no-risk-stated', 'alert')

  const whyText = String(a.why || '').trim()
  const changedText = String(a.changed || '').trim()
  const combined = `${whyText} ${changedText}`.toLowerCase()

  if (/\b(fomo|everyone|all my friends|fear of missing|miss out|last chance|urgent|hurry)\b/.test(combined)) {
    add('fomo-urgency', 'bell')
  }
  if (/\b(friend|colleague|relative|neighbour|neighbor|group|influencer|youtuber|telegram|whatsapp|tip)\b/.test(combined)) {
    add('social-influence', 'users')
  }
  if (/\b(get rich|quick|guaranteed|assured|double|secret|100%)\b/.test(combined)) {
    add('quick-gain', 'sparkle')
  }

  const reconsider = String(a.reconsider || '').trim()
  if (reconsider.length === 0) add('no-reconsider-condition', 'help')

  return out
}

function YesNo({ value, onChange, name, labels, label }) {
  return (
    <div className="radio-row" role="radiogroup" aria-label={label || name}>
      {[
        { v: 'yes', label: labels.yes },
        { v: 'no', label: labels.no },
        { v: 'unsure', label: labels.unsure },
      ].map((o) => (
        <label key={o.v} className={`opt${value === o.v ? ' selected' : ''}`}>
          <input
            type="radio"
            name={name}
            value={o.v}
            checked={value === o.v}
            onChange={() => onChange(o.v)}
          />
          {o.label}
        </label>
      ))}
    </div>
  )
}

export default function ReflectionForm({ onSubmit, onCancel }) {
  const [answers, setAnswers] = useState({})
  const { t, has } = useLanguage()

  const set = (id, v) => setAnswers((prev) => ({ ...prev, [id]: v }))

  const submit = (e) => {
    e.preventDefault()
    if (onSubmit) onSubmit(answers)
  }

  const yesNoLabels = {
    yes: t('common.yes'),
    no: t('common.no'),
    unsure: t('common.notSure'),
  }

  return (
    <form className="card card--pad-lg animate-in" onSubmit={submit}>
      <div className="ev-block__title">
        <Icon name="pause" size={15} />
        {t('beforeInvest.formTitle')}
      </div>
      <p className="small text-muted" style={{ marginBottom: 24 }}>
        {t('beforeInvest.formIntro')}
      </p>

      {QUESTIONS.map((q, i) => {
        const qText = `beforeInvest.questions.${q.id}`
        const label = t(`${qText}.label`)
        const hint = has(`${qText}.hint`) ? t(`${qText}.hint`) : undefined
        /* Only free-text questions have a placeholder; radio rows never do. */
        const isFreeText = q.type === 'text' || q.type === 'textarea'
        const placeholder =
          isFreeText && has(`${qText}.placeholder`) ? t(`${qText}.placeholder`) : undefined

        return (
          <div className="field" key={q.id}>
            <label className="label" htmlFor={`rf-${q.id}`}>
              <span style={{ color: 'var(--blue-600)', marginInlineEnd: 7 }}>{i + 1}.</span>
              {label}
            </label>
            {hint && (
              <div className="hint" style={{ marginTop: -3, marginBottom: 8 }}>
                {hint}
              </div>
            )}

            {q.type === 'text' && (
              <input
                id={`rf-${q.id}`}
                className="input"
                type="text"
                placeholder={placeholder}
                value={answers[q.id] || ''}
                onChange={(e) => set(q.id, e.target.value)}
              />
            )}

            {q.type === 'textarea' && (
              <textarea
                id={`rf-${q.id}`}
                className="textarea"
                placeholder={placeholder}
                value={answers[q.id] || ''}
                onChange={(e) => set(q.id, e.target.value)}
              />
            )}

            {q.type === 'yesno' && (
              <YesNo
                name={q.id}
                label={label}
                value={answers[q.id]}
                onChange={(v) => set(q.id, v)}
                labels={yesNoLabels}
              />
            )}

            {q.type === 'choice' && (
              <div className="radio-row" role="radiogroup" aria-label={label}>
                {q.options.map((o) => (
                  <label
                    key={o.value}
                    className={`opt${answers[q.id] === o.value ? ' selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      value={o.value}
                      checked={answers[q.id] === o.value}
                      onChange={() => set(q.id, o.value)}
                    />
                    {t(`beforeInvest.options.${o.key}`)}
                  </label>
                ))}
              </div>
            )}
          </div>
        )
      })}

      <hr className="divider" />

      <div className="row row--end">
        {onCancel && (
          <Button variant="ghost" onClick={onCancel} type="button">
            {t('common.cancel')}
          </Button>
        )}
        <Button variant="primary" icon="eye" type="submit">
          {t('beforeInvest.submit')}
        </Button>
      </div>
    </form>
  )
}
