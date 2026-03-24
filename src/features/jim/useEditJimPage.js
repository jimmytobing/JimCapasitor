import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { escapeSoqlValue, getRecord, updateRecord } from '../../shared/services/salesforce.js'

export function createEmptyCard() {
  return {
    Id: '',
    Title: '',
    Content: '',
  }
}

function mapRecordToCard(record) {
  const card = {
    Id: record?.id || record?.Id || '',
    Title: record?.title || record?.Name || '',
    Content: record?.content || record?.BillingStreet || '',
  }
  return card
}

function mapRecordPass(record) {
  return {
    Id: record?.id || record?.Id || '',
    Title: record?.title || record?.Title || '',
    Content: record?.content || record?.Content || '',
  }
}

function mapCardtoRecord(card) {
  const trimmedName = typeof card?.Title === 'string' ? card.Title.trim() : ''

  const record = {
    Name: trimmedName,
    BillingStreet: card?.Content || '',
  }
  return record
}

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export function useEditJimPage(showToast, card, setCard) {
  const location = useLocation()
  const navigate = useNavigate()
  const notify = typeof showToast === 'function' ? showToast : () => {}
  const recordPass = mapRecordPass(location.state?.record)
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
        if (!recordPass?.Id) {
          setLoadingMessage('')
          setError('Id tidak di pass.')
          return
        }

        const safeId = escapeSoqlValue(recordPass.Id)
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

  async function handleSubmit(event) {
    event.preventDefault()
    setLoadingMessage('')
    setError('')

    const recordId = typeof recordPass?.Id === 'string' ? recordPass.Id.trim() : ''
    const payload = mapCardtoRecord(card)

    if (!recordId) {
      setError('Id tidak di pass.')
      return
    }

    if (!payload.Name) {
      setError('Nama wajib diisi agar Name tetap valid di Salesforce.')
      return
    }

    try {
      setIsSaving(true)
      const safeId = escapeSoqlValue(recordId)
      await updateRecord('Account', safeId, payload)
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
    handleSubmit,
    isSaving,
  }
}
