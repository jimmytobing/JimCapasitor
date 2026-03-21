export const AUTH_STORAGE_KEY = 'wpa_google_auth'

function readStoredSession() {
  if (typeof window === 'undefined') return null

  const rawSession = window.localStorage.getItem(AUTH_STORAGE_KEY)
  if (!rawSession) return null

  try {
    return JSON.parse(rawSession)
  } catch {
    return null
  }
}

export function getAuthSession() {
  return readStoredSession()
}

export function getStoredUsername() {
  const session = readStoredSession()

  if (typeof session?.username === 'string' && session.username.trim()) {
    return session.username.trim()
  }

  return ''
}
