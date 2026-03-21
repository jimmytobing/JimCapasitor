import { AUTH_STORAGE_KEY } from '../shared/auth/session.js'
import { isStandalone } from '../shared/pwa/install.js'

const isLocalDevelopment =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')

export function getEntryRedirectPath() {
  if (isLocalDevelopment) {
    return '/home'
  }

  const hasSession = Boolean(window.localStorage.getItem(AUTH_STORAGE_KEY))
  return !isStandalone() ? '/install' : hasSession ? '/home' : '/login'
}
