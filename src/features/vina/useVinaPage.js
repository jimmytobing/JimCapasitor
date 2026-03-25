import { useEffect, useState } from 'react'
import { fetchRecentItems } from '../../shared/services/salesforce.js'
import { mapRecentItemsToCards } from './vinaRecordUi.js'

export function useVinaPage() {
  const [cards, setCards] = useState([])
  const [error, setError] = useState('')
  const [loadingMessage, setLoadingMessage] = useState('Mengambil recent items dari Salesforce...')

  useEffect(() => {
    let isMounted = true

    void (async () => {
      setLoadingMessage('Mengambil recent items dari Salesforce...')
      setError('')

      try {
        const recentItems = await fetchRecentItems()
        if (!isMounted) return

        const mappedCards = mapRecentItemsToCards(recentItems)
        setCards(mappedCards)

        if (mappedCards.length === 0) {
          setError('Recent items kosong untuk integration user saat ini.')
        }
      } catch (err) {
        if (!isMounted) return
        setCards([])
        setError(err.message || 'Gagal mengambil recent items.')
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
