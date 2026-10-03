import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import { useLanguage } from '../i18n/index.js'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <span
            className="brand__mark"
            style={{ width: 34, height: 34, borderRadius: 10 }}
            aria-hidden="true"
          >
            <Icon name="shield" size={17} strokeWidth={2.1} />
          </span>
          NiveshSaathi
        </div>

        <p>
          <strong>{t('footer.strong')}</strong> {t('footer.body')}
        </p>

        <div className="chip-list">
          <Link to="/recovery" className="chip">
            <Icon name="flag" size={14} /> {t('footer.recovery')}
          </Link>
          <Link to="/problem" className="chip">
            <Icon name="help" size={14} /> {t('footer.grievance')}
          </Link>
        </div>
      </div>
    </footer>
  )
}
