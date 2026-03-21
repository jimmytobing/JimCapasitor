import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AUTH_STORAGE_KEY } from '../shared/auth/session.js'
import { isStandalone } from '../shared/pwa/install.js'

export function useInstallPage() {
  const navigate = useNavigate()
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [status, setStatus] = useState('')

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault()
      setDeferredPrompt(event)
    }

    const handleAppInstalled = () => {
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

  return {
    deferredPrompt,
    status,
    handleInstallClick,
  }
}
