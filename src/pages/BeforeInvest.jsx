import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'

import Icon from '../components/Icon.jsx'
import Button from '../components/Button.jsx'
import ReflectionForm, { deriveReflections } from '../components/ReflectionForm.jsx'
import ProgressSteps from '../components/ProgressSteps.jsx'
import { read, write, uid } from '../utils/localStorage.js'
import { useLanguage, optionLabel, tv } from '../i18n/index.js'

const STEP_KEYS = ['questions', 'reflection', 'nextStep']

const ANSWER_ROWS = [
  'why',
  'lossRecovery',
  'borrowed',
  'horizon',
  'changed',
  'risk',
  'evidence',
  'reconsider',
]

export default function BeforeInvest() {
  const [answers, setAnswers] = useState(null)
  const [saved, setSaved] = useState(false)
  const topRef = useRef(null)
  const { t } = useLanguage()

  const reflections = answers ? deriveReflections(answers) : []
  const steps = STEP_KEYS.map((k) => t(`beforeInvest.steps.${k}`))

  const handleSubmit = (a) => {
    setAnswers(a)
    setSaved(false)
    window.setTimeout(() => {
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  }

  const reset = () => {
    setAnswers(null)
    setSaved(false)
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 60)
  }

  const saveToJournal = () => {
    const entries = read('journal', []) || []
    const titleSrc =
      String(answers?.why || '').trim() ||
      String(answers?.changed || '').trim() ||
      t('decisions.untitledReflection')

    entries.unshift({
      id: uid('jr'),
      title: titleSrc.slice(0, 90),
      why: answers?.why || '',
      horizon: answers?.horizon || '',
      risk: answers?.risk || '',
      evidence: answers?.evidence || '',
      reconsider: answers?.reconsider || '',
      confidence: '',
      createdAt: new Date().toISOString(),
      source: 'reflection',
    })
    write('journal', entries)
    setSaved(true)
  }

  const answerValue = (id) => {
    const v = answers?.[id]
    if (id === 'lossRecovery' || id === 'borrowed') {
      if (v === 'yes') return t('common.yes')
      if (v === 'no') return t('common.no')
      if (v === 'unsure') return t('common.notSure')
      return v
    }
    if (id === 'horizon') return optionLabel(t, v)
    return v
  }

  return (
    <div className="page page--narrow">
      <section className="animate-in" ref={topRef}>
        <div className="eyebrow">{t('beforeInvest.eyebrow')}</div>
        <h1>{t('beforeInvest.title')}</h1>
        <p className="lede">{t('beforeInvest.lede')}</p>
      </section>

      <section className="section">
        <div className="card">
          <ProgressSteps steps={steps} current={answers ? 1 : 0} />
        </div>
      </section>

      {!answers && (
        <section className="section">
          <ReflectionForm onSubmit={handleSubmit} />
        </section>
      )}

      {answers && (
        <>
          {/* -------------------------------------------------------- REFLECTION */}
          <section className="section">
            <div className="card card--pad-lg animate-in">
              <div className="row row--between" style={{ marginBottom: 6 }}>
                <div className="ev-block__title" style={{ marginBottom: 0 }}>
                  <Icon name="eye" size={15} />
                  {t('beforeInvest.reflectionTitle')}
                </div>
                <span className="badge badge--neutral">
                  {reflections.length}{' '}
                  {reflections.length === 1
                    ? t('common.observation')
                    : t('common.observations')}
                </span>
              </div>

              <p className="small text-muted" style={{ marginTop: 10, marginBottom: 20 }}>
                {t('beforeInvest.reflectionIntro')}
              </p>

              {reflections.length === 0 ? (
                <div className="notice notice--ok">
                  <span className="notice__icon">
                    <Icon name="checkCircle" size={18} />
                  </span>
                  <div>
                    <strong>{t('beforeInvest.noPatternsTitle')}</strong>
                    <div className="small" style={{ marginTop: 4 }}>
                      {t('beforeInvest.noPatternsBody')}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="stack">
                  {reflections.map((r) => (
                    <div
                      key={r.id}
                      className="notice"
                      style={{
                        background: 'var(--amber-50)',
                        borderColor: 'var(--amber-100)',
                        alignItems: 'flex-start',
                      }}
                    >
                      <span
                        className="notice__icon"
                        style={{ color: 'var(--amber-700)', marginTop: 0 }}
                      >
                        <Icon name={r.icon} size={19} />
                      </span>
                      <div>
                        <strong>{t(`beforeInvest.reflections.${r.id}.title`)}</strong>
                        <div className="small" style={{ marginTop: 4, lineHeight: 1.65 }}>
                          {t(`beforeInvest.reflections.${r.id}.text`)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div
                className="notice"
                style={{ marginTop: 20, background: 'var(--blue-50)', borderColor: 'var(--blue-100)' }}
              >
                <span className="notice__icon">
                  <Icon name="info" size={18} />
                </span>
                <div className="small">
                  <strong>{t('beforeInvest.recommendationsStrong')}</strong>{' '}
                  {t('beforeInvest.recommendationsBody')}
                </div>
              </div>
            </div>
          </section>

          {/* -------------------------------------------------------- YOUR ANSWERS */}
          <section className="section">
            <div className="card card--pad-lg animate-in">
              <div className="ev-block__title">
                <Icon name="notebook" size={15} />
                {t('beforeInvest.answersTitle')}
              </div>

              <div className="stack-sm" style={{ marginTop: 14 }}>
                {ANSWER_ROWS.map((id) => {
                  const value = answerValue(id)
                  return (
                    <div key={id}>
                      <div className="ev-block__title" style={{ marginBottom: 5 }}>
                        <Icon name="check" size={13} />
                        {t(`beforeInvest.questions.${id}.label`)}
                      </div>
                      <p
                        className="small"
                        style={{ margin: 0, color: 'var(--ink-soft)', lineHeight: 1.65 }}
                      >
                        {value && String(value).trim() ? (
                          value
                        ) : (
                          <em className="text-muted">{t('common.notAnswered')}</em>
                        )}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* ----------------------------------------------------------- NEXT STEP */}
          <section className="section">
            <div
              className="card card--pad-lg animate-in"
              style={{ background: 'linear-gradient(135deg,#fbfdff,#f3f8ff)' }}
            >
              <div className="ev-block__title">
                <Icon name="arrowRight" size={15} />
                {t('beforeInvest.nextStepTitle')}
              </div>

              <p className="small text-muted" style={{ marginBottom: 18 }}>
                {t('beforeInvest.nextStepBody')}
              </p>

              <div className="row">
                <Button variant="primary" icon="save" onClick={saveToJournal} disabled={saved}>
                  {saved ? t('beforeInvest.saved') : t('beforeInvest.saveToDecisions')}
                </Button>
                <Button variant="outline" icon="refresh" onClick={reset}>
                  {t('beforeInvest.answerAgain')}
                </Button>
                <Button variant="ghost" to="/decisions" icon="notebook">
                  {t('beforeInvest.openJournal')}
                </Button>
              </div>

              {saved && (
                <div className="notice notice--ok animate-in" style={{ marginTop: 16 }}>
                  <span className="notice__icon">
                    <Icon name="checkCircle" size={18} />
                  </span>
                  <div className="small">
                    {t('beforeInvest.savedNotice')}{' '}
                    <Link to="/decisions">{t('beforeInvest.viewInDecisions')}</Link>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ---------------------------------------------------------- SUPPORT */}
          <section className="section grid-2">
            <div className="card">
              <div className="ev-block__title">
                <Icon name="search" size={15} />
                {t('beforeInvest.stillVerifyingTitle')}
              </div>
              <p className="small text-muted" style={{ marginBottom: 14 }}>
                {t('beforeInvest.stillVerifyingBody')}
              </p>
              <Button to="/check" variant="soft" size="sm" icon="search">
                {t('beforeInvest.checkContentBtn')}
              </Button>
            </div>

            <div className="card">
              <div className="ev-block__title">
                <Icon name="flag" size={15} />
                {t('beforeInvest.lostMoneyTitle')}
              </div>
              <p className="small text-muted" style={{ marginBottom: 14 }}>
                {t('beforeInvest.lostMoneyBody')}
              </p>
              <Button to="/recovery" variant="soft" size="sm" icon="arrowRight">
                {t('beforeInvest.openRecovery')}
              </Button>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
