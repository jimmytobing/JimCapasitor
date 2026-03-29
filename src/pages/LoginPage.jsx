import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AUTH_STORAGE_KEY } from '../shared/auth/session.js'
import { ensureContactFromGoogleProfile } from '../shared/services/index.js'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const GOOGLE_SCRIPT_SRC = 'https://accounts.google.com/gsi/client'

function deriveGoogleUsername(profile) {
  const email = typeof profile?.email === 'string' ? profile.email.trim() : ''
  if (email) return email

  const name = typeof profile?.name === 'string' ? profile.name.trim() : ''
  if (name) return name

  return ''
}

async function fetchGoogleProfile(accessToken) {
  const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error('Google profile could not be loaded.')
  }

  return response.json()
}

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
  const [status, setStatus] = useState('Continue with Google to access the installed app.')
  const [isReady, setIsReady] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    if (params.get('resetAuth') === '1') {
      window.localStorage.removeItem(AUTH_STORAGE_KEY)
    }

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
          callback: async (response) => {
            if (response.error) {
              setStatus('Google sign-in did not complete. Please try again.')
              setIsLoading(false)
              return
            }

            try {
              const profile = await fetchGoogleProfile(response.access_token)
              const session = {
                type: 'google',
                accessToken: response.access_token,
                expiresIn: response.expires_in,
                scope: response.scope,
                tokenType: response.token_type,
                email: profile?.email || '',
                name: profile?.name || '',
                givenName: profile?.given_name || '',
                familyName: profile?.family_name || '',
                avatarUrl: profile?.picture || '',
                locale: profile?.locale || '',
                emailVerified: Boolean(profile?.email_verified),
                googleId: profile?.sub || '',
                username: deriveGoogleUsername(profile),
              }

              window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
              try {
                const syncResult = await ensureContactFromGoogleProfile(session)
                const syncLabel = syncResult.created
                  ? 'Contact baru dibuat'
                  : syncResult.updated
                    ? 'Contact berhasil disinkronkan'
                    : 'Contact sudah ada'
                setStatus(`${syncLabel} untuk ${session.username || 'Google user'}. Redirecting now.`)
              } catch (contactError) {
                console.error('Failed to sync Contact from Google login.', contactError)
                setStatus(
                  `Login berhasil sebagai ${session.username || 'Google user'}, tapi sinkronisasi Contact gagal.`
                )
              }

              navigate('/home', { replace: true })
            } catch (error) {
              window.localStorage.removeItem(AUTH_STORAGE_KEY)
              setStatus(error.message || 'Google profile could not be loaded.')
            } finally {
              setIsLoading(false)
            }
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
              Google Auth
            </span>
          </div>

          <div className="mt-6 max-w-[16rem]">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-950/70">
              Login Gate
            </p>
            <h1 className="mt-3 text-4xl font-black leading-none text-slate-950">
              Back to your zone.
            </h1>
            <p className="mt-4 text-sm leading-6 text-slate-950/75">
              Masuk dulu buat lanjut ke app. Username session sekarang diambil langsung dari akun
              Google yang dipakai saat login.
            </p>
          </div>
        </div>

        <div className="-mt-10 px-5 pb-6">
          <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/90 p-5 shadow-2xl shadow-black/30">
            <div className="flex items-start gap-4">
              <div className="install-float flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-cyan-400 to-fuchsia-500 text-2xl font-black text-white shadow-lg shadow-cyan-500/20">
                in
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
                  Sign In
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Lanjutkan dengan Google, lalu app akan menyimpan username dari profil Google ke
                  session lokal.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={!isReady || isLoading}
              className="mt-5 flex w-full items-center justify-center gap-3 rounded-[1.2rem] border border-white/10 bg-white/5 px-5 py-4 text-base font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-bold text-[#4285F4]">
                G
              </span>
              <span>{isLoading ? 'Connecting...' : 'Continue with Google'}</span>
            </button>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-slate-300">
              Untuk test ulang login page, buka URL dengan{' '}
              <span className="font-semibold text-cyan-300">?resetAuth=1</span>
            </div>

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
