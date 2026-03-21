export function isStandalone() {
  if (typeof window === 'undefined') return false

  const mediaMatch = window.matchMedia?.('(display-mode: standalone)').matches
  const iosStandalone = window.navigator.standalone === true

  return Boolean(mediaMatch || iosStandalone)
}
