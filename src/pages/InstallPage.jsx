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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050816] px-5 py-8 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_28%),radial-gradient(circle_at_bottom,_rgba(249,115,22,0.2),_transparent_34%),linear-gradient(180deg,_#050816_0%,_#10162f_48%,_#050816_100%)]" />
      <div className="absolute -left-12 top-20 h-36 w-36 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="absolute -right-10 top-32 h-44 w-44 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="absolute bottom-16 left-8 h-28 w-28 rounded-full bg-orange-400/20 blur-3xl" />

      <section className="relative z-10 w-full max-w-sm overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 shadow-[0_24px_80px_rgba(15,23,42,0.45)] backdrop-blur-xl">
        <div className="border-b border-white/10 bg-gradient-to-r from-cyan-400/90 via-sky-500/90 to-fuchsia-500/90 px-6 pb-16 pt-6 text-slate-950">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-black/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-950">
              HypeZone Mode
            </span>
            <span className="rounded-full bg-white/30 px-3 py-1 text-xs font-semibold text-slate-950">
              Mobile First
            </span>
          </div>

          <div className="mt-6 max-w-[16rem]">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-950/70">
              Install Gate
            </p>
            <h1 className="mt-3 text-4xl font-black leading-none text-slate-950">
              Join the circle.
            </h1>
            <p className="mt-4 text-sm leading-6 text-slate-950/75">
              Install WPA App biar vibe-nya full screen, cepat, dan terasa seperti social app
              beneran di home screen kamu.
            </p>
          </div>
        </div>

        <div className="-mt-10 px-5 pb-6">
          <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/90 p-5 shadow-2xl shadow-black/30">
            <div className="flex items-start gap-4">
              <div className="install-float flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-cyan-400 to-fuchsia-500 text-2xl font-black text-white shadow-lg shadow-cyan-500/20">
                +
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
                  Install App
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Install app to join your circle and unlock the full-screen HypeZone
                  experience.
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Fast
                </p>
                <p className="mt-1 text-sm font-semibold text-white">Launch</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Full
                </p>
                <p className="mt-1 text-sm font-semibold text-white">Screen</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Better
                </p>
                <p className="mt-1 text-sm font-semibold text-white">Flow</p>
              </div>
            </div>

            {deferredPrompt ? (
              <button
                type="button"
                onClick={handleInstallClick}
                className="mt-6 w-full rounded-[1.4rem] bg-gradient-to-r from-cyan-400 via-sky-500 to-fuchsia-500 px-5 py-4 text-base font-black uppercase tracking-[0.2em] text-slate-950 shadow-[0_18px_40px_rgba(59,130,246,0.35)] transition active:scale-[0.98]"
              >
                Install Now
              </button>
            ) : (
              <div className="mt-6 rounded-[1.4rem] border border-dashed border-white/15 bg-white/5 px-4 py-4 text-center text-sm leading-6 text-slate-300">
                Install prompt belum muncul. Buka lewat browser mobile yang support PWA dan
                interact sebentar dengan app.
              </div>
            )}

            {status ? (
              <div className="mt-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm leading-6 text-cyan-100">
                {status}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  )
}
