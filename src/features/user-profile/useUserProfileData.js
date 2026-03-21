import { useEffect, useState } from 'react'
import { getAuthSession, getStoredUsername } from '../../shared/auth/session.js'
import { findContactByIdentity } from '../../shared/services/salesforce.js'
import { buildCardsFromRecord } from '../../shared/utils/cards.js'
import { calculateAge, formatBirthdate } from '../../shared/utils/date.js'

function normalizePhotoUrl(photoUrl) {
  if (!photoUrl) return null
  if (/^https?:\/\//i.test(photoUrl)) return photoUrl

  return `https://sfcapacitor-dev-ed.develop.my.salesforce.com/${photoUrl.replace(/^\/+/, '')}`
}

export function useUserProfileData() {
  const [cards, setCards] = useState([])
  const [error, setError] = useState('')
  const [loadingMessage, setLoadingMessage] = useState('Loading Salesforce...')

  useEffect(() => {
    void (async () => {
      setLoadingMessage('Loading Salesforce...')

      try {
        const session = getAuthSession()
        const username = getStoredUsername()
        const email = typeof session?.email === 'string' ? session.email.trim() : ''

        if (!username && !email) {
          setError('Username login belum ditemukan di session.')
          setCards([])
          return
        }

        const record = await findContactByIdentity({ username, email })

        const displayName = record?.Name || 'User Profile'
        const age = calculateAge(record?.Birthdate)

        const nextCards = buildCardsFromRecord(record, {
          profileCard: {
            type: 'profile',
            title: displayName,
            subtitle: record ? record?.Hobby__c : 'User Profile',
            description: record
              ? record?.Description 
              : 'Detail persona user yang sedang login, lengkap dengan data profile dan timeline pribadi.',
            username: record?.App_User_ID__c || username || email || '',
            avatar: displayName.slice(0, 1)?.toUpperCase() || '?',
            avatarTone: 'from-slate-300 to-slate-500',
            avatarImage: normalizePhotoUrl(record?.Photo__c),
          },
          fields: [
            {
              label: 'Nama',
              getValue: () => displayName,
            },
            {
              label: 'Username',
              getValue: () => record?.App_User_ID__c || username || email || '-',
            },
            {
              label: 'Email',
              getValue: () => record?.Email || email || '-',
            },
            {
              label: 'Phone',
              keys: ['Phone', 'MobilePhone'],
            },
            {
              label: 'Gender',
              key: 'GenderIdentity',
            },
            {
              label: 'Usia',
              getValue: () => (age != null ? `${age} tahun` : '-'),
            },
            {
              label: 'Birthdate',
              getValue: () => formatBirthdate(record?.Birthdate),
            },
            {
              label: 'Source',
              getValue: () => (record ? 'Salesforce Contact' : 'Local fallback'),
            },
          ],
        })

        if (!record) {
          setError(
            `Contact untuk session login '${username || email}' tidak ditemukan di App_User_ID__c maupun Email.`
          )
          setCards(nextCards)
          return
        }

        setError('')
        setCards(nextCards)
      } catch (err) {
        setError(err.message || 'Gagal mengambil data.')
        setCards([])
      } finally {
        setLoadingMessage('')
      }
    })()
  }, [])

  return {
    cards,
    error,
    loadingMessage,
  }
}
