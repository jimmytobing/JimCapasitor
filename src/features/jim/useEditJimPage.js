import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function createInitialForm(record) {
  return {
    id: record?.id || '',
    title: record?.title || '',
    content: record?.content || '',
  }
}

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export function useEditJimPage(showToast) {
  const location = useLocation()
  const navigate = useNavigate()
  const notify = typeof showToast === 'function' ? showToast : () => {}
  const record = location.state?.record
  const [formState, setFormState] = useState(createInitialForm())
  const [loadingMessage, setLoadingMessage] = useState('load data')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    let isMounted = true

    void (async () => {
      setLoadingMessage('load data')

      await wait(1000)
      if (!isMounted) return

      setFormState(createInitialForm(record))

      if (record) {
        setLoadingMessage('data exsist')
        await wait(500)
      } else {
        setLoadingMessage('data not found')
        await wait(500)
      }

      if (!isMounted) return
      setLoadingMessage('')
    })()

    return () => {
      isMounted = false
    }
  }, [record])

  function handleChange(event) {
    const { name, value } = event.target
    setFormState((current) => ({
      ...current,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSaving(true)
    setError('')
    console.log('Edit Jim payload:', formState)

    try {
      await wait(1000)
      notify('Profile data updated')
      navigate('/jim')
    } catch (err) {
      setError(err.message || 'Gagal menyimpan perubahan.')
    } finally {
      setIsSaving(false)
    }
  }

  return {
    error,
    formState,
    handleChange,
    handleSubmit,
    isSaving,
    loadingMessage,
    navigate,
    record,
  }
}
