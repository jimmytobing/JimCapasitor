import { useEffect, useRef, useState } from 'react'
import Toast from '../shared/components/Toast.jsx'
import AppRoutes from './router.jsx'

export default function App() {
  const [toast, setToast] = useState({ visible: false, message: '' })
  const timerRef = useRef(null)

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

  return (
    <div className="min-h-screen bg-gray-100">
      <AppRoutes showToast={showToast} />
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  )
}
