import { useNavigate } from 'react-router-dom'
import BottomStickyNav from '../../shared/components/BottomStickyNav.jsx'

const challengeItems = [
  {
    id: 'quiz',
    icon: '⚡',
    title: 'Siapa paling cepat jawab quiz',
    description: 'Quick challenge untuk lihat siapa yang paling responsif di grup.',
    accent: 'bg-amber-50 text-amber-700',
  },
  {
    id: 'guess-image',
    icon: '🖼️',
    title: 'Tebak gambar',
    description: 'Main cepat dengan gambar random yang bikin semua ikut komentar.',
    accent: 'bg-pink-50 text-pink-700',
  },
  {
    id: 'truth-dare',
    icon: '🎲',
    title: 'Truth or dare',
    description: 'Challenge santai buat pecah suasana dan bikin chat makin hidup.',
    accent: 'bg-violet-50 text-violet-700',
  },
]

const pollOptions = [
  { name: '', votes: 32, avatar: 'J', avatarTone: 'from-amber-400 to-orange-500' },
  { name: 'Bayu', votes: 21, avatar: 'B', avatarTone: 'from-sky-400 to-blue-500' },
  { name: 'Angga', votes: 27, avatar: 'A', avatarTone: 'from-pink-400 to-rose-500' },
  { name: 'Ryan', votes: 14, avatar: 'R', avatarTone: 'from-violet-400 to-fuchsia-500' },
]

export default function MiniChallengePage({ showToast }) {
  const navigate = useNavigate()
  const notify = typeof showToast === 'function' ? showToast : () => {}
  const totalVotes = pollOptions.reduce((sum, option) => sum + option.votes, 0)

  return (
    <div className="h-screen overflow-y-auto bg-[#edf2f7] hide-scrollbar">
      <div className="min-h-screen pb-28">
        <section className="bg-white shadow-none">
          <div className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-400 px-5 pb-8 pt-[calc(1rem+env(safe-area-inset-top)+1rem)] text-white">
            <button
              className="text-sm font-medium text-white/80"
              onClick={() => navigate('/')}
            >
              {'< Back'}
            </button>
            <h1 className="mt-1 text-2xl font-semibold">Mini Challenge</h1>
            <p className="mt-2 max-w-[24rem] text-sm leading-6 text-white/90">
              Aktivitas kecil yang cepat dimainkan dan cocok untuk menaikkan engagement.
            </p>
          </div>

          <div className="space-y-4 p-3">
            <div className="rounded-3xl bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Quick games</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Tinggal pilih challenge dan mulai interaksi dalam hitungan detik.
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  4 challenge
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {challengeItems.map((item) => (
                  <button
                    key={item.id}
                    className="w-full rounded-2xl bg-slate-50 p-4 text-left shadow-sm ring-1 ring-slate-100 transition hover:bg-slate-100"
                    onClick={() => notify(item.title)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-base font-semibold text-slate-900">{item.title}</p>
                          <p className="mt-1 text-sm leading-6 text-slate-500">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${item.accent}`}
                      >
                        Start
                      </span>
                    </div>
                  </button>
                ))}

                <div className="rounded-3xl bg-slate-50 p-4 shadow-sm ring-1 ring-slate-100">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-slate-900">Poll</p>
                      <p className="mt-1 text-sm text-slate-500">Siapa paling lucu?</p>
                    </div>
                    <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                      Live vote
                    </span>
                  </div>

                  <div className="mt-4 space-y-2">
                    {pollOptions.map((option) => (
                      <button
                        key={option.name}
                        className="w-full rounded-2xl bg-white px-4 py-3 text-left shadow-sm ring-1 ring-slate-100 transition hover:bg-slate-100"
                        onClick={() => notify(`Vote untuk ${option.name}`)}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex min-w-0 items-center gap-3">
                            <span
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${option.avatarTone} text-xs font-semibold text-white`}
                            >
                              {option.avatar}
                            </span>
                            <span className="min-w-0 text-sm font-semibold text-slate-800">
                              {option.name}
                            </span>
                          </div>
                          <div className="ml-auto flex w-[72%] max-w-[280px] items-center justify-end gap-3">
                            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="ml-auto h-full rounded-full bg-sky-500"
                                style={{ width: `${(option.votes / totalVotes) * 100}%` }}
                              />
                            </div>
                            <div className="shrink-0 text-right">
                              <span className="text-sm text-slate-400">{option.votes} vote</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <BottomStickyNav />
    </div>
  )
}
