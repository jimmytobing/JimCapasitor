import { useEffect, useState } from 'react'
import { getRecords } from '../services/salesforce.js'

function buildListQuery(objectApiName) {
  return `SELECT Id, Name FROM ${objectApiName} ORDER BY LastModifiedDate DESC LIMIT 5`
}

export function useHzListView(objectApiName) {
  const [cards, setCards] = useState([])
  const [error, setError] = useState('')
  const [loadingMessage, setLoadingMessage] = useState(`Mengambil ${objectApiName} dari Salesforce...`)

  useEffect(() => {
    let isMounted = true

    void (async () => {
      setLoadingMessage(`Mengambil ${objectApiName} dari Salesforce...`)
      setError('')

      try {
        const records = await getRecords(buildListQuery(objectApiName))
        if (!isMounted) return

        const mappedCards = records.map((record, index) => ({
          id: record?.Id || `${objectApiName}-${index + 1}`,
          title: record?.Name || `${objectApiName} ${index + 1}`,
          meta: record?.Id || 'Tanpa Id',
          objectType: objectApiName,
          raw: record,
        }))
        setCards(mappedCards)

        if (mappedCards.length === 0) {
          setError(`Data ${objectApiName} kosong untuk integration user saat ini.`)
        }
      } catch (err) {
        if (!isMounted) return
        setCards([])
        setError(err.message || `Gagal mengambil ${objectApiName}.`)
      } finally {
        if (isMounted) {
          setLoadingMessage('')
        }
      }
    })()

    return () => {
      isMounted = false
    }
  }, [objectApiName])

  return {
    cards,
    error,
    loadingMessage,
  }
}
