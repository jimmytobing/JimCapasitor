import { useNavigate } from 'react-router-dom'
import BottomStickyNav from '../../shared/components/BottomStickyNav.jsx'

const nearbyFriends = [
  {
    name: 'Joshua',
    gender: 'pria',
    place: '0.4 km dari kamu',
    area: 'Lagi di cafe Sudirman',
    avatar: 'J',
    tone: 'from-orange-400 to-amber-500',
  },
  {
    name: 'Bayu',
    gender: 'pria',
    place: '0.9 km dari kamu',
    area: 'Dekat kampus barat',
    avatar: 'B',
    tone: 'from-sky-400 to-blue-500',
  },
  {
    name: 'Angga',
    gender: 'pria',
    place: '1.3 km dari kamu',
    area: 'Main di taman kota',
    avatar: 'A',
    tone: 'from-pink-400 to-rose-500',
  },
]

const onlineFriends = [
  {
    name: 'Ryan',
    gender: 'pria',
    activity: 'Online 2 menit lalu',
    status: 'Sedang buka chat',
    avatar: 'R',
    tone: 'from-violet-400 to-fuchsia-500',
  },
  {
    name: 'Vina',
    gender: 'wanita',
    activity: 'Online sekarang',
    status: 'Baru update story',
    avatar: 'V',
    tone: 'from-emerald-400 to-teal-500',
  },
  {
    name: 'Graciella',
    gender: 'wanita',
    activity: 'Online 5 menit lalu',
    status: 'Lagi cek circle',
    avatar: 'G',
    tone: 'from-cyan-400 to-blue-500',
  },
]

export default function FriendRadarPage({ showToast }) {
  const navigate = useNavigate()
  const notify = typeof showToast === 'function' ? showToast : () => {}

  return (
    <div className="h-screen overflow-y-auto bg-[#edf2f7] hide-scrollbar">
      <div className="min-h-screen pb-28">
        <section className="bg-white shadow-none">
          <div className="bg-gradient-to-r from-indigo-700 via-sky-600 to-cyan-400 px-5 pb-8 pt-[calc(1rem+env(safe-area-inset-top)+1rem)] text-white">
            <button
              className="text-sm font-medium text-white/80"
              onClick={() => navigate('/')}
            >
              {'< Back'}
            </button>
            <h1 className="mt-1 text-2xl font-semibold">Friend Radar</h1>
            <p className="mt-2 max-w-[24rem] text-sm leading-6 text-white/90">
              Mirip Snap Map, tapi fokus ke teman yang dekat lokasi dan sedang aktif.
            </p>
          </div>

          <div className="space-y-4 p-3">
            <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100">
              <div className="bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.28),_transparent_58%)] px-4 py-5">
                <div className="rounded-[28px] border border-sky-100 bg-slate-950 px-4 py-5 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-sky-200">Radar view</p>
                      <h2 className="mt-1 text-lg font-semibold">Teman dekat lokasi</h2>
                    </div>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-sky-100">
                      3 nearby
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-3">
                    {nearbyFriends.map((friend) => (
                      <button
                        key={friend.name}
                        className="rounded-2xl bg-white/8 p-3 text-left backdrop-blur-sm ring-1 ring-white/10 transition hover:bg-white/12"
                        onClick={() => notify(`${friend.name} ${friend.place}`)}
                      >
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br ${friend.tone} text-sm font-semibold text-white`}
                        >
                          {friend.avatar}
                        </div>
                        <p className="mt-3 text-sm font-semibold text-white">{friend.name}</p>
                        <p className="mt-1 text-xs text-sky-100">{friend.place}</p>
                        <p className="mt-1 text-xs text-slate-300">{friend.area}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Teman yang lagi online</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Lihat siapa yang aktif dan siap diajak ngobrol sekarang.
                  </p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Live now
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {onlineFriends.map((friend) => (
                  <button
                    key={friend.name}
                    className="flex w-full items-center gap-3 rounded-2xl bg-slate-50 p-3 text-left shadow-sm ring-1 ring-slate-100 transition hover:bg-slate-100"
                    onClick={() => notify(`${friend.name} ${friend.activity}`)}
                  >
                    <div
                      className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${friend.tone} text-base font-semibold text-white shadow-sm`}
                    >
                      {friend.avatar}
                      <span className="absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-base font-semibold text-slate-900">
                          {friend.name}
                        </p>
                        <span className="text-xs font-medium text-slate-400">
                          {friend.activity}
                        </span>
                      </div>
                      <p className="mt-1 text-sm leading-5 text-slate-500">{friend.status}</p>
                    </div>
                  </button>
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
