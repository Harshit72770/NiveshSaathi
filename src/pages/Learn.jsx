import { useState, useMemo, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import Icon from '../components/Icon.jsx'
import LearningCard from '../components/LearningCard.jsx'
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
        </div>
      </div>
    </div>
  )
}
