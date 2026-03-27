import { useEffect, useState } from 'react'
import { getRecords } from '../../shared/services/salesforce.js'

const circleAccents = [
  'from-amber-400 to-orange-500',
  'from-sky-400 to-blue-500',
  'from-violet-400 to-fuchsia-500',
  'from-slate-700 to-slate-900',
  'from-emerald-400 to-teal-500',
  'from-rose-400 to-pink-500',
]

const circleEmojis = ['💛', '🎒', '🎮', '🔒', '🌿', '✨']

function mapContactStatus(contact) {
  return contact?.Title || contact?.Email || contact?.Phone || 'Member aktif'
}

export function useCirclePage() {
  const [circles, setCircles] = useState([])
  const [error, setError] = useState('')
  const [loadingMessage, setLoadingMessage] = useState('Loading Salesforce...')

  useEffect(() => {
    void (async () => {
      setLoadingMessage('Loading Salesforce...')
      setError('')

      try {
        const records = await getRecords(
          "SELECT Id, Name, App_Circle_ID__c, (SELECT FIELDS(ALL) FROM Contacts LIMIT 5) FROM Account WHERE App_Circle_ID__c <> '' LIMIT 200"
        )

        if (records.length === 0) {
          setError('Circle tidak ditemukan.')
          setCircles([])
        } else {
          setError('')
          setCircles(
            records.map((account, index) => {
              const contacts = account?.Contacts?.records || []

              return {
                id: account?.App_Circle_ID__c || account?.Id || `circle-${index + 1}`,
                title: account?.Name || `Circle ${index + 1}`,
                emoji: circleEmojis[index % circleEmojis.length],
                members: `${contacts.length} member aktif`,
                accent: circleAccents[index % circleAccents.length],
                people: contacts.map((contact, contactIndex) => ({
                  id: contact?.Id || `${account?.Id || 'circle'}-contact-${contactIndex + 1}`,
                  name: contact?.Name || `Contact ${contactIndex + 1}`,
                  status: mapContactStatus(contact),
                })),
              }
            })
          )
        }
      } catch (err) {
        setError(err.message || 'Gagal mengambil circle dari Salesforce.')
        setCircles([])
      }

      setLoadingMessage('')
    })()
  }, [])

  return {
    circles,
    error,
    loadingMessage,
  }
}
