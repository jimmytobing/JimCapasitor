export const PUBLIC_BACKEND_NAME = 'HZ-Server'

export function maskBackendName(message, fallback = '') {
  const normalized = typeof message === 'string' ? message.trim() : ''
  const masked = normalized.replace(/salesforce/gi, PUBLIC_BACKEND_NAME)

  return masked || fallback
}
