import { useState, useMemo, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import Icon from '../components/Icon.jsx'
import Button from '../components/Button.jsx'
import LearningCard from '../components/LearningCard.jsx'
import AiAnalysisPanel from '../components/AiAnalysisPanel.jsx'
import { fetchAiAnalysis } from '../utils/aiAnalysis.js'
import { learningData } from '../data/learningData.js'
import { useLanguage, getModuleContent } from '../i18n/index.js'

const DEFAULT_MODULE = learningData[0].id

function topicFromSearch(search) {
  const topic = new URLSearchParams(search).get('topic')
  return topic && learningData.some((m) => m.id === topic) ? topic : null
}

export default function Learn() {
  const location = useLocation()
  const navigate = useNavigate()
  const { language, t } = useLanguage()

  const [activeId, setActiveId] = useState(
    () => topicFromSearch(location.search) || DEFAULT_MODULE,
  )

  /* AI explanation (Track C) — opt-in, per selected module. */
  const [aiState, setAiState] = useState('idle') // idle | loading | done | error
  const [aiResult, setAiResult] = useState(null)
  const aiJobRef = useRef(0)
  const aiRetryRef = useRef(null)

  // Allow /check and elsewhere to deep-link: /learn?topic=risk
  useEffect(() => {
    const topic = topicFromSearch(location.search)
    if (topic) setActiveId(topic)
  }, [location.search])

  const activeModule = useMemo(
    () => learningData.find((m) => m.id === activeId) || learningData[0],
    [activeId],
  )

  const activeContent = getModuleContent(language, activeModule.id)
  const progress = 100

  /**
   * Request a simple AI explanation of the active module.
   * Opt-in (button) so switching modules never fires unwanted
   * requests; educational content is benign by design.
   */
  const explainModule = (content) => {
    const job = ++aiJobRef.current
    aiRetryRef.current = content
    setAiResult(null)
    setAiState('loading')
    fetchAiAnalysis({
      track: 'C',
      content,
      language,
      existingAnalysis: {
        framework: 'Track C investor education module',
        moduleId: activeModule.id,
        educational: true,
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

  const explainWithAi = () => {
    const content = [
      `Module: ${activeContent?.title || activeModule.id}`,
      activeContent?.subtitle || '',
      `Concept: ${activeContent?.concept || ''}`,
      `Simple explanation: ${activeContent?.simple || ''}`,
      `Example: ${activeContent?.example || ''}`,
    ]
      .filter(Boolean)
      .join('\n')
    if (content.trim()) explainModule(content)
  }

  // Switching modules clears any previous AI explanation.
  useEffect(() => {
    aiJobRef.current += 1
    aiRetryRef.current = null
    setAiResult(null)
    setAiState('idle')
  }, [activeId])

  return (
    <div className="page">
      <section className="animate-in">
        <div className="row row--between" style={{ alignItems: 'flex-start', gap: 18 }}>
          <div style={{ minWidth: 0 }}>
            <div className="eyebrow">{t('learn.eyebrow')}</div>
            <h1 style={{ marginBottom: 8 }}>{t('learn.title')}</h1>
            <p className="lede">{t('learn.lede')}</p>
          </div>
        </div>

        <div className="row row--between mt-2" style={{ gap: 14 }}>
          <span className="small text-muted">
            <strong style={{ color: 'var(--ink)' }}>
              {t('learn.modulesAvailableCount', {
                done: learningData.length,
                total: learningData.length,
              })}
            </strong>{' '}
            {t('learn.modulesAvailableSuffix')}
          </span>
          <span className="small text-muted">{t('common.educationalOnly')}</span>
        </div>
        <div className="progress" style={{ marginTop: 8 }}>
          <div className="progress__fill" style={{ width: `${progress}%` }} />
        </div>
      </section>

      <div className="section learn-layout">
        {/* ------------------------------------------------------- SIDEBAR */}
        <nav aria-label={t('learn.modulesNav')} className="learn-nav animate-in">
          {learningData.map((m, i) => {
            const content = getModuleContent(language, m.id)
            const active = m.id === activeId
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setActiveId(m.id)}
                aria-current={active ? 'true' : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 11,
                  padding: '12px 14px',
                  borderRadius: 13,
                  border: `1px solid ${active ? 'var(--blue-600)' : 'var(--border)'}`,
                  background: active ? 'var(--blue-600)' : '#fff',
                  color: active ? '#fff' : 'var(--ink-soft)',
                  cursor: 'pointer',
                  textAlign: 'start',
                  fontFamily: 'inherit',
                  fontSize: '0.93rem',
                  fontWeight: active ? 700 : 500,
                  boxShadow: active ? '0 6px 16px rgba(37,99,235,.28)' : 'none',
                  transition: 'all .16s',
                  width: '100%',
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 8,
                    display: 'grid',
                    placeItems: 'center',
                    background: active ? 'rgba(255,255,255,.18)' : 'var(--blue-50)',
                    color: active ? '#fff' : 'var(--blue-600)',
                    fontSize: 11,
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </span>
                <span style={{ minWidth: 0 }}>{content ? content.title : m.id}</span>
              </button>
            )
          })}

          <div className="notice notice--info" style={{ marginTop: 8 }}>
            <span className="notice__icon">
              <Icon name="info" size={17} />
            </span>
            <div className="small">{t('learn.sideNotice')}</div>
          </div>
        </nav>

        {/* --------------------------------------------------------- CONTENT */}
        <div style={{ minWidth: 0 }}>
          <LearningCard
            module={activeModule}
            content={activeContent}
            onRelated={(id) => navigate(`/check?signal=${encodeURIComponent(id)}`)}
          />

          {/* ------------------------------- AI-ASSISTED ANALYSIS (Track C) */}
          <section className="section" style={{ marginTop: 20 }}>
            {aiState === 'idle' && (
              <div className="card card--pad-lg animate-in">
                <div className="ev-block__title">
                  <Icon name="sparkle" size={15} />
                  {t('ai.learnTitle')}
                </div>
                <p className="small text-muted" style={{ margin: '6px 0 16px' }}>
                  {t('ai.learnDesc')}
                </p>
                <Button
                  variant="soft"
                  icon="sparkle"
                  onClick={explainWithAi}
                  disabled={aiState === 'loading'}
                >
                  {t('ai.learnButton')}
                </Button>
              </div>
            )}
            <AiAnalysisPanel
              state={aiState}
              analysis={aiResult}
              track="C"
              onRetry={() => {
                const content = aiRetryRef.current
                if (content) explainModule(content)
              }}
            />
          </section>
        </div>
      </div>
    </div>
  )
}
