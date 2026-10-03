/**
 * Small, safe localStorage wrapper.
 * Never throws in private-mode / blocked-storage environments.
 */

const PREFIX = 'niveshsaathi:'

export function read(key, fallback = null) {
  try {
    const raw = window.localStorage.getItem(PREFIX + key)
    if (raw == null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function write(key, value) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function remove(key) {
  try {
    window.localStorage.removeItem(PREFIX + key)
    return true
  } catch {
    return false
  }
}

/** Generate a short, human-friendly id. */
export function uid(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

/** ISO date string -> "3 Oct 2026, 1:45 AM" (locale-aware) */
export function formatDate(iso, locale = 'en-IN') {
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return String(iso)
    return d.toLocaleString(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  } catch {
    return String(iso)
  }
}
