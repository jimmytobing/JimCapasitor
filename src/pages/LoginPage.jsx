import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AUTH_STORAGE_KEY = 'wpa_google_auth'
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const GOOGLE_SCRIPT_SRC = 'https://accounts.google.com/gsi/client'

function loadGoogleScript() {
  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${GOOGLE_SCRIPT_SRC}"]`)

    if (existingScript) {
      existingScript.addEventListener('load', resolve, { once: true })
      existingScript.addEventListener('error', reject, { once: true })

      if (window.google?.accounts) {
        resolve()
      }

      return
    }

    const script = document.createElement('script')
    script.src = GOOGLE_SCRIPT_SRC
    script.async = true
    script.defer = true
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

export default function LoginPage() {
  const navigate = useNavigate()
  const tokenClientRef = useRef(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('Continue with Google to access the installed app.')
  const [isReady, setIsReady] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (window.localStorage.getItem(AUTH_STORAGE_KEY)) {
      navigate('/home', { replace: true })
      return
    }

    if (!GOOGLE_CLIENT_ID) {
      setStatus('Set VITE_GOOGLE_CLIENT_ID to enable Google SSO.')
      return
    }

    let isMounted = true

    const setupGoogle = async () => {
      try {
        await loadGoogleScript()

        if (!isMounted || !window.google?.accounts?.oauth2) return

        tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: 'openid email profile',
          callback: (response) => {
            if (response.error) {
              setStatus('Google sign-in did not complete. Please try again.')
              setIsLoading(false)
              return
            }

            window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(response))
            setStatus('Login successful. Redirecting now.')
            setIsLoading(false)
            navigate('/home', { replace: true })
          },
        })

        setIsReady(true)
        setStatus('Continue with Google to access the installed app.')
      } catch {
        if (!isMounted) return
        setStatus('Google Sign-In failed to load. Check your connection and try again.')
      }
    }

    setupGoogle()

    return () => {
      isMounted = false
    }
  }, [navigate])

  const handleGoogleLogin = () => {
    if (!tokenClientRef.current) {
      setStatus('Google SSO is not ready yet. Add VITE_GOOGLE_CLIENT_ID first.')
      return
    }

    setIsLoading(true)
    setStatus('Opening Google Sign-In...')
    tokenClientRef.current.requestAccessToken()
  }

  const handleFakeLogin = (event) => {
    event.preventDefault()

    window.localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        type: 'password',
        username: username || 'guest',
      })
    )

    setStatus('Login successful. Redirecting now.')
    navigate('/home', { replace: true })
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-8">
      <section className="w-full max-w-sm overflow-hidden rounded-[2rem] bg-white/90 shadow-xl shadow-slate-300/40 ring-1 ring-white/70 backdrop-blur">
        <div className="bg-slate-950 px-6 pb-16 pt-8 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-sky-300">Login</p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight">Welcome back to your circle</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Sign in once and continue inside the installed PWA experience.
          </p>
        </div>

        <div className="-mt-8 px-6 pb-6">
          <div className="rounded-[1.75rem] bg-white p-5 shadow-lg shadow-slate-300/40">
            <div className="install-float mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-sky-100 text-2xl font-bold text-sky-700">
              G
            </div>

            <form onSubmit={handleFakeLogin} className="space-y-4">
              <div className="space-y-2 text-left">
                <label htmlFor="username" className="block text-sm font-medium text-slate-700">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Enter your username"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white"
                />
              </div>

              <div className="space-y-2 text-left">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-slate-950 px-5 py-4 text-base font-semibold text-white shadow-lg shadow-slate-300/40 transition active:scale-[0.98]"
              >
                Login
              </button>
            </form>

            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-medium uppercase tracking-[0.24em] text-slate-400">
                or
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={!isReady || isLoading}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-base font-semibold text-slate-800 shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm font-bold text-[#4285F4] ring-1 ring-slate-200">
                G
              </span>
              <span>{isLoading ? 'Connecting...' : 'Continue with Google'}</span>
            </button>

            <p className="mt-4 text-center text-sm leading-6 text-slate-600">{status}</p>
          </div>
        </div>
      </section>
    </main>
  )
}
