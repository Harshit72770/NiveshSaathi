import { useState } from 'react'
import Icon from './Icon.jsx'
import { useLanguage } from '../i18n/index.js'

/**
 * Quick understanding check.
 *
 * props: quiz { question, options[], answerIndex, explanation }
 */
export default function Quiz({ quiz }) {
  const [picked, setPicked] = useState(null)
  const { t } = useLanguage()

  if (!quiz) return null

  const answered = picked !== null
  const correct = picked === quiz.answerIndex

  const reset = () => setPicked(null)

  return (
    <div className="card card--tint">
      <div className="ev-block__title">
        <Icon name="help" size={15} />
        {t('learn.quiz.title')}
      </div>

      <p style={{ fontWeight: 600, color: 'var(--ink)', margin: '0 0 14px' }}>
        {quiz.question}
      </p>

      <div className="quiz">
        {quiz.options.map((opt, i) => {
          let cls = 'quiz__opt'
          if (answered && i === quiz.answerIndex) cls += ' correct'
          else if (answered && i === picked) cls += ' wrong'
          return (
            <button
              key={i}
              type="button"
              className={cls}
              onClick={() => !answered && setPicked(i)}
              disabled={answered}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  border: '1.6px solid currentColor',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                  flexShrink: 0,
                  opacity: 0.75,
                }}
              >
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          )
        })}
      </div>

      {answered && (
        <div className="quiz__feedback animate-in">
          <strong style={{ color: correct ? 'var(--green-700)' : 'var(--rose-700)' }}>
            {correct ? t('learn.quiz.correct') : t('learn.quiz.notQuite')}
          </strong>{' '}
          {quiz.explanation}
          <div style={{ marginTop: 11 }}>
            <button type="button" className="btn btn--soft btn--sm" onClick={reset}>
              <Icon name="refresh" size={14} /> {t('learn.quiz.tryAgain')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
