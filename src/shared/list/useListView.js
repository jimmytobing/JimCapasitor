import { useEffect, useState } from 'react'
import { getRecords } from '../services/index.js'
import { sendSalesforceRequest } from '../services/salesforce/client.js'
import {
  buildListQuery,
  mapRecordsToCards,
  TITLE_FIELD_CANDIDATES,
} from './listViewUtils.js'

async function resolveTitleField(objectApiName) {
  try {
    const objectInfo = await sendSalesforceRequest(`ui-api/object-info/${objectApiName}`)
    const availableFields = objectInfo?.fields || {}

    return TITLE_FIELD_CANDIDATES.find((fieldName) => availableFields[fieldName]) || 'Name'
  } catch {
    return 'Name'
  }
}

export function useListView(objectApiName) {
  const [cards, setCards] = useState([])
  const [error, setError] = useState('')
  const [loadingMessage, setLoadingMessage] = useState('Loading Salesforce...')

  useEffect(() => {
    let isMounted = true

    void (async () => {
      setLoadingMessage('Loading Salesforce...')
      setError('')

      try {
        const titleFieldName = await resolveTitleField(objectApiName)
        const records = await getRecords(buildListQuery(objectApiName, titleFieldName))

        if (!isMounted) return

        if (records.length === 0) {
          setError('Data tidak ditemukan.')
          setCards([])
          return
        }

        setError('')
        setCards(mapRecordsToCards(records, objectApiName, titleFieldName))
      } catch (err) {
        if (!isMounted) return

        setError(err.message || `Gagal mengambil ${objectApiName}.`)
        setCards([])
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
