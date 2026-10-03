import { useState, useEffect } from 'react'

import Icon from '../components/Icon.jsx'
import Button from '../components/Button.jsx'
import ProgressSteps from '../components/ProgressSteps.jsx'
import RecoveryChecklist, { NeverShareNotice } from '../components/RecoveryChecklist.jsx'
import { read, write } from '../utils/localStorage.js'
import { useLanguage, backArrowStyle } from '../i18n/index.js'

const STEP_KEYS = ['stop', 'preserve', 'report', 'track', 'nextStep']

/* Stable ids + icons — every string comes from recovery.* in the dictionary. */
const TRACK_STEPS = [
  { id: 'stop', icon: 'pause' },
  { id: 'preserve', icon: 'doc' },
  { id: 'report', icon: 'flag' },
  { id: 'track', icon: 'target' },
  { id: 'next', icon: 'arrowRight' },
]

const ACTION_INDEX = [0, 1, 2, 3]

const EVIDENCE_ITEMS = [
  { id: 'ev-screenshots' },
  { id: 'ev-txn' },
  { id: 'ev-phone' },
  { id: 'ev-urls' },
  { id: 'ev-msgs' },
  { id: 'ev-emails' },
  { id: 'ev-payments' },
  { id: 'ev-accounts' },
]

export default function Recovery() {
  const [step, setStep] = useState(0)
  const [evidence, setEvidence] = useState(() => read('recovery-evidence', []) || [])
  const { t, dir } = useLanguage()
  const backFlip = backArrowStyle(dir)

  useEffect(() => {
    write('recovery-evidence', evidence)
  }, [evidence])

  const toggle = (id) =>
    setEvidence((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const active = TRACK_STEPS[step]
  const stepText = `recovery.trackSteps.${active.id}`
  const steps = STEP_KEYS.map((k) => t(`recovery.steps.${k}`))

  const goTo = (i) => {
    setStep(i)
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 60)
  }

  return (
    <div className="page page--narrow">
      {/* ------------------------------------------------------------- HEADER */}
      <section className="animate-in">
        <div className="eyebrow">{t('recovery.eyebrow')}</div>
        <h1>{t('recovery.title')}</h1>
        <p className="lede">{t('recovery.lede')}</p>
      </section>

      {/* ------------------------------------------------------------- FLOW */}
      <section className="section">
        <div className="card card--pad-lg">
          <div className="ev-block__title" style={{ marginBottom: 20 }}>
            <Icon name="flag" size={15} />
            {t('recovery.fiveSteps')}
          </div>
          <ProgressSteps steps={steps} current={step} />
        </div>
      </section>

      {/* ------------------------------------------------------- STEP SWITCHER */}
      <section className="section">
        <div className="row" style={{ gap: 8 }}>
          {TRACK_STEPS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className="tab"
              style={{
                flex: '1 1 auto',
                background: i === step ? 'var(--blue-600)' : '#fff',
                color: i === step ? '#fff' : 'var(--muted)',
                border: `1px solid ${i === step ? 'var(--blue-600)' : 'var(--border)'}`,
                boxShadow: i === step ? '0 4px 12px rgba(37,99,235,.25)' : 'none',
                fontWeight: i === step ? 700 : 600,
              }}
              onClick={() => goTo(i)}
              aria-pressed={i === step}
            >
              {i + 1}. {t(`recovery.trackSteps.${s.id}.title`)}
            </button>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------- ACTIVE STEP */}
      <section className="section">
        <div className="card card--pad-lg animate-in" key={active.id}>
          <div className="row" style={{ gap: 15, alignItems: 'flex-start', marginBottom: 16 }}>
            <span className="icon-tile icon-tile--rose" style={{ width: 54, height: 54 }}>
              <Icon name={active.icon} size={26} />
            </span>
            <div style={{ minWidth: 0 }}>
              <div className="badge badge--rose" style={{ marginBottom: 7 }}>
                {t('common.stepOf', { current: step + 1, total: 5 })}
              </div>
              <h2 style={{ margin: 0, fontSize: '1.35rem' }}>
                {t(`${stepText}.title`)}
              </h2>
              <p className="small text-muted" style={{ margin: '4px 0 0' }}>
                {t(`${stepText}.tagline`)}
              </p>
            </div>
          </div>

          <p style={{ fontSize: '0.99rem', lineHeight: 1.75 }}>{t(`${stepText}.body`)}</p>

          <div className="stack-sm" style={{ marginTop: 18 }}>
            {ACTION_INDEX.map((n) => (
              <div key={`${active.id}-${n}`} className="notice">
                <span className="notice__icon" style={{ color: 'var(--blue-600)' }}>
                  <Icon name="check" size={17} strokeWidth={2.4} />
                </span>
                <div className="small">{t(`${stepText}.actions.${n}`)}</div>
              </div>
            ))}
          </div>

          <div className="row row--between mt-3">
            <Button
              variant="ghost"
              icon="arrowRight"
              disabled={step === 0}
              onClick={() => goTo(step - 1)}
              style={step === 0 ? {} : backFlip}
            >
              {t('common.back')}
            </Button>

            {step < TRACK_STEPS.length - 1 ? (
              <Button variant="primary" icon="arrowRight" onClick={() => goTo(step + 1)}>
                {t('recovery.nextStepBtn', {
                  title: t(`recovery.trackSteps.${TRACK_STEPS[step + 1].id}.title`),
                })}
              </Button>
            ) : (
              <Button variant="primary" icon="check" onClick={() => goTo(0)}>
                {t('common.startOver')}
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- EVIDENCE CHECKLIST */}
      <section className="section">
        <div className="card card--pad-lg">
          <div className="ev-block__title">
            <Icon name="doc" size={15} />
            {t('recovery.evidenceTitle')}
          </div>
          <p className="small text-muted" style={{ marginTop: 8, marginBottom: 18 }}>
            {t('recovery.evidenceIntro')}
          </p>

          <RecoveryChecklist
            items={EVIDENCE_ITEMS.map((item) => ({
              id: item.id,
              title: t(`recovery.evidenceItems.${item.id}.title`),
              note: t(`recovery.evidenceItems.${item.id}.note`),
            }))}
            checked={evidence}
            onToggle={toggle}
            doneLabel={t('recovery.doneLabel')}
          />

          <NeverShareNotice />
        </div>
      </section>

      {/* ------------------------------------------------------------- CAUTION */}
      <section className="section">
        <div
          className="card card--pad-lg"
          style={{
            background: 'linear-gradient(135deg,#fff7ed,#fff1f2)',
            borderColor: 'var(--rose-100)',
          }}
        >
          <div className="ev-block__title" style={{ color: 'var(--rose-700)' }}>
            <Icon name="alert" size={15} />
            {t('recovery.cautionTitle')}
          </div>
          <ul className="ev-list ev-list--missing" style={{ marginTop: 6 }}>
            {t('recovery.cautionList').map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>

          <div className="notice notice--stop" style={{ marginTop: 16 }}>
            <span className="notice__icon">
              <Icon name="lock" size={18} />
            </span>
            <div className="small">
              <strong>{t('recovery.secondLossStrong')}</strong> {t('recovery.secondLossBody')}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- NEXT */}
      <section className="section grid-2">
        <div className="card">
          <div className="ev-block__title">
            <Icon name="flag" size={15} />
            {t('recovery.rightsTitle')}
          </div>
          <p className="small text-muted" style={{ marginBottom: 14 }}>
            {t('recovery.rightsBody')}
          </p>
          <Button to="/problem" variant="soft" size="sm" icon="arrowRight">
            {t('recovery.rightsBtn')}
          </Button>
        </div>

        <div className="card">
          <div className="ev-block__title">
            <Icon name="notebook" size={15} />
            {t('recovery.recordTitle')}
          </div>
          <p className="small text-muted" style={{ marginBottom: 14 }}>
            {t('recovery.recordBody')}
          </p>
          <Button to="/decisions" variant="soft" size="sm" icon="arrowRight">
            {t('recovery.recordBtn')}
          </Button>
        </div>
      </section>
    </div>
  )
}
