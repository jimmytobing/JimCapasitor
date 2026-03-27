import { useEffect, useMemo, useState } from 'react'
import { fetchAccountContactsByName } from '../../shared/services/index.js'
import { chatThreads, circleTitles } from '../chat/chatData.js'

export function useFriendRankingData(activeCircleId, notify) {
  const [salesforceState, setSalesforceState] = useState({
    isLoading: false,
    error: '',
    title: '',
    friends: [],
  })

  const localData = useMemo(() => {
    const friends = chatThreads
      .filter((thread) => thread.circles?.includes(activeCircleId))
      .map((thread, index) => {
        const nameScore = thread.name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
        const messageCount = thread.messages.length
        const chat = messageCount > 0 ? messageCount * 18 + (nameScore % 40) : 8 + (nameScore % 18)
        const challenge = Math.max(1, Math.round(chat / 12) + (index % 3))
        const hangout = Math.max(1, Math.round(challenge / 2) + (nameScore % 3))
        const level = Math.max(2, Math.round(chat / 18) + challenge + hangout)

        return {
          ...thread,
          chat,
          challenge,
          hangout,
          level,
        }
      })
      .sort((left, right) => {
        if (right.level !== left.level) return right.level - left.level
        if (right.chat !== left.chat) return right.chat - left.chat
        return left.name.localeCompare(right.name)
      })

    return {
      title: `${circleTitles[activeCircleId]} Ranking`,
      friends,
    }
  }, [activeCircleId])

  useEffect(() => {
    let isCancelled = false

    if (activeCircleId !== 'school-friend') {
      setSalesforceState({
        isLoading: false,
        error: '',
        title: '',
        friends: [],
      })
      return undefined
    }

    const loadSchoolFriends = async () => {
      setSalesforceState((current) => ({
        ...current,
        isLoading: true,
        error: '',
      }))

      try {
        const account = await fetchAccountContactsByName('School Friend')

        if (!account) {
          throw new Error('Account School Friend tidak ditemukan di Salesforce.')
        }

        const friends = account.contacts
          .map((contact, index) => {
            const displayName = contact.name || `Contact ${index + 1}`
            const seed = displayName.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
            const chat = 24 + (seed % 80)
            const challenge = 3 + (seed % 9)
            const hangout = 2 + ((seed + index) % 7)
            const level = Math.max(3, Math.round(chat / 14) + challenge + hangout)

            return {
              id: contact.id,
              name: displayName,
              avatar: displayName.slice(0, 1),
              chat,
              challenge,
              hangout,
              level,
            }
          })
          .sort((left, right) => {
            if (right.level !== left.level) return right.level - left.level
            if (right.chat !== left.chat) return right.chat - left.chat
            return left.name.localeCompare(right.name)
          })

        if (isCancelled) return

        setSalesforceState({
          isLoading: false,
          error: '',
          title: `${account.name} Ranking`,
          friends,
        })
        notify(`Salesforce memuat ${friends.length} school friends`)
      } catch (error) {
        if (isCancelled) return

        setSalesforceState({
          isLoading: false,
          error: error.message || 'Gagal memuat school friends dari Salesforce.',
          title: '',
          friends: [],
        })
        notify('Gagal mengambil ranking dari Salesforce')
      }
    }

    loadSchoolFriends()

    return () => {
      isCancelled = true
    }
  }, [activeCircleId, notify])

  const data =
    activeCircleId === 'school-friend' && salesforceState.friends.length > 0
      ? {
          title: salesforceState.title,
          friends: salesforceState.friends,
        }
      : localData

  return {
    salesforceState,
    data,
  }
}
