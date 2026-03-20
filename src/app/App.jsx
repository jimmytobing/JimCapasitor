import { useEffect, useRef, useState } from 'react'
import Toast from '../shared/components/Toast.jsx'
import AppRoutes from './router.jsx'

const APP_THEME_STORAGE_KEY = 'wpa_app_theme'

export default function App() {
  const [toast, setToast] = useState({ visible: false, message: '' })
  const timerRef = useRef(null)
  const [themeMode, setThemeMode] = useState(() => {
    if (typeof window === 'undefined') return 'black'
    return window.localStorage.getItem(APP_THEME_STORAGE_KEY) || 'black'
  })

  const showToast = (message) => {
    setToast({ visible: true, message })
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }))
    }, 2000)
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(APP_THEME_STORAGE_KEY, themeMode)
  }, [themeMode])

  return (
    <div className={`${themeMode === 'black' ? 'app-black-theme' : ''} min-h-screen bg-gray-100`}>
      <div className="mx-auto min-h-screen w-full max-w-sm">
        <AppRoutes
          showToast={showToast}
          themeMode={themeMode}
          setThemeMode={setThemeMode}
        />
      </div>
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  )
}
