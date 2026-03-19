import { useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import BottomStickyNav from '../../shared/components/BottomStickyNav.jsx'
import { chatThreads, circleTitles } from '../chat/chatData.js'

const podiumStyles = {
  0: 'bg-gradient-to-r from-yellow-100 via-amber-50 to-yellow-200 ring-yellow-300',
  1: 'bg-gradient-to-r from-[#eef2f7] via-[#d8dee8] to-[#c4ccd8] ring-[#aab4c3]',
  2: 'bg-gradient-to-r from-orange-100 via-amber-50 to-orange-200 ring-orange-300',
}

const avatarTones = [
  'from-orange-400 to-amber-500',
  'from-sky-400 to-cyan-500',
  'from-pink-400 to-rose-500',
  'from-violet-400 to-purple-500',
  'from-emerald-400 to-teal-500',
  'from-fuchsia-400 to-pink-500',
]

export default function FriendRankingPage({ showToast }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const circleId = searchParams.get('circle') || 'best-friend'
  const notify = typeof showToast === 'function' ? showToast : () => {}

  const getAvatarTone = (name, index) => {
    const total = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
    return avatarTones[(total + index) % avatarTones.length]
  }

  const data = useMemo(() => {
    const activeCircleId = circleTitles[circleId] ? circleId : 'best-friend'
    const friends = chatThreads
      .filter((thread) => thread.circles?.includes(activeCircleId))
      .map((thread, index) => {
        const nameScore = thread.name
          .split('')
          .reduce((sum, char) => sum + char.charCodeAt(0), 0)
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
  }, [circleId])

  return (
    <div className="h-screen overflow-y-auto bg-[#edf2f7] hide-scrollbar">
      <div className="min-h-screen pb-28">
        <section className="bg-white shadow-none">
          <div className="bg-gradient-to-r from-rose-700 via-pink-600 to-orange-400 px-5 pb-8 pt-[calc(1rem+env(safe-area-inset-top)+1rem)] text-white">
            <button
              className="text-sm font-medium text-white/80"
              onClick={() => navigate('/circle-squad')}
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
                    Diurutkan berdasarkan friendship level tertinggi di circle ini.
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  Top bonds
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {data.friends.map((friend, index) => (
                  <button
                    key={friend.name}
                    className={`w-full rounded-3xl p-4 text-left shadow-sm ring-1 transition ${
                      podiumStyles[index] ?? 'bg-white ring-slate-300 hover:bg-slate-50'
                    }`}
                    onClick={() => notify(`${friend.name} Friendship Level ${friend.level}`)}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <p className="min-w-[1.5rem] text-lg font-bold text-slate-700">
                          {index + 1}.
                        </p>
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br ${
                            friend.avatarTone ?? getAvatarTone(friend.name, index)
                          } text-sm font-semibold text-white shadow-sm`}
                        >
                          {friend.avatar ?? friend.name.slice(0, 1)}
                        </div>
                        <div>
                          <p className="text-base font-semibold text-slate-900">{friend.name}</p>
                          <p className="mt-1 text-sm text-slate-500">
                            Friendship Level {friend.level}
                          </p>
                        </div>
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
                  </button>
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
