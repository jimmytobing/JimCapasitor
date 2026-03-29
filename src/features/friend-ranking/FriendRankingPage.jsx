import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import BottomStickyNav from '../../shared/components/BottomStickyNav.jsx'
import UserAvatar from '../../shared/components/UserAvatar.jsx'
import { fetchAccountContactsByCircleId } from '../../shared/services/index.js'
import { chatThreads, circleTitles } from '../chat/chatData.js'
import { podiumStyles } from './friendRankingData.js'

export default function FriendRankingPage({ showToast }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const circleId = searchParams.get('circle') || 'best-friend'
  const notify = typeof showToast === 'function' ? showToast : () => {}
  const activeCircleId = circleTitles[circleId] ? circleId : 'best-friend'
  const [salesforceState, setSalesforceState] = useState({
    isLoading: false,
    error: '',
    title: '',
    friends: [],
  })
  const [loadingMessage, setLoadingMessage] = useState('')
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
      setLoadingMessage('')
      return undefined
    }

    const loadSchoolFriends = async () => {
      setLoadingMessage('Mengambil Account dan Contacts dari Salesforce...')
      setSalesforceState((current) => ({
        ...current,
        isLoading: true,
        error: '',
      }))

      try {
        const account = await fetchAccountContactsByCircleId(activeCircleId, 'School Friend')

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
        setLoadingMessage('')
      } catch (error) {
        if (isCancelled) return

        setSalesforceState({
          isLoading: false,
          error: error.message || 'Gagal memuat school friends dari Salesforce.',
          title: '',
          friends: [],
        })
        setLoadingMessage('')
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

  return (
    <div className="h-screen overflow-y-auto bg-[#edf2f7] hide-scrollbar">
      <div className="min-h-screen pb-28">
        <section className="bg-white shadow-none">
          <div className="bg-gradient-to-r from-rose-700 via-pink-600 to-orange-400 px-5 pb-8 pt-[calc(1rem+env(safe-area-inset-top)+1rem)] text-white">
            <button
              className="text-sm font-medium text-white/80"
              onClick={() => navigate('/circle')}
            >
              {'< Back'}
            </button>
            <h1 className="mt-1 text-2xl font-semibold">Ranking Temen</h1>
            <p className="mt-2 max-w-[24rem] text-sm leading-6 text-white/90">
              Lihat tingkat kedekatan dan friendship level dari circle yang kamu pilih.
            </p>
          </div>

          <div className="space-y-4 p-3">
            <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">{data.title}</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {activeCircleId === 'school-friend'
                      ? 'Data school friend diambil dari Salesforce SOQL dan diurutkan berdasarkan friendship level.'
                      : 'Diurutkan berdasarkan friendship level tertinggi di circle ini.'}
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {activeCircleId === 'school-friend' ? 'SF SOQL' : 'Top bonds'}
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {activeCircleId === 'school-friend' && loadingMessage ? (
                  <div className="rounded-3xl border border-sky-100 bg-sky-50 p-4 text-sm text-sky-700">
                    {loadingMessage}
                  </div>
                ) : null}

                {activeCircleId === 'school-friend' && salesforceState.error ? (
                  <div className="rounded-3xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-700">
                    {salesforceState.error}
                    <div className="mt-1 text-amber-600">
                      Halaman menampilkan fallback data lokal supaya flow app tetap jalan.
                    </div>
                  </div>
                ) : null}

                {data.friends.map((friend, index) => (
                  <div
                    key={friend.name}
                    className={`w-full rounded-3xl p-4 text-left shadow-sm ring-1 transition ${
                      podiumStyles[index] ?? 'bg-white ring-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <p className="min-w-[1.5rem] text-lg font-bold text-slate-700">
                          {index + 1}.
                        </p>
                        <button
                          type="button"
                          className="h-11 w-11 overflow-hidden rounded-full shadow-sm"
                          onClick={() => navigate(`/memory-timeline/${friend.id}`)}
                        >
                          <UserAvatar
                            name={friend.name}
                            image={friend.avatarImage}
                            initial={friend.avatar ?? friend.name.slice(0, 1)}
                            tone={friend.avatarTone}
                          />
                        </button>
                        <button
                          type="button"
                          className="text-left"
                          onClick={() => notify(`${friend.name} Friendship Level ${friend.level}`)}
                        >
                          <p className="text-base font-semibold text-slate-900">{friend.name}</p>
                          <p className="mt-1 text-sm text-slate-500">
                            Friendship Level {friend.level}
                          </p>
                        </button>
                      </div>
                      <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                        {`Lv ${friend.level}`}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-white p-4 ring-1 ring-slate-100">
                      <div className="rounded-2xl bg-slate-50 px-3 py-3 text-center">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                          Chat
                        </p>
                        <p className="mt-2 text-lg font-semibold text-slate-900">
                          {friend.chat}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 px-3 py-3 text-center">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                          Challenge
                        </p>
                        <p className="mt-2 text-lg font-semibold text-slate-900">
                          {friend.challenge}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 px-3 py-3 text-center">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                          Hangout
                        </p>
                        <p className="mt-2 text-lg font-semibold text-slate-900">
                          {friend.hangout}
                        </p>
                      </div>
                    </div>
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
