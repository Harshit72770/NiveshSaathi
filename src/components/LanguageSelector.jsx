import { useEffect, useId, useRef, useState } from 'react'
import Icon from './Icon.jsx'
import { useLanguage } from '../i18n/index.js'

/**
 * 🌐 Language selector for the main navigation.
 *
 * Accessible dropdown: keyboard navigation (arrows, Home/End, Enter, Escape),
 * click-outside to close, focus returned to the trigger, native script names,
 * RTL aware, and no fixed widths around translated text.
 */
export default function LanguageSelector() {
  const { language, setLanguage, languages, t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(0, languages.findIndex((l) => l.code === language)),
  )
  const rootRef = useRef(null)
  const triggerRef = useRef(null)
  const listRef = useRef(null)
  const listId = useId()
  const activeId = useId()

  const current = languages.find((l) => l.code === language) || languages[0]

  const close = (restoreFocus = false) => {
    setOpen(false)
    if (restoreFocus) triggerRef.current?.focus()
  }

  // Close when clicking/tapping outside the widget.
  useEffect(() => {
    if (!open) return undefined
    const onPointerDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  // Keep the highlighted row in view while arrowing through the list.
  useEffect(() => {
    if (!open) return
    listRef.current?.querySelector(`[data-index="${activeIndex}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [open, activeIndex])

  const openList = () => {
    setOpen(true)
    setActiveIndex(Math.max(0, languages.findIndex((l) => l.code === language)))
  }

  const choose = (code) => {
    setLanguage(code)
    close(true)
  }

  const onKeyDown = (e) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        openList()
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex((i) => (i + 1) % languages.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex((i) => (i - 1 + languages.length) % languages.length)
        break
      case 'Home':
        e.preventDefault()
        setActiveIndex(0)
        break
      case 'End':
        e.preventDefault()
        setActiveIndex(languages.length - 1)
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        choose(languages[activeIndex].code)
        break
      case 'Escape':
        e.preventDefault()
        close(true)
        break
      case 'Tab':
        setOpen(false)
        break
      default:
        break
    }
  }

  return (
    <div className="lang-select" ref={rootRef}>
      <button
        type="button"
        ref={triggerRef}
        className={`lang-select__trigger${open ? ' is-open' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={
          open ? `${activeId}-${languages[activeIndex].code}` : undefined
        }
        aria-label={`${t('nav.language')}: ${current.native}`}
        title={t('nav.selectLanguage')}
        onClick={() => (open ? close() : openList())}
        onKeyDown={onKeyDown}
      >
        <span aria-hidden="true" className="lang-select__globe">
          <Icon name="language" size={16} />
        </span>
        <span className="lang-select__label">{current.native}</span>
        <span aria-hidden="true" className={`lang-select__caret${open ? ' is-open' : ''}`}>
          ▾
        </span>
      </button>

      {open && (
        <div className="lang-select__menu">
          <div className="lang-select__head">
            <span aria-hidden="true">🌐</span> {t('nav.selectLanguage')}
          </div>
          <ul
            className="lang-select__list"
            role="listbox"
            id={listId}
            aria-label={t('nav.selectLanguage')}
            ref={listRef}
            tabIndex={-1}
            onKeyDown={onKeyDown}
          >
            {languages.map((l, i) => {
              const selected = l.code === language
              const active = i === activeIndex
              return (
                <li key={l.code} role="presentation">
                  <button
                    type="button"
                    role="option"
                    id={`${activeId}-${l.code}`}
                    data-index={i}
                    aria-selected={selected}
                    className={`lang-select__option${selected ? ' is-selected' : ''}${
                      active ? ' is-active' : ''
                    }`}
                    onMouseEnter={() => setActiveIndex(i)}
                    onFocus={() => setActiveIndex(i)}
                    onClick={() => choose(l.code)}
                  >
                    <span className="lang-select__native">{l.native}</span>
                    <span className="lang-select__english">{l.english}</span>
                    {selected && (
                      <span className="lang-select__check" aria-hidden="true">
                        <Icon name="check" size={15} strokeWidth={2.6} />
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
