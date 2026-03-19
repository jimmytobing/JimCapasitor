import { useNavigate } from 'react-router-dom'
import BottomStickyNav from '../../shared/components/BottomStickyNav.jsx'

const memoryItems = [
  {
    id: 'photo',
    icon: '📸',
    title: 'Foto bareng teman',
    note: 'Tersimpan hari ini',
    description: 'Kumpulan foto hangout, nongkrong, dan momen spontan bareng circle.',
    timestamp: '19 Maret 2026',
    photos: [
      { id: 'photo-1', title: 'Sore di taman kota', art: '🌇', time: '16:05' },
      { id: 'photo-2', title: 'Ngopi habis kelas', art: '☕', time: '16:48' },
      { id: 'photo-3', title: 'Selfie sebelum pulang', art: '🤳', time: '17:21' },
    ],
    tone: 'from-amber-400 to-orange-500',
  },
  {
    id: 'story',
    icon: '📝',
    title: 'Cerita hari ini',
    note: 'Diary ringan',
    description: 'Ruang untuk simpan cerita singkat tentang kejadian yang ingin diingat.',
    timestamp: '19 Maret 2026, 21:15',
    sampleTitle: 'Obrolan yang ternyata dibutuhkan semua orang',
    sample:
      'Hari ini awalnya cuma niat nongkrong sebentar setelah aktivitas selesai, tapi ujung-ujungnya kami duduk cukup lama dan ngobrol dari hal receh sampai cerita yang lebih personal. Lucunya, satu per satu ternyata sedang memikirkan hal yang mirip: capek, bingung, tapi tetap berusaha terlihat santai. Momen seperti ini bikin aku sadar kalau pertemanan bukan cuma soal seru-seruan, tapi juga soal merasa dipahami tanpa harus banyak menjelaskan.',
    tone: 'from-sky-400 to-blue-500',
  },
  {
    id: 'funny',
    icon: '🤣',
    title: 'Moment lucu',
    note: 'Best laugh',
    description: 'Momen receh yang rasanya sayang kalau tidak disimpan.',
    timestamp: '19 Maret 2026, 16:08',
    sampleTitle: 'Bayu jatuh dari sepeda, tapi tetap sok tenang',
    sample:
      'Hari ini Bayu jatuh dari sepeda di depan kami semua karena terlalu pede belok sambil ngobrol. Yang bikin tambah lucu, setelah jatuh dia langsung berdiri, tepuk-tepuk celana, lalu bilang “nggak ada yang lihat kan?” padahal kami sudah ketawa duluan sebelum dia selesai ngomong. Sampai sekarang itu masih jadi bahan bercandaan paling kuat hari ini.',
    tone: 'from-fuchsia-400 to-pink-500',
  },
]

export default function TodayMemoryPage() {
  const navigate = useNavigate()
  return (
    <div className="h-screen overflow-y-auto bg-[#edf2f7] hide-scrollbar">
      <div className="min-h-screen pb-28 pt-[calc(1rem+env(safe-area-inset-top))]">
        <section className="bg-white shadow-none">
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-5 py-8 text-white">
            <button
              className="text-sm font-medium text-white/80"
              onClick={() => navigate('/')}
            >
              {'< Back'}
            </button>
            <h1 className="mt-1 text-2xl font-semibold">Today Memory Board</h1>
            <p className="mt-2 max-w-[24rem] text-sm leading-6 text-white/90">
              Simpan foto bareng teman, cerita hari ini, dan moment lucu supaya memori
              pertemanan tidak hilang.
            </p>
          </div>

          <div className="space-y-4 p-3">
            <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Saved today</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Memori kecil yang nanti justru paling sering dibuka lagi.
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  3 memories
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {memoryItems.map((item) => (
                  <div
                    key={item.id}
                    className="overflow-hidden rounded-3xl bg-slate-50 shadow-sm ring-1 ring-slate-100"
                  >
                    <div className={`bg-gradient-to-r ${item.tone} px-4 py-4 text-white`}>
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-2xl backdrop-blur-sm">
                          {item.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{item.title}</h3>
                          <p className="text-sm text-white/80">{item.note}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white px-4 py-4">
                      <p className="text-sm leading-6 text-slate-600">{item.description}</p>
                      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                        {item.timestamp}
                      </p>

                      {item.id === 'photo' ? (
                        <div className="mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 hide-scrollbar">
                          {item.photos.map((photo) => (
                            <div
                              key={photo.id}
                              className="min-w-[78%] snap-start overflow-hidden rounded-2xl border-2 border-slate-300 bg-white shadow-sm"
                            >
                              <div
                                className="flex aspect-[16/10] items-center justify-center border-b-2 border-slate-300 bg-white text-5xl"
                              >
                                {photo.art}
                              </div>
                              <div className="bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-3">
                                <div className="flex items-center justify-between gap-3">
                                  <p className="text-sm font-semibold leading-5 text-white">
                                    {photo.title}
                                  </p>
                                  <span className="shrink-0 text-xs font-medium text-white/80">
                                    {photo.time}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                          <h4 className="text-sm font-semibold leading-5 text-slate-900">
                            {item.sampleTitle}
                          </h4>
                          <p className="mt-2 text-sm leading-6 text-slate-700">{item.sample}</p>
                        </div>
                      )}
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
