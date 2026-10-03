import Icon from './Icon.jsx'

/**
 * Reusable card.
 * props: icon, tone ('' | 'amber' | 'rose' | 'green'), title, children, as
 */
export default function Card({
  icon,
  tone = '',
  title,
  subtitle,
  children,
  className = '',
  as: Tag = 'div',
  ...rest
}) {
  return (
    <Tag className={`card ${className}`.trim()} {...rest}>
      {(icon || title) && (
        <div className="row" style={{ gap: 13, alignItems: 'flex-start', marginBottom: 14 }}>
          {icon && (
            <span className={`icon-tile${tone ? ` icon-tile--${tone}` : ''}`}>
              <Icon name={icon} size={22} />
            </span>
          )}
          {title && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ margin: 0 }}>{title}</h3>
              {subtitle && (
                <p className="text-muted small" style={{ margin: '4px 0 0' }}>
                  {subtitle}
                </p>
              )}
            </div>
          )}
        </div>
      )}
      {children}
    </Tag>
  )
}
