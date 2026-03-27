import { useEffect, useState } from 'react'
import { getRecords } from '../services/salesforce.js'

function buildListQuery(objectApiName) {
  return `SELECT Id, Name FROM ${objectApiName} LIMIT 5`
}

export function useHzListView(objectApiName) {
  const [cards, setCards] = useState([])
  const [error, setError] = useState('')
  const [loadingMessage, setLoadingMessage] = useState('Loading Salesforce...')

  useEffect(() => {
    void (async () => {
      setLoadingMessage('Loading Salesforce...')
      setError('')

      try {
        const records = await getRecords(buildListQuery(objectApiName))
        if (records.length === 0) {
          setError('Data tidak ditemukan.')
          setCards([])
          return
        }

        setError('')
        setCards(
          records.map((record, index) => ({
            id: record?.Id || `${objectApiName}-${index + 1}`,
            title: record?.Name || `${objectApiName} ${index + 1}`,
            meta: record?.Id || 'Tanpa Id',
            objectType: objectApiName,
            raw: record,
          }))
        )
      } catch (err) {
        setError(err.message || `Gagal mengambil ${objectApiName}.`)
        setCards([])
      }

      setLoadingMessage('')
    })()
  }, [objectApiName])

  return {
    cards,
    error,
    loadingMessage,
  }
}
