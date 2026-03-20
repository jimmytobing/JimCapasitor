import { useNavigate } from 'react-router-dom'
import BottomStickyNav from '../../shared/components/BottomStickyNav.jsx'
import { activityTypes } from './activityData.js'

export default function ActivityPage({ showToast }) {
  const navigate = useNavigate()
  const notify = typeof showToast === 'function' ? showToast : () => {}

  return (
    <div className="h-screen bg-[#edf2f7] overflow-y-auto hide-scrollbar">
      <div className="min-h-screen pb-28">
        <section className="overflow-hidden bg-white shadow-none">
          <div className="bg-gradient-to-r from-slate-900 via-blue-800 to-cyan-600 px-5 pb-8 pt-[calc(1rem+env(safe-area-inset-top)+1rem)] text-white">
            <button
              className="text-sm font-medium text-white/80"
              onClick={() => navigate('/home')}
            >
              {'< Back'}
            </button>
            <h1 className="mt-1 text-2xl font-semibold">Activity</h1>
            <p className="mt-2 max-w-[24rem] text-sm leading-6 text-white/90">
              Tempat bikin aktivitas sekolah, bantuan belajar, hangout, sampai challenge
              bareng teman.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-sm">
              <span>6 jenis activity siap dipakai</span>
            </div>
          </div>

          <div className="space-y-4 p-3">
            <div className="rounded-3xl bg-white p-4 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">Pilih jenis activity</h2>
              <p className="mt-1 text-sm text-slate-500">
                Buka detail untuk lihat contoh, kebutuhan, dan format yang cocok.
              </p>
            </div>

            <div className="space-y-3">
              {activityTypes.map((activity) => (
                <button
                  key={activity.id}
                  type="button"
                  className="w-full rounded-3xl bg-white p-4 text-left shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-md"
                  onClick={() => {
                    notify(activity.title)
                    navigate(`/activity/${activity.id}`)
                  }}
                >
                  <div className={`rounded-2xl bg-gradient-to-r ${activity.accent} p-4 text-white`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-2xl backdrop-blur-sm">
                          {activity.emoji}
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/75">
                            Jenis {activity.icon}
                          </p>
                          <h3 className="mt-1 text-lg font-semibold">{activity.title}</h3>
                        </div>
                      </div>
                      <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                        Detail
                      </span>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-white/90">{activity.description}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {activity.categories.map((category) => (
                        <span
                          key={category}
                          className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Last Activity
                    </p>
                    <p className="mt-2 text-base font-semibold text-slate-900">
                      {activity.lastActivity.title}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {activity.lastActivity.description || 'Buka kategori ini untuk lihat activity aktif.'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
      <BottomStickyNav onAction={notify} />
    </div>
  )
}
