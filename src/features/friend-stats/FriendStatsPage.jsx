import { useNavigate } from 'react-router-dom'
import BottomStickyNav from '../../shared/components/BottomStickyNav.jsx'
import { bestFriendRanking, statCards } from './friendStatsData.js'

export default function FriendStatsPage({ showToast }) {
  const navigate = useNavigate()
  const notify = typeof showToast === 'function' ? showToast : () => {}

  return (
    <div className="h-screen overflow-y-auto bg-[#edf2f7] hide-scrollbar">
      <div className="min-h-screen pb-28">
        <section className="bg-white shadow-none">
          <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 px-5 pb-8 pt-[calc(1rem+env(safe-area-inset-top)+1rem)] text-white">
            <button
              className="text-sm font-medium text-white/80"
              onClick={() => navigate('/')}
            >
              {'< Back'}
            </button>
            <h1 className="mt-1 text-2xl font-semibold">Friend Stats</h1>
            <p className="mt-2 max-w-[24rem] text-sm leading-6 text-white/90">
              Lihat siapa yang paling sering chat, ketemu, dan main dalam periode ini.
            </p>
          </div>

          <div className="space-y-4 p-3">
            <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Highlights</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Ringkasan cepat siapa yang paling dominan di aktivitas pertemananmu.
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  This month
                </span>
              </div>

              <div className="mt-4 grid gap-3">
                {statCards.map((card) => (
                  <button
                    key={card.id}
                    className="overflow-hidden rounded-3xl bg-slate-50 text-left shadow-sm ring-1 ring-slate-100"
                    onClick={() => notify(`${card.title}: ${card.value}`)}
                  >
                    <div className={`bg-gradient-to-r ${card.accent} px-4 py-4 text-white`}>
                      <p className="text-sm font-medium text-white/80">{card.title}</p>
                      <h3 className="mt-1 text-2xl font-semibold">{card.value}</h3>
                    </div>
                    <div className="bg-white px-4 py-4">
                      <p className="text-sm text-slate-600">{card.detail}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Best friend bulan ini</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Ranking berdasarkan kombinasi chat, ketemu, dan main bareng.
                  </p>
                </div>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                  Top 3
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {bestFriendRanking.map((name, index) => (
                  <div
                    key={name}
                    className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                      {index + 1}
                    </div>
                    <p className="text-base font-semibold text-slate-900">{name}</p>
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
