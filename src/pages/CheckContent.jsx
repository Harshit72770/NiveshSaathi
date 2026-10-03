import { useState, useRef, useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'

import Icon from '../components/Icon.jsx'
import Button from '../components/Button.jsx'
import EvidenceCard from '../components/EvidenceCard.jsx'
import ProgressSteps from '../components/ProgressSteps.jsx'
import { analyzeContent } from '../utils/contentAnalyzer.js'
import { DEMO_MESSAGES } from '../data/demoContent.js'
import { SIGNAL_MAP } from '../data/warningSignals.js'
import { learningData, MODULE_MAP } from '../data/learningData.js'
import { useLanguage, getModuleContent, contentTypeLabel } from '../i18n/index.js'

/* Track A — safe actions shown when any warning signal is detected. */
const SAFE_ACTION_KEYS = ['a1', 'a2', 'a3', 'a4', 'a5']

/* Track C — which concept to explain, keyed by the dominant signal. */
const CONCEPT_HINTS = [
  { ids: ['guaranteed-return', 'high-return-claim', 'income-claim'], concept: 'risk' },
  { ids: ['get-rich-quick', 'social-proof'], concept: 'compounding' },
  { ids: ['investment-request', 'payment-method'], concept: 'fees' },
  { ids: ['no-risk-disclosure'], concept: 'volatility' },
  { ids: ['unsolicited-buy-sell', 'insider-tip'], concept: 'diversification' },
]

function pickConcept(result) {
  for (const hint of CONCEPT_HINTS) {
    if (result.warningSignals.some((s) => hint.ids.includes(s.id))) return hint.concept
  }
  return 'risk'
}

const STEP_KEYS = ['detect', 'verify', 'explain', 'pause', 'safeAction', 'recovery']

export default function CheckContent() {
  const location = useLocation()
  const { language, t } = useLanguage()
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [activeDemo, setActiveDemo] = useState(null)
  const [lostMoney, setLostMoney] = useState(false)
  const resultRef = useRef(null)
  const inputRef = useRef(null)

  // Deep link from Learn: /check?signal=guaranteed-return
  const linkedSignal = useMemo(() => {
    const s = new URLSearchParams(location.search).get('signal')
    return s && SIGNAL_MAP[s] ? SIGNAL_MAP[s] : null
  }, [location.search])

  useEffect(() => {
    if (linkedSignal) inputRef.current?.focus()
  }, [linkedSignal])

  const analyze = () => {
    if (!text.trim()) {
      setResult(null)
      inputRef.current?.focus()
      return
    }
    setResult(analyzeContent(text))
    setLostMoney(false)
    window.setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  }

  const loadDemo = (d = DEMO_MESSAGES[0]) => {
    setText(d.text)
    setActiveDemo(d.id)
    setResult(null)
    inputRef.current?.focus()
    window.setTimeout(() => {
      inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 60)
  }

  const clear = () => {
    setText('')
    setResult(null)
    setActiveDemo(null)
    inputRef.current?.focus()
  }

  const conceptId = result && !result.isEmpty ? pickConcept(result) : 'risk'
  const conceptModule = MODULE_MAP[conceptId] || learningData[0]
  const conceptContent = getModuleContent(language, conceptId)
  const stepIndex = !result || result.isEmpty ? 0 : result.shouldPause ? 4 : 2

  const steps = STEP_KEYS.map((k) => t(`checkContent.steps.${k}`))
  const safeActions = SAFE_ACTION_KEYS.map((k) => t(`checkContent.safeActions.${k}`))

  return (
    <div className="page">
      {/* -------------------------------------------------------- HEADER */}
      <section className="animate-in">
        <div className="eyebrow">{t('checkContent.eyebrow')}</div>
        <h1>{t('checkContent.title')}</h1>
        <p className="lede">{t('checkContent.lede')}</p>

        {linkedSignal && (
          <div className="notice notice--info animate-in" style={{ marginTop: 18 }}>
            <span className="notice__icon">
              <Icon name="alert" size={18} />
            </span>
            <div>
              <strong>
                {t('checkContent.linkedNotice', {
                  title: t(`catalogue.${linkedSignal.id}.title`),
                })}
              </strong>
              <div className="small" style={{ marginTop: 3 }}>
                {t(`catalogue.${linkedSignal.id}.detail`)}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ------------------------------------------------------ INPUT CARD */}
      <section className="section card card--pad-lg animate-in animate-in-1">
        <div className="row" style={{ gap: 13, marginBottom: 16 }}>
          <span className="icon-tile">
            <Icon name="search" size={22} />
          </span>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.2rem' }}>{t('checkContent.inputTitle')}</h2>
            <p className="small text-muted" style={{ margin: '3px 0 0' }}>
              {t('checkContent.inputSub')}
            </p>
          </div>
        </div>

        <label className="sr-only" htmlFor="content-input">
          {t('checkContent.inputLabel')}
        </label>
        <textarea
          id="content-input"
          ref={inputRef}
          className="textarea textarea--xl"
          placeholder={t('checkContent.placeholder')}
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
        />

        <div className="row row--between" style={{ marginTop: 16 }}>
          <div className="row" style={{ gap: 9 }}>
            <Button variant="primary" icon="sparkle" onClick={analyze} disabled={!text.trim()}>
              {t('common.analyzeContent')}
            </Button>
            <Button variant="soft" icon="play" onClick={() => loadDemo(DEMO_MESSAGES[0])}>
              {t('common.tryDemo')}
            </Button>
            {text && (
              <Button variant="ghost" icon="x" onClick={clear}>
                {t('common.clear')}
              </Button>
            )}
          </div>

          <span className="small text-muted">
            {text.trim()
              ? t('common.characters', { count: text.trim().length })
              : t('common.nothingPastedYet')}
          </span>
        </div>

        {/* Demo library */}
        <div className="mt-3">
          <div className="ev-block__title">
            <Icon name="folder" size={15} />
            {t('checkContent.exampleMessages')}
          </div>
          <div className="chip-list">
            {DEMO_MESSAGES.map((d) => (
              <button
                key={d.id}
                type="button"
                className="chip"
                style={{
                  cursor: 'pointer',
                  border: `1px solid ${activeDemo === d.id ? 'var(--blue-500)' : 'var(--blue-100)'}`,
                  background: activeDemo === d.id ? 'var(--blue-100)' : 'var(--blue-50)',
                }}
                onClick={() => loadDemo(d)}
              >
                <Icon name="doc" size={13} />
                {t(`checkContent.demoTitles.${d.id}`)}
              </button>
            ))}
          </div>
          <p className="hint">{t('checkContent.localOnly')}</p>
        </div>

        <p className="hint" style={{ marginTop: 14 }}>
          {t('checkContent.exampleLabel')}{' '}
          <em style={{ color: 'var(--ink-soft)' }}>{t('checkContent.exampleQuote')}</em>
        </p>
      </section>

      {/* ---------------------------------------------------- FLOW PROGRESS */}
      <section className="section">
        <div className="card">
          <div className="ev-block__title" style={{ marginBottom: 18 }}>
            <Icon name="compass" size={15} />
            {t('checkContent.frameworkTitle')}
          </div>
          <ProgressSteps steps={steps} current={stepIndex} />
        </div>
      </section>

      {/* --------------------------------------------------------- RESULTS */}
      <div ref={resultRef} />

      {result && result.isEmpty && (
        <div className="section empty-state">
          <div className="empty-state__icon">✍️</div>
          <strong>{t('checkContent.emptyTitle')}</strong>
          <p className="small" style={{ marginTop: 6 }}>
            {t('checkContent.emptyBodyPrefix')} <strong>{t('common.tryDemo')}</strong>{' '}
            {t('checkContent.emptyBodySuffix')}
          </p>
        </div>
      )}

      {result && !result.isEmpty && (
        <>
          {/* ------------------------------------------------ PAUSE BANNER (Track A) */}
          {result.shouldPause && (
            <section className="section pause-banner animate-in">
              <div className="pause-banner__title">
                <Icon name="pause" size={26} strokeWidth={2.3} />
                {t('checkContent.pauseTitle')}
              </div>
              <p className="text-muted" style={{ maxWidth: '62ch', margin: '0 auto' }}>
                {result.signalCount === 1
                  ? t('checkContent.pauseBodyOne')
                  : t('checkContent.pauseBodyMany', { count: result.signalCount })}
              </p>

              <ol className="pause-list">
                {safeActions.map((a, i) => (
                  <li key={SAFE_ACTION_KEYS[i]}>{a}</li>
                ))}
              </ol>

              <div className="row row--end" style={{ marginTop: 20, justifyContent: 'center' }}>
                <Button
                  variant="outline"
                  icon="alert"
                  onClick={() => setLostMoney((v) => !v)}
                >
                  {lostMoney ? t('checkContent.hideRecoveryHelp') : t('checkContent.iLostMoney')}
                </Button>
                <Button to="/before-invest" variant="soft" icon="pause">
                  {t('safety.pauseNow')}
                </Button>
              </div>

              {lostMoney && (
                <div className="animate-in" style={{ marginTop: 20, textAlign: 'start' }}>
                  <div
                    className="card"
                    style={{ background: '#fff', border: '1px solid var(--rose-100)' }}
                  >
                    <div className="ev-block__title" style={{ color: 'var(--rose-700)' }}>
                      <Icon name="flag" size={15} />
                      {t('checkContent.lostMoneyTitle')}
                    </div>
                    <p className="small" style={{ marginBottom: 14 }}>
                      {t('checkContent.lostMoneyBody')}
                    </p>
                    <div className="row">
                      <Button to="/recovery" variant="primary" icon="arrowRight">
                        {t('checkContent.openRecovery')}
                      </Button>
                      <Button to="/problem" variant="outline" icon="flag">
                        {t('checkContent.rightsGrievance')}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* ------------------------------------------------ EVIDENCE CARD (Track E) */}
          <section className="section">
            <EvidenceCard result={result} />
          </section>

          {/* ------------------------------------------------ SAFE ACTION (Track A) */}
          <section className="section grid-2">
            <div className="card card--pad-lg">
              <div className="ev-block__title">
                <Icon name="shield" size={15} />
                {t('checkContent.safeActionTitle')}
              </div>
              <p className="small text-muted" style={{ marginBottom: 16 }}>
                {t('checkContent.safeActionDesc')}
              </p>
              <ul className="checklist">
                {safeActions.map((a, i) => (
                  <li key={SAFE_ACTION_KEYS[i]}>
                    <label style={{ cursor: 'default' }}>
                      <span
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          background: 'var(--blue-50)',
                          color: 'var(--blue-700)',
                          display: 'grid',
                          placeItems: 'center',
                          fontSize: 12,
                          fontWeight: 700,
                          flexShrink: 0,
                          border: '1px solid var(--blue-100)',
                        }}
                      >
                        {i + 1}
                      </span>
                      <span className="checklist__text">
                        <span style={{ color: 'var(--ink-soft)', fontSize: '0.94rem' }}>{a}</span>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>

              <div className="notice notice--warn" style={{ marginTop: 16 }}>
                <span className="notice__icon">
                  <Icon name="lock" size={18} />
                </span>
                <div className="small">
                  <strong>{t('safety.neverShareShortTitle')}</strong>{' '}
                  {t('safety.neverShareShortBody')}
                </div>
              </div>
            </div>

            {/* ------------------------------------------------ TRACK C EXPLANATION */}
            <div className="card card--pad-lg">
              <div className="ev-block__title">
                <Icon name="book" size={15} />
                {t('checkContent.trackCTitle')}
              </div>
              <p className="small text-muted" style={{ marginBottom: 16 }}>
                {t('checkContent.trackCDesc')}
              </p>

              {conceptContent && (
                <div className="stack-sm">
                  <span className="badge">
                    <Icon name={conceptModule.icon} size={13} />
                    {conceptContent.title}
                  </span>
                  <p style={{ margin: 0, fontSize: '0.96rem', lineHeight: 1.7 }}>
                    {conceptContent.simple}
                  </p>
                  <div className="notice notice--info">
                    <span className="notice__icon">
                      <Icon name="compass" size={17} />
                    </span>
                    <div className="small">{conceptContent.analogy}</div>
                  </div>
                </div>
              )}

              <div className="row" style={{ marginTop: 18 }}>
                <Button to="/learn" variant="soft" size="sm" icon="book">
                  {t('checkContent.allModules')}
                </Button>
                <Button to="/before-invest" variant="outline" size="sm" icon="pause">
                  {t('checkContent.coolingOff')}
                </Button>
              </div>
            </div>
          </section>

          {/* ------------------------------------------------ CONNECTED JOURNEY */}
          <section className="section">
            <div className="card">
              <div className="ev-block__title">
                <Icon name="compass" size={15} />
                {t('checkContent.nextTitle')}
              </div>

              <div className="stack-sm">
                <Link to="/before-invest" className="float-item" style={{ textDecoration: 'none' }}>
                  <span className="icon-tile icon-tile--amber">
                    <Icon name="pause" size={20} />
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div className="float-item__title">{t('checkContent.nextTrackD.title')}</div>
                    <div className="float-item__sub">{t('checkContent.nextTrackD.sub')}</div>
                  </div>
                  <Icon
                    name="arrowRight"
                    size={17}
                    style={{ marginInlineStart: 'auto', color: 'var(--muted-2)', flexShrink: 0 }}
                  />
                </Link>

                <Link to="/decisions" className="float-item" style={{ textDecoration: 'none' }}>
                  <span className="icon-tile">
                    <Icon name="notebook" size={20} />
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div className="float-item__title">{t('checkContent.nextDecisions.title')}</div>
                    <div className="float-item__sub">{t('checkContent.nextDecisions.sub')}</div>
                  </div>
                  <Icon
                    name="arrowRight"
                    size={17}
                    style={{ marginInlineStart: 'auto', color: 'var(--muted-2)', flexShrink: 0 }}
                  />
                </Link>

                <Link to="/problem" className="float-item" style={{ textDecoration: 'none' }}>
                  <span className="icon-tile icon-tile--green">
                    <Icon name="flag" size={20} />
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div className="float-item__title">{t('checkContent.nextTrackB.title')}</div>
                    <div className="float-item__sub">{t('checkContent.nextTrackB.sub')}</div>
                  </div>
                  <Icon
                    name="arrowRight"
                    size={17}
                    style={{ marginInlineStart: 'auto', color: 'var(--muted-2)', flexShrink: 0 }}
                  />
                </Link>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
