import { useEffect, useState } from 'react'
import { getRecords } from '../../shared/services/salesforce.js'

export function useVinaPage() {
  const [cards, setCards] = useState([])
  const [error, setError] = useState('')
  const [loadingMessage, setLoadingMessage] = useState('Mengambil Account dari Salesforce...')

  useEffect(() => {
    let isMounted = true

    void (async () => {
      setLoadingMessage('Mengambil Account dari Salesforce...')
      setError('')

      try {
        const records = await getRecords(
          'SELECT Id, Name, BillingStreet FROM Account ORDER BY LastModifiedDate DESC LIMIT 5'
        )
        if (!isMounted) return

        const mappedCards = records.map((account, index) => ({
          id: account?.Id || `account-${index + 1}`,
          title: account?.Name || `Account ${index + 1}`,
          subtitle: 'Account',
          meta: account?.BillingStreet || 'Tanpa alamat jalan',
          objectType: 'Account',
          raw: account,
        }))
        setCards(mappedCards)

        if (mappedCards.length === 0) {
          setError('Data Account kosong untuk integration user saat ini.')
        }
      } catch (err) {
        if (!isMounted) return
        setCards([])
        setError(err.message || 'Gagal mengambil Account.')
      } finally {
        if (isMounted) {
          setLoadingMessage('')
        }
      }
    })()

    return () => {
      isMounted = false
    }
  }, [])

  return {
    cards,
    error,
    loadingMessage,
  }
}
