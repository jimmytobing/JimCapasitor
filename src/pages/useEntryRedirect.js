import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getEntryRedirectPath } from './entryRouting.js'

export function useEntryRedirect() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate(getEntryRedirectPath(), { replace: true })
  }, [navigate])
}
