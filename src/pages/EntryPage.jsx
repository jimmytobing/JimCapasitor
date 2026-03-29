import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getEntryRedirectPath } from './entryRouting.js'

export default function EntryPage() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate(getEntryRedirectPath(), { replace: true })
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
