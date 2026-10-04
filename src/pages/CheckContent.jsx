import { useState, useRef, useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'

import Icon from '../components/Icon.jsx'
import Button from '../components/Button.jsx'
import EvidenceCard from '../components/EvidenceCard.jsx'
import ProgressSteps from '../components/ProgressSteps.jsx'
import { analyzeContent } from '../utils/contentAnalyzer.js'
import { computeAssessment } from '../utils/assessment.js'
import { fetchAiAnalysis } from '../utils/aiAnalysis.js'
import AiAnalysisPanel from '../components/AiAnalysisPanel.jsx'
import { OCR_ACCEPT, isSupportedImage, ocrLanguages, fetchPageText } from '../utils/inputSources.js'
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

  /* AI analysis (Track A) — complements, never replaces, the rules. */
  const [aiState, setAiState] = useState('idle') // idle | loading | done | error
  const [aiResult, setAiResult] = useState(null)
  const aiJobRef = useRef(0)
  /* Last analyzed content + rule result, so "Retry AI" re-requests
     exactly what was analysed even if the textarea changed. */
  const aiRetryRef = useRef(null)

  /* Input modes: paste (original) / screenshot OCR / link. */
  const [mode, setMode] = useState('paste')
  /* Where the current text came from — shown inside the analysis result. */
  const [source, setSource] = useState(null)

  /* Screenshot upload + local OCR. */
  const [imageUrl, setImageUrl] = useState(null)
  const [ocrState, setOcrState] = useState('idle') // idle | working | done | empty | error
  const [ocrPercent, setOcrPercent] = useState(0)
  const [imageError, setImageError] = useState(false)
  const fileRef = useRef(null)
  const imageUrlRef = useRef(null)
  const ocrWorkerRef = useRef(null)
  const ocrJobRef = useRef(0)

  /* Link input. */
  const [urlValue, setUrlValue] = useState('')
  const [linkState, setLinkState] = useState('idle') // idle | working | done | invalid | blocked
  /* Facts about a URL whose content could NOT be retrieved (for the
     "Needs verification" panel — never an analysis, never a verdict). */
  const [blockedFacts, setBlockedFacts] = useState(null)

  // Deep link from Learn: /check?signal=guaranteed-return
  const linkedSignal = useMemo(() => {
    const s = new URLSearchParams(location.search).get('signal')
    return s && SIGNAL_MAP[s] ? SIGNAL_MAP[s] : null
  }, [location.search])

  useEffect(() => {
    if (linkedSignal) inputRef.current?.focus()
  }, [linkedSignal])

  /* On unmount: release the preview image and stop any OCR worker. */
  useEffect(() => {
    const ref = imageUrlRef
    const workerRef = ocrWorkerRef
    return () => {
      if (ref.current) URL.revokeObjectURL(ref.current)
      safeTerminate(workerRef.current)
      workerRef.current = null
    }
  }, [])

  /**
   * Request the AI interpretation (Track A) for the current text.
   * Best-effort: the rule-based result above is already final and
   * stays on screen whatever happens here. Stale responses are
   * discarded via the job counter.
   */
  const runAiAnalysis = (content, analysis) => {
    const job = ++aiJobRef.current
    aiRetryRef.current = { content, analysis }
    setAiResult(null)
    setAiState('loading')
    fetchAiAnalysis({
      track: 'A',
      content,
      language,
      existingAnalysis: {
        signalCount: analysis.signalCount,
        highSignalCount: analysis.highSignalCount,
        cautionLevel: analysis.cautionLevel,
        contentType: analysis.contentType,
        claim: analysis.claim,
        warningSignals: analysis.warningSignals.map((s) => ({
          id: s.id,
          label: s.label,
          severity: s.severity,
        })),
        evidence: analysis.evidence,
        missingEvidence: analysis.missingEvidence,
        intendedAction: analysis.intendedAction,
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

  const analyze = () => {
    if (!text.trim()) {
      setResult(null)
      inputRef.current?.focus()
      return
    }
    // Snapshot the source with the analysis so the result always shows
    // where this text actually came from. Link analyses also get the
    // rule-based four-level assessment (source facts stay separate from
    // what the page claims).
    const analysis = analyzeContent(text)
    if (source && source.type === 'link') {
      analysis.assessment = computeAssessment(analysis, source)
    }
    setResult({ ...analysis, source })
    setLostMoney(false)
    // AI interpretation runs alongside the rules (Track A).
    runAiAnalysis(text, analysis)
    window.setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  }

  const loadDemo = (d = DEMO_MESSAGES[0]) => {
    setText(d.text)
    setActiveDemo(d.id)
    setResult(null)
    setSource(null)
    setBlockedFacts(null)
    resetImage()
    setLinkState('idle')
    aiJobRef.current += 1
    aiRetryRef.current = null
    setAiResult(null)
    setAiState('idle')
    inputRef.current?.focus()
    window.setTimeout(() => {
      inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 60)
  }

  const clear = () => {
    setText('')
    setResult(null)
    setActiveDemo(null)
    setSource(null)
    setBlockedFacts(null)
    resetImage()
    setLinkState('idle')
    aiJobRef.current += 1
    aiRetryRef.current = null
    setAiResult(null)
    setAiState('idle')
    inputRef.current?.focus()
  }

  /* ------------------------------------------------------------ OCR HELPERS */

  const safeTerminate = (worker) => {
    if (!worker) return
    try {
      const p = worker.terminate()
      if (p && typeof p.catch === 'function') p.catch(() => {})
    } catch {
      /* worker already gone */
    }
  }

  /** Replace (or clear) the object URL used for the image preview. */
  const setImagePreview = (url) => {
    if (imageUrlRef.current) URL.revokeObjectURL(imageUrlRef.current)
    imageUrlRef.current = url || null
    setImageUrl(url || null)
  }

  /** Stop any running OCR job and drop the preview image. */
  const resetImage = () => {
    ocrJobRef.current += 1
    safeTerminate(ocrWorkerRef.current)
    ocrWorkerRef.current = null
    setImagePreview(null)
    setOcrState('idle')
    setOcrPercent(0)
    setImageError(false)
  }

  const removeImage = () => resetImage()

  /**
   * Read the selected screenshot with local OCR (tesseract.js, loaded on
   * demand). The extracted text is NEVER auto-analysed: it lands in the
   * textarea for the user to review and correct first.
   */
  const runOcr = async () => {
    const target = imageUrlRef.current
    if (!target) return
    const job = ++ocrJobRef.current

    try {
      const mod = await import('tesseract.js')
      const createWorker = mod.createWorker || (mod.default && mod.default.createWorker)
      if (typeof createWorker !== 'function') throw new Error('OCR unavailable')

      const worker = await createWorker(ocrLanguages(language), 1, {
        logger: (m) => {
          if (job !== ocrJobRef.current) return
          if (m && typeof m.progress === 'number') {
            setOcrPercent(Math.max(0, Math.min(100, Math.round(m.progress * 100))))
          }
        },
      })

      if (job !== ocrJobRef.current) {
        safeTerminate(worker)
        return
      }

      ocrWorkerRef.current = worker
      let data = null
      try {
        const out = await worker.recognize(target)
        data = out && out.data
      } finally {
        safeTerminate(worker)
        if (ocrWorkerRef.current === worker) ocrWorkerRef.current = null
      }

      if (job !== ocrJobRef.current) return // superseded / removed

      const raw = (data && data.text) || ''
      const extracted = raw.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim()

      if (!extracted) {
        setOcrState('empty')
        return
      }

      setText(extracted)
      setSource({ type: 'image' })
      setResult(null)
      setLostMoney(false)
      setActiveDemo(null)
      setOcrState('done')
      window.setTimeout(() => {
        inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 80)
    } catch {
      if (job === ocrJobRef.current) setOcrState('error')
    }
  }

  /** File picker change: validate, preview, then run OCR. */
  const onFileChange = async (e) => {
    const file = e.target.files && e.target.files[0]
    e.target.value = '' // allow re-selecting the same file
    if (!file) return

    if (!isSupportedImage(file)) {
      // Keep any existing image; just surface the format/size error.
      setImageError(true)
      return
    }

    setImageError(false)
    ocrJobRef.current += 1
    safeTerminate(ocrWorkerRef.current)
    ocrWorkerRef.current = null
    setImagePreview(URL.createObjectURL(file))
    setOcrState('working')
    setOcrPercent(0)
    await runOcr()
  }

  /* ----------------------------------------------------------- LINK HELPERS */

  /**
   * Retrieve readable page text for the pasted URL. Any CORS/network/
   * parsing failure lands on the "blocked" state, which tells the user to
   * paste the text or upload a screenshot instead.
   */
  const fetchLink = async () => {
    if (!urlValue.trim() || linkState === 'working') return
    setLinkState('working')
    setBlockedFacts(null)
    try {
      const res = await fetchPageText(urlValue)
      if (res.status === 'invalid') {
        setLinkState('invalid')
        return
      }
      if (res.status !== 'ok') {
        // Nothing was read — record only the address facts so the UI can
        // say "needs verification", never "fraud".
        setBlockedFacts({ domain: res.domain, https: res.https, url: res.url })
        setLinkState('blocked')
        return
      }

      setText(res.text)
      setSource({
        type: 'link',
        url: res.url,
        domain: res.domain,
        https: res.https,
        official: res.official,
        title: res.title || '',
        retrieved: true,
      })
      setResult(null)
      setLostMoney(false)
      setActiveDemo(null)
      setLinkState('done')
      window.setTimeout(() => {
        inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 80)
    } catch {
      setBlockedFacts(null)
      setLinkState('blocked')
    }
  }

  const onTextChange = (e) => {
    setText(e.target.value)
    // Text typed over in Paste mode no longer belongs to a fetched source.
    if (mode === 'paste' && source) setSource(null)
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

        {/* --------------------------------------------------- INPUT MODES */}
        <div
          className="tabs"
          role="tablist"
          aria-label={t('checkContent.modes.label')}
          style={{ marginTop: 4 }}
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'paste'}
            className={`tab${mode === 'paste' ? ' active' : ''}`}
            onClick={() => setMode('paste')}
          >
            {t('checkContent.modes.paste')}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'image'}
            className={`tab${mode === 'image' ? ' active' : ''}`}
            onClick={() => setMode('image')}
          >
            {t('checkContent.modes.screenshot')}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'link'}
            className={`tab${mode === 'link' ? ' active' : ''}`}
            onClick={() => setMode('link')}
          >
            {t('checkContent.modes.link')}
          </button>
        </div>

        {mode === 'paste' && (
          <p className="hint" style={{ marginTop: 12 }}>
            {t('checkContent.modes.pasteHint')}
          </p>
        )}

        {/* ------------------------------------------------ SCREENSHOT PANEL */}
        {mode === 'image' && (
          <div
            className="stack-sm"
            style={{ marginTop: 14 }}
            role="tabpanel"
            aria-label={t('checkContent.modes.screenshot')}
          >
            <p className="small" style={{ margin: 0, fontWeight: 700, color: 'var(--ink)' }}>
              {t('checkContent.ocr.heading')}
            </p>
            <p className="small text-muted" style={{ margin: 0 }}>
              {t('checkContent.ocr.hint')}
            </p>

            <input
              id="check-ocr-file"
              ref={fileRef}
              type="file"
              className="sr-only"
              accept={OCR_ACCEPT}
              onChange={onFileChange}
            />

            {imageError && (
              <div className="notice notice--stop" style={{ marginTop: 4 }}>
                <span className="notice__icon">
                  <Icon name="alert" size={18} />
                </span>
                <div className="small">{t('checkContent.ocr.invalid')}</div>
              </div>
            )}

            {!imageUrl && (
              <div className="row" style={{ gap: 9 }}>
                <label
                  className="btn btn--primary"
                  htmlFor="check-ocr-file"
                  style={{ cursor: 'pointer' }}
                >
                  <Icon name="doc" size={18} />
                  {t('checkContent.ocr.choose')}
                </label>
              </div>
            )}

            {imageUrl && (
              <div className="card" style={{ padding: 14 }}>
                <img
                  src={imageUrl}
                  alt={t('checkContent.ocr.previewAlt')}
                  style={{
                    display: 'block',
                    maxWidth: '100%',
                    maxHeight: 220,
                    margin: '0 auto',
                    borderRadius: 12,
                    border: '1px solid var(--border)',
                    objectFit: 'contain',
                  }}
                />

                {ocrState === 'working' && (
                  <div style={{ marginTop: 14 }}>
                    <div className="small" style={{ marginBottom: 7 }}>
                      {t('checkContent.ocr.reading', { percent: ocrPercent })}
                    </div>
                    <div
                      className="progress"
                      role="progressbar"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={ocrPercent}
                    >
                      <div className="progress__fill" style={{ width: `${ocrPercent}%` }} />
                    </div>
                    <p className="hint">{t('checkContent.ocr.readingNote')}</p>
                  </div>
                )}

                {ocrState === 'done' && (
                  <div className="notice notice--ok" style={{ marginTop: 12 }}>
                    <span className="notice__icon">
                      <Icon name="checkCircle" size={18} />
                    </span>
                    <div>
                      <strong>{t('checkContent.ocr.reviewTitle')}</strong>
                      <div className="small" style={{ marginTop: 3 }}>
                        {t('checkContent.ocr.reviewBody')}
                      </div>
                    </div>
                  </div>
                )}

                {ocrState === 'empty' && (
                  <div className="notice notice--warn" style={{ marginTop: 12 }}>
                    <span className="notice__icon">
                      <Icon name="info" size={18} />
                    </span>
                    <div>
                      <strong>{t('checkContent.ocr.emptyTitle')}</strong>
                      <div className="small" style={{ marginTop: 3 }}>
                        {t('checkContent.ocr.emptyBody')}
                      </div>
                    </div>
                  </div>
                )}

                {ocrState === 'error' && (
                  <div className="notice notice--stop" style={{ marginTop: 12 }}>
                    <span className="notice__icon">
                      <Icon name="alert" size={18} />
                    </span>
                    <div>
                      <strong>{t('checkContent.ocr.errorTitle')}</strong>
                      <div className="small" style={{ marginTop: 3 }}>
                        {t('checkContent.ocr.errorBody')}
                      </div>
                    </div>
                  </div>
                )}

                <div className="row" style={{ marginTop: 13, gap: 9 }}>
                  <label
                    className="btn btn--soft"
                    htmlFor="check-ocr-file"
                    style={{ cursor: 'pointer' }}
                  >
                    <Icon name="refresh" size={17} />
                    {t('checkContent.ocr.replace')}
                  </label>
                  <Button variant="outline" icon="x" onClick={removeImage}>
                    {t('checkContent.ocr.remove')}
                  </Button>
                  {(ocrState === 'empty' || ocrState === 'error') && (
                    <Button variant="ghost" icon="arrowRight" onClick={() => setMode('paste')}>
                      {t('checkContent.modes.paste')}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ----------------------------------------------------- LINK PANEL */}
        {mode === 'link' && (
          <div
            className="stack-sm"
            style={{ marginTop: 14 }}
            role="tabpanel"
            aria-label={t('checkContent.link.heading')}
          >
            <p className="small" style={{ margin: 0, fontWeight: 700, color: 'var(--ink)' }}>
              {t('checkContent.link.heading')}
            </p>

            <div className="row" style={{ gap: 9 }}>
              <label className="sr-only" htmlFor="check-link-input">
                {t('checkContent.link.label')}
              </label>
              <input
                id="check-link-input"
                className="input"
                style={{ flex: '1 1 240px', minWidth: 0 }}
                type="url"
                inputMode="url"
                autoComplete="off"
                spellCheck={false}
                placeholder={t('checkContent.link.placeholder')}
                value={urlValue}
                onChange={(e) => {
                  setUrlValue(e.target.value)
                  if (linkState !== 'working') setLinkState('idle')
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    fetchLink()
                  }
                }}
              />
              <Button
                variant="primary"
                icon="link"
                onClick={fetchLink}
                disabled={!urlValue.trim() || linkState === 'working'}
              >
                {t('checkContent.link.fetch')}
              </Button>
            </div>

            {linkState === 'working' && (
              <div className="small text-muted">{t('checkContent.link.fetching')}</div>
            )}

            {linkState === 'invalid' && (
              <div className="notice notice--stop">
                <span className="notice__icon">
                  <Icon name="alert" size={18} />
                </span>
                <div className="small">{t('checkContent.link.invalid')}</div>
              </div>
            )}

            {linkState === 'blocked' && (
              <div className="notice notice--info" role="status">
                <span className="notice__icon" style={{ fontSize: 17, marginTop: 0 }}>
                  🟡
                </span>
                <div style={{ minWidth: 0 }}>
                  <div className="row" style={{ gap: 8 }}>
                    <strong>{t('assessment.title')}</strong>
                    <span className="badge">{t('assessment.levels.verify.label')}</span>
                  </div>
                  <div className="small" style={{ marginTop: 4 }}>
                    {t('assessment.levels.verify.body')}
                  </div>

                  {blockedFacts && (
                    <div className="small text-muted" style={{ marginTop: 7 }}>
                      <strong style={{ color: 'var(--ink-soft)' }}>{t('sourceInfo.domain')}:</strong>{' '}
                      <span style={{ wordBreak: 'break-all', unicodeBidi: 'isolate' }}>
                        {blockedFacts.domain}
                      </span>{' '}
                      ·{' '}
                      <strong style={{ color: 'var(--ink-soft)' }}>
                        {t('sourceInfo.secureLabel')}:
                      </strong>{' '}
                      {blockedFacts.https ? t('sourceInfo.secureYes') : t('sourceInfo.secureNo')}
                    </div>
                  )}

                  <div className="small" style={{ marginTop: 7 }}>
                    {t('checkContent.link.blocked')}
                  </div>

                  <div className="row" style={{ marginTop: 10, gap: 9 }}>
                    <Button variant="soft" size="sm" icon="doc" onClick={() => setMode('image')}>
                      {t('checkContent.modes.screenshot')}
                    </Button>
                    <Button variant="ghost" size="sm" icon="arrowRight" onClick={() => setMode('paste')}>
                      {t('checkContent.modes.paste')}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {linkState === 'done' && (
              <div className="notice notice--ok">
                <span className="notice__icon">
                  <Icon name="checkCircle" size={18} />
                </span>
                <div>
                  <strong>{t('checkContent.link.reviewTitle')}</strong>
                  <div className="small" style={{ marginTop: 3 }}>
                    {t('checkContent.link.reviewBody')}
                  </div>
                </div>
              </div>
            )}

            <p className="hint">{t('checkContent.link.safetyNote')}</p>
          </div>
        )}

        <label className="sr-only" htmlFor="content-input">
          {t('checkContent.inputLabel')}
        </label>
        <textarea
          id="content-input"
          ref={inputRef}
          className="textarea textarea--xl"
          placeholder={t('checkContent.placeholder')}
          value={text}
          onChange={onTextChange}
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
          </div>            {mode !== 'link' && <p className="hint">{t('checkContent.localOnly')}</p>}
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

          {/* ----------------------------------- RULE-BASED RESULT (Tracks E + A) */}
          <section className="section">
            <div className="row" style={{ gap: 8, marginBottom: 10 }}>
              <span className="badge badge--neutral">
                <Icon name="search" size={12} />
                {t('ai.badgeRules')}
              </span>
            </div>
            <EvidenceCard result={result} />
          </section>

          {/* ------------------------------------------- AI-ASSISTED ANALYSIS */}
          <section className="section">
            <AiAnalysisPanel
              state={aiState}
              analysis={aiResult}
              track="A"
              onRetry={() => {
                const retry = aiRetryRef.current
                if (retry) runAiAnalysis(retry.content, retry.analysis)
              }}
            />
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
