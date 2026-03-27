import { useEffect, useMemo, useState } from 'react'
import { fetchAccountContactsByName } from '../../shared/services/index.js'
import { chatThreads, circleTitles } from './chatData.js'

export function useChatPageData(circleId) {
  const [salesforceState, setSalesforceState] = useState({
    isLoading: false,
    error: '',
    threads: [],
  })

  const localThreads = useMemo(() => {
    if (!circleId) {
      return chatThreads.filter((thread) => thread.messages.length > 0)
    }
    return chatThreads.filter((thread) => thread.circles?.includes(circleId))
  }, [circleId])

  useEffect(() => {
    let isCancelled = false
    const accountName = circleId && circleTitles[circleId] ? circleTitles[circleId] : ''

    if (!accountName) {
      setSalesforceState({
        isLoading: false,
        error: '',
        threads: [],
      })
      return undefined
    }

    const loadCircleThreads = async () => {
      setSalesforceState({
        isLoading: true,
        error: '',
        threads: [],
      })

      try {
        const account = await fetchAccountContactsByName(accountName)

        if (!account) {
          throw new Error(`Account ${accountName} tidak ditemukan di Salesforce.`)
        }

        const threads = account.contacts.map((contact, index) => {
          const displayName = contact.name || `Contact ${index + 1}`

          return {
            id: `sf-contact-${contact.id}`,
            salesforceContactId: contact.id,
            name: displayName,
            avatar: displayName.slice(0, 1),
            avatarTone: 'from-sky-400 to-cyan-500',
            preview: 'Contact dari Salesforce GraphQL',
            time: '',
            inactive: false,
            messages: [],
            source: 'salesforce',
          }
        })

        if (isCancelled) return

        setSalesforceState({
          isLoading: false,
          error: '',
          threads,
        })
      } catch (error) {
        if (isCancelled) return

        setSalesforceState({
          isLoading: false,
          error: error.message || `Gagal memuat chat ${accountName} dari Salesforce.`,
          threads: [],
        })
      }
    }

    loadCircleThreads()

    return () => {
      isCancelled = true
    }
  }, [circleId])

  const visibleThreads =
    circleId && circleTitles[circleId] && salesforceState.threads.length > 0
      ? salesforceState.threads
      : localThreads

  return {
    salesforceState,
    visibleThreads,
  }
}
