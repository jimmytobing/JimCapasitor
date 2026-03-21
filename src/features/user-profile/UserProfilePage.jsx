import { useNavigate } from 'react-router-dom'
import UserAvatar from '../../shared/components/UserAvatar.jsx'
import { profileTimeline } from './profileTimeline.js'
import { useUserProfileData } from './useUserProfileData.js'

export default function UserProfilePage({ showToast }) {
  const navigate = useNavigate()
  const notify = typeof showToast === 'function' ? showToast : () => {}
  const { username, isLoading, error, profile, profileDetails } = useUserProfileData()

  return (
    <div className="min-h-screen bg-[#edf2f7]">
      <section className="bg-white shadow-none">
        <div className="bg-gradient-to-r from-pink-700 via-rose-600 to-orange-400 px-5 pb-8 pt-[calc(1rem+env(safe-area-inset-top)+1rem)] text-white">
          <button className="text-sm font-medium text-white/80" onClick={() => navigate('/')}>
            {'< Back'}
          </button>
          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              className="h-16 w-16 overflow-hidden rounded-full shadow-sm"
              onClick={() => notify('Change image')}
            >
              <UserAvatar
                name={profile.name}
                image={profile.avatarImage}
                initial={profile.avatar}
                tone={profile.avatarTone}
              />
            </button>
            <div>
              <h1 className="text-2xl font-semibold">{profile.name}</h1>
              <p className="mt-1 text-sm text-white/90">{profile.subtitle}</p>
            </div>
          </div>
          <p className="mt-4 max-w-[24rem] text-sm leading-6 text-white/90">
            {profile.description}
          </p>
        </div>

        <div className="space-y-4 p-3 pb-8">
          <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Profile
              </p>
              <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-700">
                {username || 'No session'}
              </span>
            </div>

            {isLoading ? (
              <div className="mt-4 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-700">
                Mengambil Contact dari Salesforce...
              </div>
            ) : null}

            {error ? (
              <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                {error}
              </div>
            ) : null}

            <div className="mt-4 grid grid-cols-2 gap-3">
              {profileDetails.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl bg-slate-50 px-3 py-3 ring-1 ring-slate-200"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    {item.label}
                  </p>
                  <p className="mt-1 break-words text-sm font-medium text-slate-900">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <button
                type="button"
                className="w-full rounded-2xl bg-pink-600 px-4 py-4 text-sm font-semibold text-white shadow-sm"
                onClick={() => navigate('/user-profile/edit')}
              >
                Change data detail
              </button>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-slate-900">My timeline</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Timeline pribadi dengan gaya yang sama seperti halaman memory timeline.
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {profileTimeline.length} moments
              </span>
            </div>

            <div className="mt-5 space-y-4">
              {profileTimeline.map((item, index) => {
                const previousYear = index > 0 ? profileTimeline[index - 1].year : null
                const showYearDivider = index === 0 || previousYear !== item.year

                return (
                  <div key={`${item.date}-${item.title}`} className="space-y-4">
                    {showYearDivider && (
                      <div className="flex items-center gap-3">
                        <span className="h-px flex-1 bg-slate-200" />
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                          {item.year}
                        </span>
                        <span className="h-px flex-1 bg-slate-200" />
                      </div>
                    )}

                    <div className="flex gap-3">
                      <div className="flex w-[4.5rem] shrink-0 flex-col items-center">
                        <div className="w-[4.5rem] rounded-2xl bg-rose-50 px-2 py-3 text-center ring-1 ring-rose-100">
                          <p className="whitespace-nowrap text-xs font-semibold leading-none text-rose-700">
                            {item.date}
                          </p>
                        </div>
                        {index !== profileTimeline.length - 1 && (
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
