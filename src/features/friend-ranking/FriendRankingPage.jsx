import { useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import BottomStickyNav from '../../shared/components/BottomStickyNav.jsx'

const rankingByCircle = {
  'best-friend': {
    title: 'Best Friend Ranking',
    friends: [
      { name: 'Bayu', level: 12, chat: 214, challenge: 18, hangout: 11 },
      { name: 'Ryan', level: 10, chat: 167, challenge: 12, hangout: 9 },
      { name: 'Angga', level: 9, chat: 149, challenge: 10, hangout: 8 },
      { name: 'Joshua', level: 8, chat: 132, challenge: 9, hangout: 7 },
    ],
  },
  'school-friend': {
    title: 'School Friend Ranking',
    friends: [
      { name: 'Nanda', level: 8, chat: 121, challenge: 9, hangout: 6 },
      { name: 'Caca', level: 7, chat: 116, challenge: 8, hangout: 5 },
      { name: 'Rafi', level: 6, chat: 104, challenge: 6, hangout: 5 },
      { name: 'Dion', level: 6, chat: 96, challenge: 5, hangout: 4 },
      { name: 'Fitri', level: 5, chat: 91, challenge: 5, hangout: 4 },
      { name: 'Lola', level: 5, chat: 88, challenge: 4, hangout: 4 },
      { name: 'Zaki', level: 5, chat: 82, challenge: 4, hangout: 3 },
      { name: 'Putri', level: 4, chat: 76, challenge: 4, hangout: 3 },
      { name: 'Yusuf', level: 4, chat: 72, challenge: 3, hangout: 3 },
      { name: 'Joshua', level: 4, chat: 70, challenge: 3, hangout: 2 },
      { name: 'Bayu', level: 3, chat: 64, challenge: 2, hangout: 2 },
      { name: 'Angga', level: 3, chat: 58, challenge: 2, hangout: 2 },
    ],
  },
  'game-friend': {
    title: 'Game Friend Ranking',
    friends: [
      { name: 'Fikri', level: 11, chat: 172, challenge: 20, hangout: 6 },
      { name: 'Joshua', level: 9, chat: 151, challenge: 16, hangout: 5 },
      { name: 'Gracia', level: 7, chat: 118, challenge: 11, hangout: 4 },
      { name: 'Salma', level: 6, chat: 101, challenge: 9, hangout: 4 },
      { name: 'Kevin', level: 5, chat: 86, challenge: 7, hangout: 3 },
      { name: 'Bayu', level: 5, chat: 82, challenge: 7, hangout: 3 },
    ],
  },
  'secret-circle': {
    title: 'Secret Circle Ranking',
    friends: [
      { name: 'Vina', level: 9, chat: 133, challenge: 8, hangout: 5 },
      { name: 'Ryan', level: 8, chat: 117, challenge: 7, hangout: 4 },
      { name: 'Dina', level: 7, chat: 104, challenge: 6, hangout: 4 },
    ],
  },
}

const podiumStyles = {
  0: 'bg-gradient-to-r from-yellow-100 via-amber-50 to-yellow-200 ring-yellow-300',
  1: 'bg-gradient-to-r from-slate-100 via-slate-50 to-slate-200 ring-slate-300',
  2: 'bg-gradient-to-r from-orange-100 via-amber-50 to-orange-200 ring-orange-300',
}

export default function FriendRankingPage({ showToast }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const circleId = searchParams.get('circle') || 'best-friend'
  const data = useMemo(
    () => rankingByCircle[circleId] ?? rankingByCircle['best-friend'],
    [circleId]
  )
  const notify = typeof showToast === 'function' ? showToast : () => {}

  return (
    <div className="h-screen overflow-y-auto bg-[#edf2f7] hide-scrollbar">
      <div className="min-h-screen pb-28">
        <section className="bg-white shadow-none">
          <div className="bg-gradient-to-r from-rose-700 via-pink-600 to-orange-400 px-5 pb-8 pt-[calc(1rem+env(safe-area-inset-top)+1rem)] text-white">
            <button
              className="text-sm font-medium text-white/80"
              onClick={() => navigate('/circle-squad')}
            >
              {'< Back'}
            </button>
            <h1 className="mt-1 text-2xl font-semibold">Ranking Temen</h1>
            <p className="mt-2 max-w-[24rem] text-sm leading-6 text-white/90">
              Lihat tingkat kedekatan dan friendship level dari circle yang kamu pilih.
            </p>
          </div>

          <div className="space-y-4 p-3">
            <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">{data.title}</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Diurutkan berdasarkan friendship level tertinggi di circle ini.
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  Top bonds
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {data.friends.map((friend, index) => (
                  <button
                    key={friend.name}
                    className={`w-full rounded-3xl p-4 text-left shadow-sm ring-1 transition ${
                      podiumStyles[index] ?? 'bg-slate-50 ring-slate-100 hover:bg-slate-100'
                    }`}
                    onClick={() => notify(`${friend.name} Friendship Level ${friend.level}`)}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-base font-semibold text-slate-900">
                            Jimmy ❤️ {friend.name}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            Friendship Level {friend.level}
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                        Lv {friend.level}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-white p-4 ring-1 ring-slate-100">
                      <div className="rounded-2xl bg-slate-50 px-3 py-3 text-center">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                          Chat
                        </p>
                        <p className="mt-2 text-lg font-semibold text-slate-900">
                          {friend.chat}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 px-3 py-3 text-center">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                          Challenge
                        </p>
                        <p className="mt-2 text-lg font-semibold text-slate-900">
                          {friend.challenge}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 px-3 py-3 text-center">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                          Hangout
                        </p>
                        <p className="mt-2 text-lg font-semibold text-slate-900">
                          {friend.hangout}
                        </p>
                      </div>
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
