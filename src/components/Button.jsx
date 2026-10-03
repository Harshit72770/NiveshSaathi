import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'

/**
 * Button that renders as <button> or as a router <Link>/<a>.
 *
 * props: variant ('primary'|'outline'|'soft'|'ghost'|'danger'), size, to, href,
 *        icon, block, lg, children, ...rest
 */
export default function Button({
  variant = 'primary',
  size = '',
  to,
  href,
  icon,
  iconRight,
  block = false,
  lg = false,
  children,
  className = '',
  ...rest
}) {
  const cls = [
    'btn',
    `btn--${variant}`,
    size ? `btn--${size}` : '',
    lg ? 'btn--lg' : '',
    block ? 'btn--block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      {icon && <Icon name={icon} size={size === 'sm' ? 15 : 18} />}
      {children}
      {iconRight && <Icon name={iconRight} size={size === 'sm' ? 15 : 18} />}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={cls} {...rest}>
        {content}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={cls} {...rest}>
        {content}
      </a>
    )
  }

  return (
    <button type="button" className={cls} {...rest}>
      {content}
    </button>
  )
}
