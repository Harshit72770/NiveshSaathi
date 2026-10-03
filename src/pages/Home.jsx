import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import Button from '../components/Button.jsx'
import { useLanguage } from '../i18n/index.js'

const PRIMARY_CARDS = [
  { to: '/check', emoji: '🔍', key: 'check' },
  { to: '/learn', emoji: '📚', key: 'learn' },
  { to: '/before-invest', emoji: '🛑', key: 'beforeInvest' },
  { to: '/problem', emoji: '🛡️', key: 'problem' },
  { to: '/decisions', emoji: '📓', key: 'decisions' },
  { to: '/recovery', emoji: '🚨', key: 'recovery' },
]

const FLOW = [
  { icon: 'search', key: 'detect' },
  { icon: 'shield', key: 'verify' },
  { icon: 'book', key: 'understand' },
  { icon: 'checkCircle', key: 'actSafely' },
]

const NEVER = [
  ['n1', 'n2', 'n3', 'n4'],
  ['n5', 'n6', 'n7', 'n8'],
]

const JOURNEY = [
  { key: 'e', tone: null },
  { key: 'a', tone: 'rose' },
  { key: 'c', tone: null },
  { key: 'd', tone: 'amber' },
  { key: 'you', tone: 'brand' },
]

export default function Home() {
  const { t, has } = useLanguage()

  return (
    <div className="page">
      {/* ---------------------------------------------------------------- HERO */}
      <section className="hero">
        <div className="animate-in">
          <div className="eyebrow">{t('home.eyebrow')}</div>

          <h1 className="hero__title">
            {t('home.title1')}
            <br />
            <span className="accent">{t('home.title2')}</span>
          </h1>

          <p className="hero__desc">{t('home.description')}</p>

          <div className="hero__actions">
            <Button to="/check" icon="search" lg>
              {t('home.ctaPrimary')}
            </Button>
            <Button to="/learn" variant="outline" lg icon="book">
              {t('home.ctaSecondary')}
            </Button>
          </div>

          <div className="notice notice--info" style={{ marginTop: 26 }}>
            <span className="notice__icon">
              <Icon name="info" size={18} />
            </span>
            <div className="small">
              <strong>{t('safety.noRecommendationsStrong')}</strong> {t('safety.noRecommendationsBody')}
            </div>
          </div>
        </div>

        <div className="hero__panel animate-in animate-in-2">
          <div className="eyebrow" style={{ marginBottom: 16 }}>
            {t('home.howItHelps')}
          </div>

          <div className="float-list">
            {FLOW.map((f, i) => (
              <div className="float-item" key={f.key}>
                <span
                  className="icon-tile"
                  style={{
                    width: 42,
                    height: 42,
                    background: i === 0 ? 'var(--blue-600)' : 'var(--blue-50)',
                    color: i === 0 ? '#fff' : 'var(--blue-600)',
                    borderColor: i === 0 ? 'var(--blue-600)' : 'var(--blue-100)',
                  }}
                >
                  <Icon name={f.icon} size={20} />
                </span>
                <div style={{ minWidth: 0 }}>
                  <div className="float-item__title">{t(`home.flow.${f.key}.title`)}</div>
                  <div className="float-item__sub">{t(`home.flow.${f.key}.sub`)}</div>
                </div>
                {i < FLOW.length - 1 && (
                  <Icon
                    name="arrowDown"
                    size={16}
                    style={{ marginInlineStart: 'auto', color: 'var(--muted-2)' }}
                  />
                )}
              </div>
            ))}
          </div>

          <div
            className="notice"
            style={{ marginTop: 18, background: 'var(--amber-50)', borderColor: 'var(--amber-100)' }}
          >
            <span className="notice__icon" style={{ color: 'var(--amber-700)' }}>
              <Icon name="pause" size={18} />
            </span>
            <div className="small">
              <strong>{t('safety.mantra')}.</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- PRIMARY CARDS */}
      <section className="section">
        <div className="section-head">
          <div className="eyebrow">{t('home.startEyebrow')}</div>
          <h2>{t('home.startTitle')}</h2>
          <p>{t('home.startDesc')}</p>
        </div>

        <div className="card-grid">
          {PRIMARY_CARDS.map((c, i) => (
            <Link
              to={c.to}
              className={`feature-card animate-in animate-in-${Math.min(i + 1, 4)}`}
              key={c.to}
            >
              <div className="row row--between">
                <span className="feature-card__emoji" aria-hidden="true">
                  {c.emoji}
                </span>
                <span className="badge">{t(`home.cards.${c.key}.track`)}</span>
              </div>
              <h3>{t(`home.cards.${c.key}.title`)}</h3>
              <p>{t(`home.cards.${c.key}.desc`)}</p>
              <span className="feature-card__cta">
                {t('common.open')} <Icon name="arrowRight" size={14} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- JOURNEY */}
      <section className="section">
        <div className="section-head">
          <div className="eyebrow">{t('home.journeyEyebrow')}</div>
          <h2>{t('home.journeyTitle')}</h2>
          <p>{t('home.journeyDesc')}</p>
        </div>

        <div className="journey">
          {JOURNEY.map((row) => {
            const j = `home.journey.${row.key}`
            const isYou = row.key === 'you'
            const tagStyle =
              row.tone === 'rose'
                ? { background: 'var(--rose-50)', borderColor: 'var(--rose-100)', color: 'var(--rose-700)' }
                : row.tone === 'amber'
                  ? { background: 'var(--amber-50)', borderColor: 'var(--amber-100)', color: 'var(--amber-700)' }
                  : undefined

            const bulletKeys = ['b1', 'b2', 'b3', 'b4']
              .filter((k) => has(`${j}.${k}`))
              .map((k) => [k, t(`${j}.${k}`)])

            if (isYou) {
              return (
                <div
                  key={row.key}
                  className="journey__row"
                  style={{
                    background: 'linear-gradient(135deg, var(--blue-600), var(--blue-700))',
                    border: 'none',
                  }}
                >
                  <span
                    className="journey__tag"
                    style={{
                      background: 'rgba(255,255,255,.16)',
                      borderColor: 'rgba(255,255,255,.3)',
                      color: '#fff',
                    }}
                  >
                    {t(`${j}.tag`)}
                    <small style={{ color: 'rgba(255,255,255,.8)' }}>{t(`${j}.small`)}</small>
                  </span>
                  <div className="journey__body">
                    <h4 style={{ color: '#fff' }}>{t(`${j}.heading`)}</h4>
                    <ul style={{ color: 'rgba(255,255,255,.9)' }}>
                      {bulletKeys.map(([k, v]) => (
                        <li key={k}>{v}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            }

            return (
              <div className="journey__row" key={row.key}>
                <span className="journey__tag" style={tagStyle}>
                  {t(`${j}.tag`)}
                  <small>{t(`${j}.small`)}</small>
                </span>
                <div className="journey__body">
                  <h4>{t(`${j}.heading`)}</h4>
                  <ul>
                    {bulletKeys.map(([k, v]) => (
                      <li key={k}>{v}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ----------------------------------------------------------- GUARDRAILS */}
      <section className="section">
        <div className="card card--pad-lg">
          <div className="eyebrow">{t('home.guardEyebrow')}</div>
          <div className="grid-2" style={{ marginTop: 6 }}>
            {NEVER.map((column) => (
              <div className="stack-sm" key={column.join('-')}>
                {column.map((k) => (
                  <div className="row" key={k} style={{ gap: 10, flexWrap: 'nowrap' }}>
                    <Icon
                      name="x"
                      size={17}
                      style={{ color: 'var(--rose-600)', flexShrink: 0 }}
                    />
                    <span className="small">{t(`home.never.${k}`)}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <hr className="divider" />

          <div className="row row--between">
            <div className="flow">
              {['safety.understand', 'safety.verify', 'safety.pause', 'safety.decideYourself'].map(
                (s, i, arr) => (
                  <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
                    <span className="flow__node">{t(s)}</span>
                    {i < arr.length - 1 && <span className="flow__arrow">→</span>}
                  </span>
                ),
              )}
            </div>
            <Button to="/check" variant="primary" icon="search">
              {t('home.tryDemo')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
