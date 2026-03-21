import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AUTH_STORAGE_KEY } from '../shared/auth/session.js'

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

export function useLoginPage() {
  const navigate = useNavigate()
  const tokenClientRef = useRef(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
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

  return {
    username,
    setUsername,
    password,
    setPassword,
    status,
    isReady,
    isLoading,
    handleGoogleLogin,
    handleFakeLogin,
  }
}
