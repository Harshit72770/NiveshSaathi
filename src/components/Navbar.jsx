import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import LanguageSelector from './LanguageSelector.jsx'
import { useLanguage } from '../i18n/index.js'

const LINKS = [
  { to: '/', key: 'home' },
  { to: '/learn', key: 'learn' },
  { to: '/check', key: 'checkContent' },
  { to: '/before-invest', key: 'beforeInvest' },
  { to: '/decisions', key: 'decisions' },
  { to: '/problem', key: 'problem' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { t } = useLanguage()

  const close = () => setOpen(false)

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="brand" onClick={close}>
          <span className="brand__mark">
            <Icon name="shield" size={20} strokeWidth={2.1} />
          </span>
          NiveshSaathi
        </Link>

        <nav aria-label={t('nav.mainNav')}>
          <ul className={`nav-links${open ? ' open' : ''}`}>
            {LINKS.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.to === '/'}
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                  onClick={close}
                >
                  {t(`nav.${l.key}`)}
                </NavLink>
              </li>
            ))}
            <li className="nav-links__recovery">
              <NavLink
                to="/recovery"
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                onClick={close}
              >
                {t('nav.recovery')}
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="navbar__tools">
          <LanguageSelector />

          <button
            type="button"
            className="nav-toggle"
            aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? 'x' : 'menu'} size={22} />
          </button>
        </div>
      </div>
    </header>
  )
}
