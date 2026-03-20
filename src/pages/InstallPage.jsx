import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AUTH_STORAGE_KEY = 'wpa_google_auth'

function isStandalone() {
  if (typeof window === 'undefined') return false

  const mediaMatch = window.matchMedia?.('(display-mode: standalone)').matches
  const iosStandalone = window.navigator.standalone === true

  return Boolean(mediaMatch || iosStandalone)
}

export default function InstallPage() {
  const navigate = useNavigate()
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [status, setStatus] = useState('')

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault()
      setDeferredPrompt(event)
    }

    const handleAppInstalled = () => {
      console.log('App installed')
      setDeferredPrompt(null)
      setStatus('The app is installed and ready to open from your home screen.')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    if (isStandalone()) {
      const hasSession = Boolean(window.localStorage.getItem(AUTH_STORAGE_KEY))
      navigate(hasSession ? '/home' : '/login', { replace: true })
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [navigate])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      setStatus('Install accepted. Finishing setup now.')
    } else {
      setStatus('Install dismissed. You can try again whenever the prompt is available.')
    }

    setDeferredPrompt(null)
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-8">
      <section className="w-full max-w-sm rounded-[2rem] bg-white/85 p-6 shadow-xl shadow-slate-300/40 ring-1 ring-white/70 backdrop-blur">
        <div className="install-float mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-slate-900 text-3xl text-white shadow-lg shadow-slate-400/30">
          +
        </div>

        <p className="text-center text-sm font-semibold uppercase tracking-[0.28em] text-sky-600">
          Install Gate
        </p>
        <h1 className="mt-3 text-center text-3xl font-semibold text-slate-950">
          Install app to join your circle
        </h1>
        <p className="mt-3 text-center text-sm leading-6 text-slate-600">
          Add WPA App to your home screen for a faster, full-screen mobile experience.
        </p>

        {deferredPrompt ? (
          <button
            type="button"
            onClick={handleInstallClick}
            className="mt-8 w-full rounded-2xl bg-slate-950 px-5 py-4 text-base font-semibold text-white shadow-lg shadow-slate-400/40 transition active:scale-[0.98]"
          >
            Install App
          </button>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-center text-sm text-slate-500">
            Install prompt not available yet. Open this in a supported mobile browser and interact
            with the app if needed.
          </div>
        )}

        {status ? <p className="mt-4 text-center text-sm text-slate-600">{status}</p> : null}
      </section>
    </main>
  )
}
