import { useEffect, useState } from 'react'
import { querySalesforceSoql } from '../../shared/services/salesforce.js'

function escapeSoqlValue(value) {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

async function getRecords(strSOQL) {
  try {
    const result = await querySalesforceSoql(strSOQL)
    const records = Array.isArray(result?.records) ? result.records : []

    if (records.length === 0) {
      return {
        records: [],
        error: 'Data tidak ditemukan.',
      }
    }

    return {
      records,
      error: '',
    }
  } catch (err) {
    return {
      records: [],
      error: err.message || 'Gagal mengambil data.',
    }
  }
}

export function useJimPage() {
  const [cards, setCards] = useState([])
  const [error, setError] = useState('')
  const [loadingMessage, setLoadingMessage] = useState('Loading Salesforce...')

  useEffect(() => {
    void (async () => {
      setLoadingMessage('Loading Salesforce...')
      const safeId = escapeSoqlValue('001dL00001yiqmDQAQ')
      const accountResult = await getRecords(
        `SELECT FIELDS(ALL) FROM Account WHERE BillingStreet <> '${safeId}' LIMIT 200`
      )

      if (accountResult.error) {
        setError(accountResult.error)
        setCards([])
      } else {
        setError('')
        setCards(
          accountResult.records.map((account, index) => ({
            title: account?.Name || `Account tanpa Nama - ${index + 1}`,
            avatarInitial: account?.Name?.slice(0, 1)?.toUpperCase() || '?',
            content: account?.BillingStreet || '-',
          }))
        )
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
