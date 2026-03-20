import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AUTH_STORAGE_KEY = 'wpa_google_auth'
const isLocalDevelopment =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')

function isStandalone() {
  if (typeof window === 'undefined') return false

  const mediaMatch = window.matchMedia?.('(display-mode: standalone)').matches
  const iosStandalone = window.navigator.standalone === true

  return Boolean(mediaMatch || iosStandalone)
}

export default function EntryPage() {
  const navigate = useNavigate()

  useEffect(() => {
    if (isLocalDevelopment) {
      navigate('/home', { replace: true })
      return
    }

    const hasSession = Boolean(window.localStorage.getItem(AUTH_STORAGE_KEY))
    const nextPath = !isStandalone() ? '/install' : hasSession ? '/home' : '/login'
    navigate(nextPath, { replace: true })
  }, [navigate])

  return (
    <main className="flex min-h-screen items-center justify-center px-6 text-center">
      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-500">
          WPA App
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">Preparing your experience</h1>
      </div>
    </main>
  )
}
