/**
 * Lightweight inline SVG icon set.
 * Keeps the bundle small and avoids any external icon dependency.
 * All icons inherit `currentColor` and default to a 24px stroke grid.
 */

const PATHS = {
  shield: (
    <>
      <path d="M12 3l7 3v5.5c0 4.4-2.9 7.6-7 9-4.1-1.4-7-4.6-7-9V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </>
  ),
  book: (
    <>
      <path d="M4 5.5A2.5 2.5 0 016.5 3H19v15H6.5A2.5 2.5 0 004 20.5z" />
      <path d="M4 20.5A2.5 2.5 0 016.5 18H19v3H6.5A2.5 2.5 0 014 20.5z" />
    </>
  ),
  pause: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M10 9v6M14 9v6" />
    </>
  ),
  notebook: (
    <>
      <path d="M6 3h11a2 2 0 012 2v14a2 2 0 01-2 2H6z" />
      <path d="M6 3v18M3 7h3M3 12h3M3 17h3" />
      <path d="M10 8h5M10 12h5" />
    </>
  ),
  alert: (
    <>
      <path d="M10.3 4.3L2.6 17.6A2 2 0 004.3 20.6h15.4a2 2 0 001.7-3L13.7 4.3a2 2 0 00-3.4 0z" />
      <path d="M12 9v4M12 17h.01" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 113.2 2.4c-.7.2-1.2.9-1.2 1.6v.5" />
      <path d="M12 17h.01" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7" />,
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.3l2.4 2.4 4.6-5" />
    </>
  ),
  x: <path d="M6 6l12 12M18 6L6 18" />,
  arrowRight: <path d="M5 12h13M13 6l6 6-6 6" />,
  arrowDown: <path d="M12 5v13M6 13l6 6 6-6" />,
  chevronDown: <path d="M6 9l6 6 6-6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  flag: (
    <>
      <path d="M5 21V4" />
      <path d="M5 5h11l-1.6 3.2L16 12H5z" />
    </>
  ),
  doc: (
    <>
      <path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h4" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z" />
      <circle cx="12" cy="12" r="2.6" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 19c0-3 2.7-5 6-5s6 2 6 5" />
      <path d="M16 5.5a3.2 3.2 0 010 5.6M17.5 14.2c2.1.6 3.5 2.3 3.5 4.8" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.2l3.2 1.9" />
    </>
  ),
  money: (
    <>
      <rect x="2.5" y="6" width="19" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.6" />
      <path d="M6 10v4M18 10v4" />
    </>
  ),
  lock: (
    <>
      <rect x="4.5" y="10" width="15" height="10.5" rx="2" />
      <path d="M8 10V7.5a4 4 0 018 0V10" />
    </>
  ),
  send: (
    <>
      <path d="M21 4L3 11l7 2.6L13 21z" />
      <path d="M21 4l-11 9.6" />
    </>
  ),
  phone: (
    <>
      <path d="M6.5 3h3l1.6 4-2 1.4a12 12 0 005.5 5.5l1.4-2 4 1.6v3a2 2 0 01-2.2 2A17 17 0 014.5 5.2 2 2 0 016.5 3z" />
    </>
  ),
  link: (
    <>
      <path d="M10 13.5a4 4 0 005.7 0l2.8-2.8a4 4 0 10-5.7-5.7l-1.6 1.6" />
      <path d="M14 10.5a4 4 0 00-5.7 0l-2.8 2.8a4 4 0 105.7 5.7l1.6-1.6" />
    </>
  ),
  bell: (
    <>
      <path d="M18 9a6 6 0 10-12 0c0 5-2 6-2 6h16s-2-1-2-6z" />
      <path d="M10.5 20a2 2 0 003 0" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2" />
      <path d="M6.5 7l.8 12a2 2 0 002 1.9h5.4a2 2 0 002-1.9L17.5 7" />
      <path d="M10 11v6M14 11v6" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 11a8 8 0 10-1.5 5.5" />
      <path d="M20 5v6h-6" />
    </>
  ),
  save: (
    <>
      <path d="M5 3h11l3 3v13a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
      <path d="M8 3v6h7M8 17h8" />
    </>
  ),
  filter: <path d="M3 5h18l-7 8v5l-4 2v-7z" />,
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5l-2 5-5 2 2-5z" />
    </>
  ),
  heart: (
    <path d="M12 20s-7-4.4-7-9.3A4 4 0 0112 8a4 4 0 017 2.7C19 15.6 12 20 12 20z" />
  ),
  scale: (
    <>
      <path d="M12 4v16M7 20h10" />
      <path d="M6 8h12" />
      <path d="M6 8l-2.5 5a2.8 2.8 0 005 0zM18 8l-2.5 5a2.8 2.8 0 005 0z" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  sparkle: (
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM18.5 15.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" />
  ),
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M6 15H5a2 2 0 01-2-2V5a2 2 0 012-2h8a2 2 0 012 2v1" />
    </>
  ),
  language: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18" />
    </>
  ),
  chart: (
    <>
      <path d="M4 20V4M4 20h16" />
      <path d="M8 16v-4M12 16V8M16 16v-6" />
    </>
  ),
  play: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M10 8.5l6 3.5-6 3.5z" />
    </>
  ),
  folder: (
    <path d="M3 7a2 2 0 012-2h4l2 2.5h8a2 2 0 012 2V18a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
  ),
  volume: (
    <>
      <path d="M4 9v6h3.5l4.5 3.6V5.4L7.5 9z" />
      <path d="M15.5 9a4 4 0 010 6" />
      <path d="M18 6.5a7.5 7.5 0 010 11" />
    </>
  ),
  stop: (
    <rect x="6.5" y="6.5" width="11" height="11" rx="2.2" />
  ),
}

export default function Icon({ name, size = 20, strokeWidth = 1.9, className = '', style }) {
  const d = PATHS[name]
  if (!d) return null
  return (
    <svg
      className={className}
      style={style}
      data-icon={name}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {d}
    </svg>
  )
}
