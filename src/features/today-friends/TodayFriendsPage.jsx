import { useNavigate } from 'react-router-dom'
import BottomStickyNav from '../../shared/components/BottomStickyNav.jsx'

const feedItems = [
  {
    id: 'online',
    icon: '🟢',
    title: 'Siapa online',
    badge: '3 online',
    tone: 'bg-emerald-50 text-emerald-700',
    people: [
      {
        name: 'Bayu',
        detail: 'lagi aktif sekarang',
        handle: '@bayu',
        avatar: 'B',
        avatarTone: 'from-emerald-400 to-teal-500',
      },
      {
        name: 'Nanda',
        detail: 'lagi aktif sekarang',
        handle: '@nanda',
        avatar: 'N',
        avatarTone: 'from-cyan-400 to-blue-500',
      },
      {
        name: 'Rafi',
        detail: 'lagi aktif sekarang',
        handle: '@rafi',
        avatar: 'R',
        avatarTone: 'from-lime-400 to-emerald-500',
      },
    ],
  },
  {
    id: 'birthday',
    icon: '🎂',
    title: 'Siapa ulang tahun',
    badge: '1 birthday',
    tone: 'bg-amber-50 text-amber-700',
    people: [
      {
        name: 'Angga',
        detail: 'ulang tahun hari ini',
        handle: '@angga',
        avatar: 'A',
        avatarTone: 'from-amber-400 to-orange-500',
      },
    ],
  },
  {
    id: 'gaming',
    icon: '🎮',
    title: 'Siapa lagi main game',
    badge: '4 gaming',
    tone: 'bg-violet-50 text-violet-700',
    games: [
      {
        name: 'Mobile Legend',
        players: [
          { name: 'Joshua', handle: '@joshua', avatar: 'J', avatarTone: 'from-violet-400 to-fuchsia-500' },
          { name: 'Fikri', handle: '@fikri', avatar: 'F', avatarTone: 'from-indigo-400 to-violet-500' },
        ],
      },
      {
        name: 'Roblox',
        players: [
          { name: 'Vina', handle: '@vina', avatar: 'V', avatarTone: 'from-pink-400 to-rose-500' },
          { name: 'Graciella', handle: '@graciella', avatar: 'G', avatarTone: 'from-cyan-400 to-blue-500' },
        ],
      },
    ],
  },
  {
    id: 'sad',
    icon: '💙',
    title: 'Siapa lagi sedih',
    badge: '1 need support',
    tone: 'bg-sky-50 text-sky-700',
    people: [
      {
        name: 'Dina',
        detail: 'lagi sedih dan butuh teman cerita',
        handle: '@dina',
        avatar: 'D',
        avatarTone: 'from-sky-400 to-blue-500',
      },
    ],
  },
]

export default function TodayFriendsPage({ showToast }) {
  const navigate = useNavigate()
  const notify = typeof showToast === 'function' ? showToast : () => {}

  return (
    <div className="h-screen overflow-y-auto bg-[#edf2f7] hide-scrollbar">
      <div className="min-h-screen pb-28">
        <section className="bg-white shadow-none">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-800 px-5 pb-8 pt-[calc(1rem+env(safe-area-inset-top)+1rem)] text-white">
            <button
              className="text-sm font-medium text-white/70"
              onClick={() => navigate('/')}
            >
              {'< Back'}
            </button>
            <h1 className="mt-1 text-2xl font-semibold">Today With Friends</h1>
            <p className="mt-2 max-w-[24rem] text-sm leading-6 text-white/85">
              Feed kecil untuk lihat kondisi teman hari ini dalam satu halaman.
            </p>
          </div>

          <div className="space-y-4 p-3">
            <div className="rounded-3xl bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Friend feed</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Ringkas, cepat dilihat, dan cocok untuk memicu interaksi.
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  Live today
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {feedItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-base font-semibold text-slate-900">{item.title}</p>
                          {item.id === 'gaming' ? (
                            <div className="mt-3 space-y-2">
                              {item.games.map((game) => (
                                <div
                                  key={`${item.id}-${game.name}`}
                                  className="rounded-xl bg-white px-3 py-2.5 shadow-sm ring-1 ring-slate-100"
                                >
                                  <div className="flex items-center justify-between gap-3">
                                    <p className="text-sm font-semibold text-slate-900">
                                      Game: {game.name}
                                    </p>
                                    <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-semibold text-violet-700">
                                      {game.players.length} players
                                    </span>
                                  </div>
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {game.players.map((player) => (
                                      <button
                                        key={`${game.name}-${player.name}`}
                                        className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-2 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                                        onClick={() =>
                                          notify(`${player.name} lagi main ${game.name}`)
                                        }
                                      >
                                        <span
                                          className={`flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br ${player.avatarTone} text-[11px] font-semibold text-white`}
                                        >
                                          {player.avatar}
                                        </span>
                                        <span>{player.name}</span>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="mt-3 space-y-3">
                              {item.people.map((person) => (
                                <button
                                  key={`${item.id}-${person.name}`}
                                  className="flex w-full items-center gap-3 rounded-2xl bg-white p-3 text-left shadow-sm ring-1 ring-slate-100 transition hover:bg-slate-100"
                                  onClick={() => notify(`${person.name} ${person.detail}`)}
                                >
                                  <div
                                    className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${person.avatarTone} text-base font-semibold text-white shadow-sm`}
                                  >
                                    {person.avatar}
                                    <span className="absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-3">
                                      <p className="truncate text-base font-semibold text-slate-900">
                                        {person.name}
                                      </p>
                                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                                        {person.handle}
                                      </span>
                                    </div>
                                    <p className="mt-1 text-sm leading-5 text-slate-500">
                                      {person.detail}
                                    </p>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${item.tone}`}
                      >
                        {item.badge}
                      </span>
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
