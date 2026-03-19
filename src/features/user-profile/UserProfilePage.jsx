import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { currentUser } from '../chat/chatData.js'

const profileTimeline = [
  {
    date: '8 Jun',
    year: '2026',
    title: 'Mulai bikin Friend Quiz',
    detail: 'Gracia mulai menambahkan pertanyaan tentang dirinya supaya teman-teman bisa ikut main dan dapat point.',
  },
  {
    date: '18 Mar',
    year: '2026',
    title: 'Punya inside joke favorit',
    detail: 'Momen receh di chat mulai terasa spesial dan akhirnya jadi bagian dari memory board.',
  },
  {
    date: '4 Feb',
    year: '2025',
    title: 'Lebih aktif di circle',
    detail: 'Mulai sering chat, ikut challenge, dan makin dekat dengan beberapa teman inti.',
  },
  {
    date: '12 Jan',
    year: '2024',
    title: 'Mulai membangun circle pertemanan',
    detail: 'Dari obrolan kecil sampai hangout bareng, ini jadi awal timeline persahabatan Gracia.',
  },
]

export default function UserProfilePage({ showToast }) {
  const navigate = useNavigate()
  const notify = typeof showToast === 'function' ? showToast : () => {}

  const timeline = useMemo(() => profileTimeline, [])

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
              className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${currentUser.avatarTone} text-lg font-semibold text-white shadow-sm`}
              onClick={() => notify('Change image')}
            >
              {currentUser.avatar}
            </button>
            <div>
              <h1 className="text-2xl font-semibold">{currentUser.name}</h1>
              <p className="mt-1 text-sm text-white/90">User Profile</p>
            </div>
          </div>
          <p className="mt-4 max-w-[24rem] text-sm leading-6 text-white/90">
            Detail persona user yang sedang login, lengkap dengan data profile dan timeline pribadi.
          </p>
        </div>

        <div className="space-y-4 p-3 pb-8">
          <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Profile
              </p>
              <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-700">
                Active user
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-slate-50 px-3 py-3 ring-1 ring-slate-200">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Nama
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900">{currentUser.name}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3 ring-1 ring-slate-200">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Usia
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900">{currentUser.age} tahun</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3 ring-1 ring-slate-200">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Gender
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900">Wanita</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3 ring-1 ring-slate-200">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Hobi
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {currentUser.hobby.join(', ')}
                </p>
              </div>
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
                {timeline.length} moments
              </span>
            </div>

            <div className="mt-5 space-y-4">
              {timeline.map((item, index) => {
                const previousYear = index > 0 ? timeline[index - 1].year : null
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
