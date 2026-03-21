import { useNavigate } from 'react-router-dom'
import BottomStickyNav from '../../shared/components/BottomStickyNav.jsx'
import { suggestionCards } from './activitySuggestionData.js'

export default function ActivitySuggestionPage({ showToast }) {
  const navigate = useNavigate()
  const notify = typeof showToast === 'function' ? showToast : () => {}

  return (
    <div className="h-screen overflow-y-auto bg-[#edf2f7] hide-scrollbar">
      <div className="min-h-screen pb-28">
        <section className="bg-white shadow-none">
          <div className="bg-gradient-to-r from-blue-700 via-cyan-600 to-emerald-400 px-5 pb-8 pt-[calc(1rem+env(safe-area-inset-top)+1rem)] text-white">
            <button
              className="text-sm font-medium text-white/80"
              onClick={() => navigate('/')}
            >
              {'< Back'}
            </button>
            <h1 className="mt-1 text-2xl font-semibold">Activity Suggestion</h1>
            <p className="mt-2 max-w-[24rem] text-sm leading-6 text-white/90">
              App memberi ide aktivitas otomatis berdasarkan siapa yang online dan siapa yang
              sedang dekat.
            </p>
          </div>

          <div className="space-y-4 p-3">
            <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Suggestions for you
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Rekomendasi ini muncul dari pola online dan kedekatan lokasi teman.
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  Smart prompt
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {suggestionCards.map((card) => (
                  <div
                    key={card.id}
                    className="overflow-hidden rounded-3xl bg-slate-50 shadow-sm ring-1 ring-slate-100"
                  >
                    <div className={`bg-gradient-to-r ${card.tone} px-4 py-4 text-white`}>
                      <div className="flex items-start gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-2xl backdrop-blur-sm">
                          {card.icon}
                        </div>
                        <div>
                          <p className="text-base font-semibold">{card.title}</p>
                          <h3 className="mt-1 text-xl font-semibold">{card.prompt}</h3>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white px-4 py-4">
                      <p className="text-sm leading-6 text-slate-600">{card.detail}</p>
                      <button
                        className="mt-4 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                        onClick={() => notify(card.prompt)}
                      >
                        {card.action}
                      </button>
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
