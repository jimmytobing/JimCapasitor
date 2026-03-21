import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AUTH_STORAGE_KEY } from '../shared/auth/session.js'
import { ensureContactFromGoogleProfile } from '../shared/services/salesforce.js'

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

export function useLoginPage() {
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

  return {
    status,
    isReady,
    isLoading,
    handleGoogleLogin,
  }
}
