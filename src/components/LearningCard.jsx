import Icon from './Icon.jsx'
import Quiz from './Quiz.jsx'
import Button from './Button.jsx'
import { useLanguage, SIGNAL_LABEL_KEYS } from '../i18n/index.js'

/**
 * Renders one Track C learning module.
 *
 * props:
 *   module: learningData[i]        — the language-neutral module registry
 *   content: getModuleContent()    — the localised content block
 *   onRelated(id)                  — jump to a related warning signal
 */
export default function LearningCard({ module, content, onRelated }) {
  const { t } = useLanguage()

  if (!content) return null

  const sections = [
    { key: 'concept', icon: 'target' },
    { key: 'simple', icon: 'book' },
    { key: 'analogy', icon: 'compass' },
    { key: 'example', icon: 'chart' },
    { key: 'misunderstanding', icon: 'info', tone: 'amber' },
  ]

  return (
    <article className="stack">
      <div className="card card--pad-lg animate-in">
        <div className="row row--between" style={{ marginBottom: 8 }}>
          <span className="badge">
            <Icon name={module.icon} size={13} /> {content.title}
          </span>
          <span className="small text-muted">{content.subtitle}</span>
        </div>

        <div className="stack" style={{ marginTop: 18 }}>
          {sections.map((s) => (
            <div key={s.key}>
              <div
                className="ev-block__title"
                style={{ color: s.tone === 'amber' ? 'var(--amber-700)' : undefined }}
              >
                <Icon name={s.icon} size={15} />
                {t(`learn.sections.${s.key}`)}
              </div>
              <p style={{ margin: 0, fontSize: '0.98rem', lineHeight: 1.72 }}>{content[s.key]}</p>
            </div>
          ))}
        </div>

        <hr className="divider" />

        <div className="notice notice--info">
          <span className="notice__icon">
            <Icon name="info" size={18} />
          </span>
          <div className="small">{t('learn.noticeNotRecommendation')}</div>
        </div>
      </div>

      <Quiz quiz={content.quiz} />

      {module.relatedSignals && module.relatedSignals.length > 0 && (
        <div className="card animate-in">
          <div className="ev-block__title">
            <Icon name="alert" size={15} />
            {t('learn.relatedSignals.title')}
          </div>
          <p className="small text-muted" style={{ margin: '0 0 14px' }}>
            {t('learn.relatedSignals.body')}
          </p>
          <div className="chip-list">
            {module.relatedSignals.map((id) => (
              <button
                key={id}
                type="button"
                className="chip"
                style={{ cursor: 'pointer', border: '1px solid var(--blue-100)' }}
                onClick={() => onRelated && onRelated(id)}
              >
                <Icon name="arrowRight" size={13} />
                {SIGNAL_LABEL_KEYS[id] ? t(SIGNAL_LABEL_KEYS[id]) : id}
              </button>
            ))}
          </div>
          <div className="mt-2">
            <Button to="/check" variant="soft" size="sm" icon="search">
              {t('learn.relatedSignals.checkMessage')}
            </Button>
          </div>
        </div>
      )}
    </article>
  )
}
