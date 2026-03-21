import { useEffect, useMemo, useState } from 'react'
import { buildAvatarProfile } from '../../shared/data/avatarDirectory.js'
import { getStoredUsername } from '../../shared/auth/session.js'
import { querySalesforce } from '../../shared/services/salesforce.js'
import { currentUser } from '../chat/chatData.js'

function escapeSoqlValue(value) {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

function formatBirthdate(value) {
  if (!value) return '-'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function calculateAge(birthdate) {
  if (!birthdate) return null

  const date = new Date(birthdate)
  if (Number.isNaN(date.getTime())) return null

  const today = new Date()
  let age = today.getFullYear() - date.getFullYear()
  const monthDiff = today.getMonth() - date.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    age -= 1
  }

  return age >= 0 ? age : null
}

function buildProfileDetails(contact, fallbackUsername) {
  const age = calculateAge(contact?.Birthdate)

  return [
    { label: 'Nama', value: contact?.Name || currentUser.name },
    { label: 'Username', value: contact?.App_User_ID__c || fallbackUsername || '-' },
    { label: 'Email', value: contact?.Email || '-' },
    { label: 'Phone', value: contact?.Phone || contact?.MobilePhone || '-' },
    { label: 'Gender', value: contact?.GenderIdentity || currentUser.gender || '-' },
    {
      label: 'Usia',
      value: age != null ? `${age} tahun` : currentUser.age ? `${currentUser.age} tahun` : '-',
    },
    { label: 'Birthdate', value: formatBirthdate(contact?.Birthdate) },
    { label: 'Source', value: contact ? 'Salesforce Contact' : 'Local fallback' },
  ]
}

async function fetchUserContact(username) {
  const safeUsername = escapeSoqlValue(username)
  const result = await querySalesforce(
    `SELECT FIELDS(ALL) FROM Contact WHERE App_User_ID__c = '${safeUsername}' LIMIT 200`
  )

  return Array.isArray(result?.records) ? result.records[0] ?? null : null
}

export function useUserProfileData() {
  const [username, setUsername] = useState('')
  const [contact, setContact] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const profile = useMemo(() => {
    const displayName = contact?.Name || currentUser.name
    const baseProfile = buildAvatarProfile({
      ...currentUser,
      id: contact?.App_User_ID__c || username || currentUser.id,
      name: displayName,
      gender: contact?.GenderIdentity || currentUser.gender,
    })

    return {
      ...baseProfile,
      subtitle: contact ? 'Profile dari Salesforce Contact' : 'User Profile',
      description: contact
        ? 'Data profile diambil dari Contact Salesforce berdasarkan username yang tersimpan saat login.'
        : 'Detail persona user yang sedang login, lengkap dengan data profile dan timeline pribadi.',
    }
  }, [contact, username])

  const profileDetails = useMemo(() => buildProfileDetails(contact, username), [contact, username])

  useEffect(() => {
    const storedUsername = getStoredUsername()
    setUsername(storedUsername)

    if (!storedUsername) {
      setError('Username login belum ditemukan di session.')
      setIsLoading(false)
      return
    }

    let isMounted = true

    const loadContact = async () => {
      setIsLoading(true)
      setError('')

      try {
        const firstContact = await fetchUserContact(storedUsername)

        if (!isMounted) return

        setContact(firstContact)

        if (!firstContact) {
          setError(`Contact dengan App_User_ID__c = '${storedUsername}' tidak ditemukan.`)
        }
      } catch (fetchError) {
        if (!isMounted) return
        setError(fetchError instanceof Error ? fetchError.message : 'Gagal mengambil profile user.')
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadContact()

    return () => {
      isMounted = false
    }
  }, [])

  return {
    username,
    isLoading,
    error,
    profile,
    profileDetails,
  }
}
