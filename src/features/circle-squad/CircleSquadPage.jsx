import { useNavigate } from 'react-router-dom'
import BottomStickyNav from '../../shared/components/BottomStickyNav.jsx'

const circles = [
  {
    id: 'best-friend',
    title: 'Best Friend',
    emoji: '💛',
    members: '4 member aktif',
    accent: 'from-amber-400 to-orange-500',
    chatCount: '4 chats',
  },
  {
    id: 'school-friend',
    title: 'School Friend',
    emoji: '🎒',
    members: '12 member aktif',
    accent: 'from-sky-400 to-blue-500',
    chatCount: '4 chats',
  },
  {
    id: 'game-friend',
    title: 'Game Friend',
    emoji: '🎮',
    members: '6 member aktif',
    accent: 'from-violet-400 to-fuchsia-500',
    chatCount: '4 chats',
  },
  {
    id: 'secret-circle',
    title: 'Secret Circle',
    emoji: '🔒',
    members: '3 member aktif',
    accent: 'from-slate-700 to-slate-900',
    chatCount: '3 chats',
  },
]

const actions = [
  { id: 'chat', label: 'Chat', emoji: '💬' },
  { id: 'challenge', label: 'Friend Quiz', emoji: '🏆' },
  { id: 'ranking', label: 'Ranking', emoji: '📊' },
]

export default function CircleSquadPage({ showToast }) {
  const navigate = useNavigate()
  const notify = typeof showToast === 'function' ? showToast : () => {}

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
                  4 circles
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {circles.map((circle) => (
                  <div
                    key={circle.id}
                    className="overflow-hidden rounded-3xl bg-slate-50 shadow-sm ring-1 ring-slate-100"
                  >
                    <div className={`bg-gradient-to-r ${circle.accent} px-4 py-4 text-white`}>
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-2xl backdrop-blur-sm">
                          {circle.emoji}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{circle.title}</h3>
                          <p className="text-sm text-white/80">{circle.members}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 p-3">
                      {actions.map((action) => (
                        <button
                          key={`${circle.id}-${action.id}`}
                          className="rounded-2xl bg-white px-3 py-3 text-center shadow-sm ring-1 ring-slate-100 transition hover:bg-slate-100"
                          onClick={() => {
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
                          }}
                        >
                          <div className="text-lg">{action.emoji}</div>
                          <div className="mt-1 text-sm font-semibold text-slate-800">
                            {action.label}
                          </div>
                        </button>
                      ))}
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
