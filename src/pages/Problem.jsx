import { useState, useMemo, useRef, useEffect } from 'react'

import Icon from '../components/Icon.jsx'
import Button from '../components/Button.jsx'
import ProgressSteps from '../components/ProgressSteps.jsx'
import RecoveryChecklist, { NeverShareNotice } from '../components/RecoveryChecklist.jsx'
import AiAnalysisPanel from '../components/AiAnalysisPanel.jsx'
import { fetchAiAnalysis } from '../utils/aiAnalysis.js'
import { read, write } from '../utils/localStorage.js'
import { useLanguage, backArrowStyle } from '../i18n/index.js'

/* ------------------------------------------------------------------ CATEGORIES
   Only stable ids here — labels, routes and documents are translated. */
const CATEGORIES = ['unauthorized', 'broker', 'fraud', 'wronginfo', 'nomination', 'iepf', 'other']

const FLOW_KEYS = ['understand', 'document', 'draft', 'route', 'track', 'nextStep']

const TABS = [
  { id: 'complaint', key: 'complaint', icon: 'flag' },
  { id: 'nominee', key: 'nominee', icon: 'users' },
  { id: 'iepf', key: 'iepf', icon: 'folder' },
]

const NOMINEE_ITEMS = ['n1', 'n2', 'n3', 'n4', 'n5', 'n6', 'n7', 'n8', 'n9']
const IEPF_ITEMS = ['i1', 'i2', 'i3', 'i4', 'i5', 'i6', 'i7', 'i8']
const TRACK_ITEMS = ['t1', 't2', 't3', 't4', 't5']

/* ================================================================ PAGE */
export default function Problem() {
  const [tab, setTab] = useState('complaint')
  const { t } = useLanguage()

  return (
    <div className="page">
      <section className="animate-in">
        <div className="eyebrow">{t('problem.eyebrow')}</div>
        <h1>{t('problem.title')}</h1>
        <p className="lede">{t('problem.lede')}</p>
      </section>

      <section className="section">
        <div className="tabs" role="tablist" aria-label={t('problem.tablist')}>
          {TABS.map((tabDef) => (
            <button
              key={tabDef.id}
              role="tab"
              aria-selected={tab === tabDef.id}
              className={`tab${tab === tabDef.id ? ' active' : ''}`}
              onClick={() => setTab(tabDef.id)}
            >
              <Icon
                name={tabDef.icon}
                size={14}
                style={{ verticalAlign: '-2px', marginInlineEnd: 7 }}
              />
              {t(`problem.tabs.${tabDef.key}`)}
            </button>
          ))}
        </div>
      </section>

      {tab === 'complaint' && <ComplaintAssistant />}
      {tab === 'nominee' && <NomineeTool />}
      {tab === 'iepf' && <IepfTool />}
    </div>
  )
}

/* ============================================================ COMPLAINT */
function ComplaintAssistant() {
  const [step, setStep] = useState(0)
  const [what, setWhat] = useState('')
  const [category, setCategory] = useState('')
  const [when, setWhen] = useState('')
  const [entity, setEntity] = useState('')
  const [outcome, setOutcome] = useState('')
  const [docs, setDocs] = useState([])
  const [draft, setDraft] = useState('')
  const [copied, setCopied] = useState(false)
  const topRef = useRef(null)
  const { language, t, dir } = useLanguage()
  const backFlip = backArrowStyle(dir)

  /* AI guidance (Track B) — complements the local draft, never
     replaces it and never invents laws, deadlines or procedures. */
  const [aiState, setAiState] = useState('idle') // idle | loading | done | error
  const [aiResult, setAiResult] = useState(null)
  const aiJobRef = useRef(0)
  const aiRetryRef = useRef(null)

  const catLabel = category ? t(`problem.categories.${category}.label`) : ''
  const flowSteps = FLOW_KEYS.map((k) => t(`problem.flowSteps.${k}`))

  const goTo = (s) => {
    setStep(s)
    window.setTimeout(
      () => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      60,
    )
  }

  const generate = () => {
    const subjectCategory = category ? catLabel : t('problem.draft.subjectFallbackCategory')
    const subjectWhat = what ? what.slice(0, 70) : t('problem.draft.subjectFallbackWhat')

    const lines = [
      t('problem.draft.heading'),
      '==============',
      '',
      t('problem.draft.to', { entity: entity || '[name of entity]' }),
      t('problem.draft.subject', { category: subjectCategory, what: subjectWhat }),
      '',
      t('problem.draft.salutation'),
      '',
      t('problem.draft.opener'),
      '',
      t('problem.draft.s1'),
      what || t('problem.draft.s1Placeholder'),
      '',
      t('problem.draft.s2'),
      when
        ? t('problem.draft.dateLine', { value: when })
        : t('problem.draft.dateLinePlaceholder'),
      t('problem.draft.entityLine', { value: entity || t('problem.draft.entityFallback') }),
      t('problem.draft.categoryLine', {
        value: category ? catLabel : t('problem.draft.categoryFallback'),
      }),
      '',
      t('problem.draft.s3'),
      docs.length
        ? docs.map((d, i) => `   ${i + 1}. ${t(d)}`).join('\n')
        : t('problem.draft.s3Placeholder'),
      '',
      t('problem.draft.s4'),
      outcome || t('problem.draft.s4Placeholder'),
      '',
      t('problem.draft.request'),
      '',
      t('problem.draft.yours'),
      t('problem.draft.name'),
      t('problem.draft.contact'),
      t('problem.draft.address'),
      '',
      '------------------------------------------------------------',
      t('problem.draft.footer'),
      '------------------------------------------------------------',
    ]
    setDraft(lines.join('\n'))
    setCopied(false)
    goTo(3)
  }

  const copyDraft = async () => {
    try {
      await navigator.clipboard.writeText(draft)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  const toggleDoc = (d) =>
    setDocs((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]))

  const docList = category
    ? t(`problem.categories.${category}.docs`)
    : t('problem.genericDocs')

  /**
   * Request AI guidance for the grievance (Track B).
   * The local draft template above stays the source of truth; the
   * AI only explains the situation and process — it never invents
   * laws, deadlines or official procedures.
   */
  const analyzeProblem = (content) => {
    const job = ++aiJobRef.current
    aiRetryRef.current = content
    setAiResult(null)
    setAiState('loading')
    fetchAiAnalysis({
      track: 'B',
      content,
      language,
      existingAnalysis: {
        framework: 'Track B rights & grievance assistant',
        category: category || 'unspecified',
        localDraftGenerated: Boolean(draft),
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

  const requestAiGuidance = () => {
    const content = [
      what ? `What happened: ${what}` : '',
      category ? `Category: ${catLabel}` : '',
      when ? `When: ${when}` : '',
      entity ? `Entity: ${entity}` : '',
      outcome ? `Outcome sought: ${outcome}` : '',
      docs.length
        ? `Documents the user marked from the local checklist: ${docs.map((d) => t(d)).join('; ')}`
        : '',
      draft
        ? `\nNiveshSaathi local draft template the user already has (improve its wording only — invent no fact, law, section, deadline or registration):\n${draft}`
        : '',
    ]
      .filter(Boolean)
      .join('\n')
    if (content.trim()) analyzeProblem(content)
  }

  return (
    <div>
      <section ref={topRef}>
        <div className="card">
          <ProgressSteps steps={flowSteps} current={step} />
        </div>
      </section>

      {/* ------------------------------------------------------- STEP 0: UNDERSTAND */}
      {step === 0 && (
        <section className="section stack">
          <div className="card card--pad-lg animate-in">
            <div className="ev-block__title">
              <Icon name="help" size={15} />
              {t('problem.step0.title')}
            </div>
            <p className="small text-muted" style={{ marginTop: 8, marginBottom: 18 }}>
              {t('problem.step0.intro')}
            </p>

            <div className="field">
              <label className="label" htmlFor="p-what">
                {t('problem.step0.whatLabel')}
              </label>
              <textarea
                id="p-what"
                className="textarea"
                placeholder={t('problem.step0.whatPlaceholder')}
                value={what}
                onChange={(e) => setWhat(e.target.value)}
              />
            </div>

            <div className="field">
              <span className="label">{t('problem.step0.categoryLabel')}</span>
              <div className="radio-row">
                {CATEGORIES.map((c) => (
                  <label key={c} className={`opt${category === c ? ' selected' : ''}`}>
                    <input
                      type="radio"
                      name="category"
                      value={c}
                      checked={category === c}
                      onChange={() => setCategory(c)}
                    />
                    {t(`problem.categories.${c}.label`)}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid-2" style={{ marginTop: 4 }}>
              <div className="field">
                <label className="label" htmlFor="p-when">
                  {t('problem.step0.dateLabel')}
                </label>
                <input
                  id="p-when"
                  className="input"
                  type="text"
                  placeholder={t('problem.step0.datePlaceholder')}
                  value={when}
                  onChange={(e) => setWhen(e.target.value)}
                />
              </div>
              <div className="field">
                <label className="label" htmlFor="p-entity">
                  {t('problem.step0.entityLabel')}
                </label>
                <input
                  id="p-entity"
                  className="input"
                  type="text"
                  placeholder={t('problem.step0.entityPlaceholder')}
                  value={entity}
                  onChange={(e) => setEntity(e.target.value)}
                />
              </div>
            </div>

            <NeverShareNotice />

            <div className="row row--end mt-2">
              <Button variant="primary" icon="arrowRight" onClick={() => goTo(1)}>
                {t('problem.step0.continueBtn')}
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------- STEP 1: DOCUMENT */}
      {step === 1 && (
        <section className="section stack">
          <div className="card card--pad-lg animate-in">
            <div className="ev-block__title">
              <Icon name="doc" size={15} />
              {t('problem.step1.title')}
            </div>

            <p className="small text-muted" style={{ marginTop: 8, marginBottom: 8 }}>
              {category
                ? t('problem.step1.introWithCat', { category: catLabel })
                : t('problem.step1.introGeneric')}
            </p>

            <RecoveryChecklist
              items={docList.map((d, i) => ({ id: `d${i}`, title: d }))}
              checked={docs}
              onToggle={toggleDoc}
              doneLabel={t('problem.step1.readyLabel')}
            />

            <NeverShareNotice />

            <div className="row row--between mt-3">
              <Button
                variant="ghost"
                icon="arrowRight"
                style={backFlip}
                onClick={() => goTo(0)}
              >
                {t('problem.step1.back')}
              </Button>
              <Button variant="primary" icon="doc" onClick={generate}>
                {t('problem.step1.generate')}
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* --------------------------------------------------------- STEP 2/3: DRAFT */}
      {(step === 2 || step === 3) && (
        <section className="section stack">
          <div className="card card--pad-lg animate-in">
            <div className="ev-block__title">
              <Icon name="copy" size={15} />
              {t('problem.step2.title')}
            </div>

            <div className="notice notice--warn" style={{ margin: '14px 0 18px' }}>
              <span className="notice__icon">
                <Icon name="alert" size={18} />
              </span>
              <div className="small">
                <strong>{t('problem.step2.warningStrong')}</strong>{' '}
                {t('problem.step2.warningBody')}
              </div>
            </div>

            <label className="sr-only" htmlFor="draft-box">
              {t('problem.step2.draftLabel')}
            </label>
            <textarea
              id="draft-box"
              className="textarea"
              style={{
                minHeight: 340,
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                fontSize: '0.88rem',
              }}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />

            <div className="row mt-2">
              <Button variant="soft" icon="copy" onClick={copyDraft}>
                {copied ? t('common.copied') : t('problem.step2.copyDraft')}
              </Button>
              <Button variant="outline" icon="refresh" onClick={generate}>
                {t('common.regenerate')}
              </Button>
              <Button
                variant="ghost"
                icon="sparkle"
                onClick={requestAiGuidance}
                disabled={aiState === 'loading'}
              >
                {t('ai.problemButton')}
              </Button>
            </div>

            {aiState !== 'idle' && (
              <div style={{ marginTop: 18 }}>
                <AiAnalysisPanel
                  state={aiState}
                  analysis={aiResult}
                  track="B"
                  onRetry={() => {
                    const content = aiRetryRef.current
                    if (content) analyzeProblem(content)
                  }}
                />
              </div>
            )}

            <div className="row row--end mt-3">
              <Button
                variant="ghost"
                icon="arrowRight"
                style={backFlip}
                onClick={() => goTo(1)}
              >
                {t('problem.step2.back')}
              </Button>
              <Button variant="primary" icon="arrowRight" onClick={() => goTo(4)}>
                {t('problem.step2.chooseRoute')}
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* ---------------------------------------------------------- STEP 4: ROUTE */}
      {step === 4 && (
        <section className="section stack">
          <div className="card card--pad-lg animate-in">
            <div className="ev-block__title">
              <Icon name="compass" size={15} />
              {t('problem.step4.title')}
            </div>

            <p className="small text-muted" style={{ marginTop: 8, marginBottom: 16 }}>
              {t('problem.step4.intro')}
            </p>

            <div className="stack-sm">
              {(category
                ? t(`problem.categories.${category}.routes`)
                : t('problem.genericRoutes')
              ).map((r, i) => (
                <div key={`${r}-${i}`} className="notice notice--info">
                  <span
                    className="notice__icon"
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      background: 'var(--blue-600)',
                      color: '#fff',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {i + 1}
                  </span>
                  <div className="small">
                    <strong>{r}</strong>
                  </div>
                </div>
              ))}
            </div>

            <div className="notice notice--warn" style={{ marginTop: 18 }}>
              <span className="notice__icon">
                <Icon name="info" size={18} />
              </span>
              <div className="small">{t('problem.step4.warning')}</div>
            </div>

            <div className="row row--between mt-3">
              <Button
                variant="ghost"
                icon="arrowRight"
                style={backFlip}
                onClick={() => goTo(3)}
              >
                {t('problem.step4.backToDraft')}
              </Button>
              <Button variant="primary" icon="arrowRight" onClick={() => goTo(5)}>
                {t('problem.step4.nextStep')}
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* --------------------------------------------------------- STEP 5: TRACK */}
      {step === 5 && (
        <section className="section stack">
          <div className="card card--pad-lg animate-in">
            <div className="ev-block__title">
              <Icon name="target" size={15} />
              {t('problem.step5.title')}
            </div>

            <p className="small text-muted" style={{ marginTop: 8, marginBottom: 16 }}>
              {t('problem.step5.intro')}
            </p>

            <RecoveryChecklist
              items={TRACK_ITEMS.map((id) => ({
                id,
                title: t(`problem.step5.trackItems.${id}.title`),
                note: t(`problem.step5.trackItems.${id}.note`),
              }))}
              checked={docs}
              onToggle={toggleDoc}
              doneLabel={t('problem.step5.doneLabel')}
            />

            <div className="notice notice--ok" style={{ marginTop: 18 }}>
              <span className="notice__icon">
                <Icon name="checkCircle" size={18} />
              </span>
              <div className="small">
                <strong>{t('problem.step5.nextStepStrong')}</strong>{' '}
                {t('problem.step5.nextStepBody')}
              </div>
            </div>

            <div className="row mt-3">
              <Button to="/recovery" variant="primary" icon="flag">
                {t('problem.step5.openRecovery')}
              </Button>
              <Button
                variant="ghost"
                icon="arrowRight"
                style={backFlip}
                onClick={() => goTo(4)}
              >
                {t('problem.step5.back')}
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

/* ============================================================= NOMINEE */
function NomineeTool() {
  const [checked, setChecked] = useState(() => read('nominee-checklist', []) || [])
  const { t } = useLanguage()

  useEffect(() => {
    write('nominee-checklist', checked)
  }, [checked])

  const toggle = (id) =>
    setChecked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  return (
    <div className="section stack">
      <div className="card card--pad-lg animate-in">
        <div className="row" style={{ gap: 13, marginBottom: 10 }}>
          <span className="icon-tile icon-tile--green">
            <Icon name="users" size={22} />
          </span>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.2rem' }}>{t('problem.nominee.title')}</h2>
            <p className="small text-muted" style={{ margin: '3px 0 0' }}>
              {t('problem.nominee.sub')}
            </p>
          </div>
        </div>

        <div className="notice notice--info" style={{ margin: '16px 0 20px' }}>
          <span className="notice__icon">
            <Icon name="info" size={18} />
          </span>
          <div className="small">{t('problem.nominee.notice')}</div>
        </div>

        <RecoveryChecklist
          items={NOMINEE_ITEMS.map((id) => ({
            id,
            title: t(`problem.nominee.items.${id}.title`),
            note: t(`problem.nominee.items.${id}.note`),
          }))}
          checked={checked}
          onToggle={toggle}
          doneLabel={t('problem.nominee.doneLabel')}
        />
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="ev-block__title">
            <Icon name="doc" size={15} />
            {t('problem.nominee.infoTitle')}
          </div>
          <ul className="ev-list ev-list--neutral" style={{ marginTop: 4 }}>
            {t('problem.nominee.infoList').map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </div>

        <div className="card">
          <div className="ev-block__title">
            <Icon name="clock" size={15} />
            {t('problem.nominee.processTitle')}
          </div>
          <ol
            className="ev-list ev-list--neutral"
            style={{ listStyle: 'decimal', paddingInlineStart: 22, marginTop: 4 }}
          >
            {t('problem.nominee.processList').map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}

/* =============================================================== IEPF */
function IepfTool() {
  const [checked, setChecked] = useState(() => read('iepf-checklist', []) || [])
  const { t } = useLanguage()

  useEffect(() => {
    write('iepf-checklist', checked)
  }, [checked])

  const toggle = (id) =>
    setChecked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  return (
    <div className="section stack">
      <div className="card card--pad-lg animate-in">
        <div className="row" style={{ gap: 13, marginBottom: 10 }}>
          <span className="icon-tile">
            <Icon name="folder" size={22} />
          </span>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.2rem' }}>{t('problem.iepf.title')}</h2>
            <p className="small text-muted" style={{ margin: '3px 0 0' }}>
              {t('problem.iepf.sub')}
            </p>
          </div>
        </div>

        <div className="notice notice--warn" style={{ margin: '16px 0 20px' }}>
          <span className="notice__icon">
            <Icon name="alert" size={18} />
          </span>
          <div className="small">
            <strong>{t('problem.iepf.noticeStrong')}</strong> {t('problem.iepf.noticeBody')}
          </div>
        </div>

        <RecoveryChecklist
          items={IEPF_ITEMS.map((id) => ({
            id,
            title: t(`problem.iepf.items.${id}.title`),
            note: t(`problem.iepf.items.${id}.note`),
          }))}
          checked={checked}
          onToggle={toggle}
          doneLabel={t('problem.iepf.doneLabel')}
        />
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="ev-block__title">
            <Icon name="doc" size={15} />
            {t('problem.iepf.docsTitle')}
          </div>
          <ul className="ev-list ev-list--neutral" style={{ marginTop: 4 }}>
            {t('problem.iepf.docsList').map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </div>

        <div className="card">
          <div className="ev-block__title">
            <Icon name="target" size={15} />
            {t('problem.iepf.trackTitle')}
          </div>
          <ul className="ev-list ev-list--neutral" style={{ marginTop: 4 }}>
            {t('problem.iepf.trackList').map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card">
        <div className="notice notice--stop">
          <span className="notice__icon">
            <Icon name="lock" size={18} />
          </span>
          <div className="small">{t('safety.neverShareFull')}</div>
        </div>
        <div className="row mt-2">
          <Button to="/recovery" variant="outline" size="sm" icon="flag">
            {t('problem.iepf.ifDefrauded')}
          </Button>
          <Button
            to="/problem"
            variant="ghost"
            size="sm"
            icon="refresh"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            {t('problem.iepf.backToTop')}
          </Button>
        </div>
      </div>
    </div>
  )
}
