import { useState, useEffect, useRef } from 'react'

import Icon from '../components/Icon.jsx'
import Button from '../components/Button.jsx'
import JournalEntry from '../components/JournalEntry.jsx'
import { read, write, uid } from '../utils/localStorage.js'
import { useLanguage, tv } from '../i18n/index.js'

const FIELDS = [
  { id: 'title', type: 'input', required: true },
  { id: 'why', type: 'textarea' },
  { id: 'horizon', type: 'input' },
  { id: 'risk', type: 'textarea' },
  { id: 'evidence', type: 'textarea' },
  { id: 'reconsider', type: 'textarea' },
]

/* value stays an English token (stored data) — the visible label is translated */
const CONFIDENCE = [
  { value: 'Very low', key: 'veryLow' },
  { value: 'Low', key: 'low' },
  { value: 'Uncertain', key: 'uncertain' },
  { value: 'Fairly high', key: 'fairlyHigh' },
  { value: 'High', key: 'high' },
]

export default function Decisions() {
  const [entries, setEntries] = useState(() => read('journal', []) || [])
  const [creating, setCreating] = useState(false)
  const [draft, setDraft] = useState({})
  const [confidence, setConfidence] = useState('')
  const [error, setError] = useState('')
  const formRef = useRef(null)
  const { t } = useLanguage()

  useEffect(() => {
    write('journal', entries)
  }, [entries])

  const set = (id, v) => setDraft((p) => ({ ...p, [id]: v }))

  const startCreate = () => {
    setDraft({})
    setConfidence('')
    setError('')
    setCreating(true)
    window.setTimeout(
      () => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      60,
    )
  }

  const save = (e) => {
    e.preventDefault()
    if (!String(draft.title || '').trim()) {
      setError(t('decisions.requiredError'))
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    const entry = {
      id: uid('jr'),
      title: draft.title.trim(),
      why: draft.why || '',
      horizon: draft.horizon || '',
      risk: draft.risk || '',
      evidence: draft.evidence || '',
      reconsider: draft.reconsider || '',
      confidence,
      createdAt: new Date().toISOString(),
      source: 'manual',
    }

    setEntries((prev) => [entry, ...prev])
    setCreating(false)
    setDraft({})
    setConfidence('')
    setError('')
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 60)
  }

  const remove = (id) => {
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  return (
    <div className="page">
      <section className="animate-in">
        <div className="eyebrow">{t('decisions.eyebrow')}</div>
        <h1>{t('decisions.title')}</h1>
        <p className="lede">{t('decisions.lede')}</p>
      </section>

      <section className="section">
        <div className="row row--between" style={{ gap: 14 }}>
          <div className="row" style={{ gap: 10 }}>
            <span className="badge badge--neutral">
              <Icon name="notebook" size={13} />
              {entries.length}{' '}
              {entries.length === 1 ? t('common.entry') : t('common.entries')}
            </span>
            <span className="small text-muted">{t('common.devicesOnly')}</span>
          </div>

          <div className="row" style={{ gap: 9 }}>
            {creating && (
              <Button variant="ghost" icon="x" onClick={() => setCreating(false)}>
                {t('common.cancel')}
              </Button>
            )}
            {!creating && (
              <Button variant="primary" icon="plus" onClick={startCreate}>
                {t('decisions.newEntry')}
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- CREATE */}
      {creating && (
        <section className="section" ref={formRef}>
          <form className="card card--pad-lg animate-in" onSubmit={save}>
            <div className="ev-block__title">
              <Icon name="plus" size={15} />
              {t('decisions.newEntryTitle')}
            </div>
            <p className="small text-muted" style={{ marginTop: 8, marginBottom: 22 }}>
              {t('decisions.newEntryIntro')}
            </p>

            {FIELDS.map((f) => (
              <div className="field" key={f.id}>
                <label className="label" htmlFor={`j-${f.id}`}>
                  {t(`decisions.fields.${f.id}.label`)}
                  {f.required && <span style={{ color: 'var(--rose-600)' }}> *</span>}
                </label>
                {f.type === 'textarea' ? (
                  <textarea
                    id={`j-${f.id}`}
                    className="textarea"
                    placeholder={tv(t, `decisions.fields.${f.id}.placeholder`, undefined)}
                    value={draft[f.id] || ''}
                    onChange={(e) => set(f.id, e.target.value)}
                  />
                ) : (
                  <input
                    id={`j-${f.id}`}
                    className="input"
                    type="text"
                    placeholder={tv(t, `decisions.fields.${f.id}.placeholder`, undefined)}
                    value={draft[f.id] || ''}
                    onChange={(e) => set(f.id, e.target.value)}
                  />
                )}
              </div>
            ))}

            <div className="field">
              <span className="label">{t('decisions.confidence.label')}</span>
              <div className="hint" style={{ marginTop: -3, marginBottom: 8 }}>
                {t('decisions.confidence.hint')}
              </div>
              <div className="radio-row">
                {CONFIDENCE.map((c) => (
                  <label
                    key={c.value}
                    className={`opt${confidence === c.value ? ' selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="confidence"
                      value={c.value}
                      checked={confidence === c.value}
                      onChange={() => setConfidence(c.value)}
                    />
                    {t(`decisions.confidence.${c.key}`)}
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <div className="notice notice--stop" style={{ marginBottom: 18 }}>
                <span className="notice__icon">
                  <Icon name="alert" size={18} />
                </span>
                <div className="small">{error}</div>
              </div>
            )}

            <hr className="divider" />

            <div className="row row--end">
              <Button variant="ghost" type="button" onClick={() => setCreating(false)}>
                {t('common.cancel')}
              </Button>
              <Button variant="primary" type="submit" icon="save">
                {t('decisions.saveEntry')}
              </Button>
            </div>
          </form>
        </section>
      )}

      {/* ------------------------------------------------------------- ENTRIES */}
      <section className="section">
        {!creating && (
          <div className="row" style={{ marginBottom: 18 }}>
            <Button variant="soft" icon="plus" onClick={startCreate}>
              {t('decisions.newEntry')}
            </Button>
          </div>
        )}

        {entries.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">📓</div>
            <strong>{t('decisions.emptyTitle')}</strong>
            <p className="small" style={{ marginTop: 6, maxWidth: '46ch', marginInline: 'auto' }}>
              {t('decisions.emptyBody')}
            </p>
            <div style={{ marginTop: 16 }}>
              <Button variant="primary" icon="plus" onClick={startCreate}>
                {t('decisions.createFirst')}
              </Button>
            </div>
          </div>
        ) : (
          <div className="stack">
            {entries.map((e) => (
              <JournalEntry key={e.id} entry={e} onDelete={remove} />
            ))}
          </div>
        )}
      </section>

      {/* ------------------------------------------------------------- SUPPORT */}
      <section className="section">
        <div className="card card--pad-lg">
          <div className="notice notice--info">
            <span className="notice__icon">
              <Icon name="info" size={18} />
            </span>
            <div className="small">
              <strong>{t('decisions.supportStrong')}</strong> {t('decisions.supportBody')}
            </div>
          </div>

          <div className="row mt-2">
            <Button to="/before-invest" variant="outline" size="sm" icon="pause">
              {t('decisions.coolingOff')}
            </Button>
            <Button to="/check" variant="soft" size="sm" icon="search">
              {t('decisions.checkMessage')}
            </Button>
            <Button to="/learn" variant="ghost" size="sm" icon="book">
              {t('decisions.learnConcept')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
