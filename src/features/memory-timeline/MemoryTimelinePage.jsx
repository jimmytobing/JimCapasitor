import { useNavigate, useParams } from 'react-router-dom'
import UserAvatar from '../../shared/components/UserAvatar.jsx'
import { formatTimelineDate, getMemoryTimelineData } from './memoryTimelineData.js'

export default function MemoryTimelinePage() {
  const navigate = useNavigate()
  const { friendId } = useParams()
  const { friend, timeline, profile } = getMemoryTimelineData(friendId)

  if (!friend) {
    return (
      <div className="min-h-screen bg-[#edf2f7] p-4 pt-[calc(1rem+env(safe-area-inset-top))]">
        <button className="text-sm font-medium text-slate-600" onClick={() => navigate(-1)}>
          {'< Back'}
        </button>
        <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">Timeline teman tidak ditemukan.</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#edf2f7]">
      <section className="bg-white shadow-none">
        <div className="bg-gradient-to-r from-fuchsia-700 via-rose-600 to-orange-400 px-5 pb-8 pt-[calc(1rem+env(safe-area-inset-top)+1rem)] text-white">
          <button className="text-sm font-medium text-white/80" onClick={() => navigate(-1)}>
            {'< Back'}
          </button>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-14 w-14 overflow-hidden rounded-full shadow-sm">
              <UserAvatar
                name={friend.name}
                image={friend.avatarImage}
                initial={friend.avatar}
                tone={friend.avatarTone}
              />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">{friend.name}</h1>
            </div>
          </div>
          <p className="mt-4 max-w-[24rem] text-sm leading-6 text-white/90">
            Timeline persahabatan dan momen penting yang pernah terlewati bareng.
          </p>
        </div>

        <div className="space-y-4 p-3 pb-8">
          <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Profile
              </p>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                Teman
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-slate-50 px-3 py-3 ring-1 ring-slate-200">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Gender
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900">{profile.gender}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3 ring-1 ring-slate-200">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Usia
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900">{profile.age}</p>
              </div>
              <div className="col-span-2 rounded-2xl bg-slate-50 px-3 py-3 ring-1 ring-slate-200">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Hobi
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900">{profile.hobby}</p>
              </div>
              <div className="col-span-2 rounded-2xl bg-slate-50 px-3 py-3 ring-1 ring-slate-200">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Circle
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900">{profile.circles}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Friendship timeline</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Catatan singkat perjalanan kamu dengan {friend.name}.
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {timeline.length} moments
              </span>
            </div>

            <div className="mt-5 space-y-4">
              {timeline.map((item, index) => {
                const dateLabel = formatTimelineDate(item.date)
                const previousYear =
                  index > 0 ? formatTimelineDate(timeline[index - 1].date).year : null
                const showYearDivider = index === 0 || previousYear !== dateLabel.year

                return (
                  <div key={`${item.date}-${item.title}`} className="space-y-4">
                    {showYearDivider && (
                      <div className="flex items-center gap-3">
                        <span className="h-px flex-1 bg-slate-200" />
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                          {dateLabel.year}
                        </span>
                        <span className="h-px flex-1 bg-slate-200" />
                      </div>
                    )}

                    <div className="flex gap-3">
                      <div className="flex w-16 shrink-0 flex-col items-center">
                        <div className="w-full rounded-2xl bg-rose-50 px-2 py-3 text-center ring-1 ring-rose-100">
                          <p className="text-sm font-bold leading-none text-rose-700">
                            {dateLabel.short}
                          </p>
                        </div>
                        {index !== timeline.length - 1 && (
                          <span className="mt-2 h-full w-px bg-slate-200" />
                        )}
                      </div>
                      <div className="flex-1 rounded-3xl bg-slate-50 p-4 shadow-sm ring-1 ring-slate-100">
                        <p className="text-base font-semibold text-slate-900">{item.title}</p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
