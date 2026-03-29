import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomStickyNav from '../../shared/components/BottomStickyNav.jsx'
import UserAvatar from '../../shared/components/UserAvatar.jsx'
import { buildAvatarProfile } from '../../shared/data/avatarDirectory.js'
import { getRecords } from '../../shared/services/index.js'
import { circleActions } from './circleData.js'

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

function normalizePhotoUrl(photoUrl) {
  if (!photoUrl) return null
  if (/^https?:\/\//i.test(photoUrl)) return photoUrl

  return `https://sfcapacitor-dev-ed.develop.my.salesforce.com/${photoUrl.replace(/^\/+/, '')}`
}

export default function CirclePage({ showToast }) {
  const navigate = useNavigate()
  const notify = typeof showToast === 'function' ? showToast : () => {}
  const [circles, setCircles] = useState([])
  const [error, setError] = useState('')
  const [loadingMessage, setLoadingMessage] = useState('Loading Salesforce...')
  const [openCircleId, setOpenCircleId] = useState('')

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
                accountId: account?.Id || '',
                title: account?.Name || `Circle ${index + 1}`,
                emoji: circleEmojis[index % circleEmojis.length],
                members: `${contacts.length} member aktif`,
                accent: circleAccents[index % circleAccents.length],
                people: contacts.map((contact, contactIndex) => {
                  const displayName = contact?.Name || `Contact ${contactIndex + 1}`
                  const person = buildAvatarProfile({
                    id: contact?.Id || `${account?.Id || 'circle'}-contact-${contactIndex + 1}`,
                    name: displayName,
                    gender: contact?.GenderIdentity || '',
                    avatarImage: normalizePhotoUrl(contact?.Photo__c),
                  })

                  return {
                    id: person.id,
                    name: person.name,
                    status: mapContactStatus(contact),
                    avatar: person.avatar,
                    avatarTone: person.avatarTone,
                    avatarImage: person.avatarImage,
                  }
                }),
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

  useEffect(() => {
    if (!openCircleId && circles[0]?.id) {
      setOpenCircleId(circles[0].id)
    }
  }, [circles, openCircleId])

  function handleCircleAction(circle, action) {
    if (action.id === 'chat') {
      navigate(`/chat?circle=${circle.id}`)
      return
    }
    if (action.id === 'ranking') {
      navigate(`/friend-ranking?circle=${circle.id}`)
      return
    }
    if (action.id === 'challenge') {
      navigate(`/friend-quiz?circle=${circle.id}`)
      return
    }
    notify(`${circle.title} - ${action.label}`)
  }

  return (
    <div className="h-screen overflow-y-auto bg-[#edf2f7] hide-scrollbar">
      <div className="min-h-screen pb-28">
        <section className="bg-white shadow-none">
          <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-fuchsia-900 px-5 pb-8 pt-[calc(1rem+env(safe-area-inset-top)+1rem)] text-white">
            <button
              className="text-sm font-medium text-white/70"
              onClick={() => navigate('/')}
            >
              {'< Back'}
            </button>
            <h1 className="mt-1 text-2xl font-semibold">Circle / Squad</h1>
            <p className="mt-2 max-w-[24rem] text-sm leading-6 text-white/85">
              Kelola circle terdekatmu dan buka interaksi utama dalam satu tap.
            </p>
          </div>

          <div className="space-y-4 p-3">
            <div className="rounded-3xl bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Your circles</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Setiap circle punya jalur cepat untuk chat, challenge, dan ranking.
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {circles.length} circles
                </span>
              </div>

              {loadingMessage ? (
                <section className="mt-4 rounded-3xl border border-sky-100 bg-sky-50 p-4 text-sm text-sky-700 shadow-sm">
                  {loadingMessage}
                </section>
              ) : null}

              {error ? (
                <section className="mt-4 rounded-3xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm">
                  {error}
                </section>
              ) : null}

              <div className="mt-4 space-y-3">
                {circles.map((circle) => (
                  <div
                    key={circle.id}
                    className="overflow-hidden rounded-3xl bg-slate-50 shadow-sm ring-1 ring-slate-100"
                  >
                    <div className={`bg-gradient-to-r ${circle.accent} px-4 py-4 text-white`}>
                      <div className="flex items-start justify-between gap-3">
                        <button
                          type="button"
                          className="flex flex-1 items-center gap-3 text-left"
                          onClick={() =>
                            setOpenCircleId((current) =>
                              current === circle.id ? '' : circle.id
                            )
                          }
                        >
                          <button
                            type="button"
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-2xl backdrop-blur-sm"
                            onClick={(event) => {
                              event.stopPropagation()
                              navigate(`/${circle.accountId}`, {
                                state: {
                                  from: '/circle',
                                  objectApiName: 'Account',
                                },
                              })
                            }}
                            aria-label={`Open ${circle.title}`}
                            title={circle.title}
                          >
                            {circle.emoji}
                          </button>
                          <div>
                            <h3 className="text-lg font-semibold">{circle.title}</h3>
                            <p className="text-sm text-white/80">{circle.members}</p>
                          </div>
                        </button>

                        <div className="flex flex-wrap justify-end gap-2">
                          {circleActions.filter((action) => action.id !== 'chat').map((action) => (
                            <button
                              key={`${circle.id}-${action.id}`}
                              type="button"
                              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-lg text-white shadow-sm backdrop-blur-sm transition hover:bg-white/25"
                              onClick={() => handleCircleAction(circle, action)}
                              aria-label={action.label}
                              title={action.label}
                            >
                              {action.emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {openCircleId === circle.id ? (
                      <div className="space-y-3 p-3">
                        {(circle.people || []).map((person) => (
                          <div
                            key={person.id}
                            className="rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-100"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  className="flex flex-1 items-center gap-3 text-left"
                                  onClick={() =>
                                    navigate(`/circle/contact/${person.id}/posts`, {
                                      state: {
                                        from: '/circle',
                                        person,
                                        circleTitle: circle.title,
                                      },
                                    })
                                  }
                                  aria-label={`Open ${person.name} posts`}
                                  title={person.name}
                                >
                                  <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full">
                                    <UserAvatar
                                      name={person.name}
                                      image={person.avatarImage}
                                      initial={
                                        person.avatar ?? (person.name?.slice(0, 1)?.toUpperCase() || '?')
                                      }
                                      tone={person.avatarTone ?? 'from-slate-700 to-slate-900'}
                                    />
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-slate-900">{person.name}</p>
                                    <p className="mt-1 text-sm text-slate-500">{person.status}</p>
                                  </div>
                                </button>
                              </div>
                              <button
                                type="button"
                                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-200"
                                onClick={() =>
                                  navigate(`/circle/contact/${person.id}/posts`, {
                                    state: {
                                      from: '/circle',
                                      person,
                                      circleTitle: circle.title,
                                    },
                                  })
                                }
                              >
                                View Post
                              </button>
                            </div>
                          </div>
                        ))}
                        {circle.people?.length === 0 ? (
                          <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-500 shadow-sm ring-1 ring-slate-100">
                            Belum ada Contact di circle ini.
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
      <BottomStickyNav />
    </div>
  )
}
