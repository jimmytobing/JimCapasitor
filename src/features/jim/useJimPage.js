import { useEffect, useState } from 'react'
import { escapeSoqlValue, getRecords } from '../../shared/services/salesforce.js'

export function useJimPage() {
  const [cards, setCards] = useState([])
  const [error, setError] = useState('')
  const [loadingMessage, setLoadingMessage] = useState('Loading Salesforce...')

  useEffect(() => {
    void (async () => {
      setLoadingMessage('Loading Salesforce...')
      try {
        const safeId = escapeSoqlValue('Tanpa Alamat')
        const records = await getRecords(
          `SELECT Id, Name, BillingStreet FROM Account WHERE BillingStreet <> '${safeId}' LIMIT 5`
        )

        if (records.length === 0) {
          setError('Data tidak ditemukan.')
          setCards([])
          return
        }

        setError('')
        setCards(
          records.map((account, index) => ({
            id: account?.Id || `Aco-${index + 1}`,
            title: account?.Name || `Account tanpa Nama - ${index + 1}`,
            avatarInitial: account?.Name?.slice(0, 1)?.toUpperCase() || '?',
            content: account?.BillingStreet || '-',
          }))
        )
      } catch (err) {
        setError(err.message || 'Gagal mengambil data.')
        setCards([])
      }

      setLoadingMessage('')
    })()
  }, [])

  return {
    cards,
    error,
    loadingMessage,
  }
}
