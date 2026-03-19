import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomStickyNav from '../../shared/components/BottomStickyNav.jsx'

const moodOptions = [
  { id: 'happy', emoji: '😄', label: 'happy', accent: 'from-emerald-400 to-teal-500' },
  { id: 'biasa', emoji: '😐', label: 'biasa', accent: 'from-slate-400 to-slate-500' },
  { id: 'ngantuk', emoji: '😴', label: 'ngantuk', accent: 'from-indigo-400 to-blue-500' },
  { id: 'bad-mood', emoji: '😡', label: 'bad mood', accent: 'from-rose-500 to-orange-500' },
]

const friendsSeed = [
  { name: 'Jimmy', moodId: 'ngantuk' },
  { name: 'Bayu', moodId: 'happy' },
  { name: 'Angga', moodId: 'bad-mood' },
]

export default function DailyPage({ showToast }) {
  const navigate = useNavigate()
  const notify = typeof showToast === 'function' ? showToast : () => {}
  const [selectedMood, setSelectedMood] = useState('happy')

  const moodById = Object.fromEntries(moodOptions.map((mood) => [mood.id, mood]))
  const selectedMoodData = moodById[selectedMood]
  const friends = friendsSeed.map((friend, index) =>
    index === 0 ? { ...friend, moodId: selectedMood } : friend
  )

  return (
    <div className="h-screen bg-[#edf2f7] overflow-y-auto hide-scrollbar">
      <div className="min-h-screen pb-28">
        <section className="overflow-hidden bg-white shadow-none">
          <div className={`bg-gradient-to-r ${selectedMoodData.accent} px-5 pb-8 pt-[calc(1rem+env(safe-area-inset-top)+1rem)] text-white`}>
            <button
              className="text-sm font-medium text-white/80"
              onClick={() => navigate('/')}
            >
              {'< Back'}
            </button>
            <h1 className="mt-1 text-2xl font-semibold">Daily Check-in</h1>
            <p className="mt-2 max-w-[24rem] text-sm leading-6 text-white/90">
              Pilih mood hari ini, lalu biarkan teman lihat dan kasih respon cepat.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm">
              <span className="text-lg">{selectedMoodData.emoji}</span>
              <span>Mood kamu hari ini: {selectedMoodData.label}</span>
            </div>
          </div>

          <div className="space-y-5 p-3">
            <div className="rounded-3xl bg-white p-2 shadow-sm">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Pilih mood hari ini</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Teman akan langsung lihat status terbarumu.
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {moodOptions.map((mood) => {
                  const isActive = selectedMood === mood.id
                  return (
                    <button
                      key={mood.id}
                      className={`rounded-2xl border px-4 py-4 text-left shadow-sm transition ${
                        isActive
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 bg-slate-50 text-slate-700'
                      }`}
                      onClick={() => {
                        setSelectedMood(mood.id)
                        notify(`Mood hari ini: ${mood.emoji} ${mood.label}`)
                      }}
                    >
                      <div className="text-2xl">{mood.emoji}</div>
                      <div className="mt-3 text-sm font-semibold">{mood.label}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="rounded-3xl bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Mood teman hari ini</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Status ini bikin interaksi lebih sering dan terasa personal.
                  </p>
                </div>
                <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 shadow-sm">
                  {friends.length} online
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {friends.map((friend) => {
                  const mood = moodById[friend.moodId]
                  return (
                    <div
                      key={friend.name}
                      className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-base font-semibold text-slate-900">
                            {friend.name} - {mood.emoji} {mood.label}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            Kamu bisa langsung merespon mood ini.
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          aktif
                        </span>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <button
                          className="flex-1 rounded-xl bg-amber-100 px-3 py-2 text-sm font-medium text-amber-700"
                          onClick={() => notify(`Sticker terkirim ke ${friend.name}`)}
                        >
                          Kirim sticker
                        </button>
                        <button
                          className="flex-1 rounded-xl bg-emerald-100 px-3 py-2 text-sm font-medium text-emerald-700"
                          onClick={() => notify(`Semangat terkirim ke ${friend.name}`)}
                        >
                          Kirim semangat
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      </div>
      <BottomStickyNav />
    </div>
  )
}
