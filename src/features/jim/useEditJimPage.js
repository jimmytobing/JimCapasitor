import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { escapeSoqlValue, getRecord, updateRecord } from '../../shared/services/salesforce.js'


function mapRecordToCard(record) {
  const card = {
    id: record?.id || record?.Id || '',
    title: record?.title || record?.Name || '',
    content: record?.content || record?.BillingStreet || '',
  }
  return card
}

function mapCardtoRecord(card) {
  const record = {
    Id: card?.id || card?.Id || '',
    Name: card?.title || '',
    BillingStreet: card?.content || '',
  }
  return record
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
  const recordPass = location.state?.record
  const [card, setCard] = useState(mapRecordToCard(null))
  const [loadingMessage, setLoadingMessage] = useState('load data')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    let isMounted = true

    void (async () => {
      setLoadingMessage('load data')
      setError('')

      await wait(1000)
      if (!isMounted) return
      try {
        if (!recordPass?.id) {
          setLoadingMessage('')
          setError('Id tidak di pass.')
          return
        }

        const safeId = escapeSoqlValue(recordPass.id)
        const record = await getRecord(
          `SELECT FIELDS(ALL) FROM Account WHERE Id = '${safeId}' LIMIT 1`
        )
        if (!isMounted) return

        if (!record) {
          setLoadingMessage('')
          setError('Data tidak ditemukan.')
          return
        }
        setCard(mapRecordToCard(record))
      } catch (err) {
        if (!isMounted) return
        setLoadingMessage('')
        setError(err.message || 'Gagal mengambil data.')
        return
      }

      if (!isMounted) return
      setLoadingMessage('')
      setError('')
    })()

    return () => {
      isMounted = false
    }
  }, [recordPass])

  function handleChange(event) {
    const { name, value } = event.target
    setCard((current) => ({
      ...current,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSaving(true)
    setLoadingMessage('')
    setError('')
    //console.log('Edit Jim payload:', card)

    if (!recordPass?.id) {
      setError('Id tidak di pass.')
      setIsSaving(false)
      return
    }

    const trimmedName = card?.title.trim() || ''
    if (!trimmedName) {
      setError('Nama wajib diisi agar Name tetap valid di Salesforce.')
      setIsSaving(false)
      return
    }

    try {
      const safeId = escapeSoqlValue(recordPass.id)
      await updateRecord("Account",safeId, mapCardtoRecord(card)) 
      await wait(1000)
      notify('data updated')
      navigate('/jim')
    } catch (err) {
      setError(err.message || 'Gagal menyimpan perubahan.')
    } finally {
      setIsSaving(false)
    }
  }

  return {
    error,
    loadingMessage,
    card,
    handleChange,
    handleSubmit,
    isSaving,
    navigate,
    recordPass,
  }
}
