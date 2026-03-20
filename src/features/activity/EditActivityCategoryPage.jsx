import { Navigate, useNavigate, useParams } from 'react-router-dom'
import BottomStickyNav from '../../shared/components/BottomStickyNav.jsx'
import { activityTypeById } from './activityData.js'

export default function EditActivityCategoryPage({ showToast }) {
  const navigate = useNavigate()
  const { activityId } = useParams()
  const notify = typeof showToast === 'function' ? showToast : () => {}
  const activity = activityTypeById[activityId]

  if (!activity) {
    return <Navigate to="/activity" replace />
  }

  return (
    <div className="h-screen bg-[#edf2f7] overflow-y-auto hide-scrollbar">
      <div className="min-h-screen pb-28">
        <section className="overflow-hidden bg-white shadow-none">
          <div className={`bg-gradient-to-r ${activity.accent} px-5 pb-8 pt-[calc(1rem+env(safe-area-inset-top)+1rem)] text-white`}>
            <button
              className="text-sm font-medium text-white/80"
              onClick={() => navigate(`/activity/${activityId}`)}
            >
              {'< Back'}
            </button>
            <h1 className="mt-4 text-2xl font-semibold">Edit Activity Category</h1>
            <p className="mt-2 max-w-[24rem] text-sm leading-6 text-white/90">
              Kelola nama category untuk jenis activity ini supaya lebih rapi dan mudah dipahami.
            </p>
          </div>

          <div className="space-y-4 p-3">
            <div className="rounded-3xl bg-white p-4 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">{activity.title}</h2>
              <p className="mt-1 text-sm text-slate-500">
                Berikut daftar activity category yang sedang dipakai.
              </p>
            </div>

            <div className="rounded-3xl bg-slate-900 p-4 text-white shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold">Rekomendasikan New Category</h2>
                  <p className="mt-1 text-sm text-white/75">
                    Ajukan rekomendasi category baru, nanti admin yang akan buatkan.
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-900"
                  onClick={() => notify(`Rekomendasikan category baru untuk ${activity.title}`)}
                >
                  Rekomendasikan
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {activity.activeGroups.map((group) => (
                <div key={group.category} className="rounded-3xl bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-slate-900">{group.category}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {group.items.length} activity di category ini
                      </p>
                    </div>
                    <button
                      type="button"
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                      onClick={() => notify(`Edit ${group.category}`)}
                    >
                      Rename
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <BottomStickyNav onAction={notify} />
    </div>
  )
}
