import { useNavigate, useSearchParams } from 'react-router-dom'
import BottomStickyNav from '../../shared/components/BottomStickyNav.jsx'
import { circleTitles } from '../chat/chatData.js'

export default function NewFriendQuizPage({ showToast }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const circleId = searchParams.get('circle') || 'best-friend'
  const notify = typeof showToast === 'function' ? showToast : () => {}
  const circleTitle = circleTitles[circleId] ?? circleTitles['best-friend']

  return (
    <div className="h-screen overflow-y-auto bg-[#edf2f7] hide-scrollbar">
      <div className="min-h-screen pb-28">
        <section className="bg-white shadow-none">
          <div className="bg-gradient-to-r from-fuchsia-700 via-pink-600 to-rose-500 px-5 pb-8 pt-[calc(1rem+env(safe-area-inset-top)+1rem)] text-white">
            <button
              className="text-sm font-medium text-white/80"
              onClick={() => navigate(`/friend-quiz?circle=${circleId}`)}
            >
              {'< Back'}
            </button>
            <h1 className="mt-1 text-2xl font-semibold">Add Question</h1>
            <p className="mt-2 max-w-[24rem] text-sm leading-6 text-white/90">
              Tambahkan pertanyaan baru untuk circle {circleTitle}.
            </p>
          </div>

          <div className="space-y-4 p-3">
            <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-800">Pertanyaan</label>
                  <textarea
                    className="mt-2 min-h-28 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none"
                    placeholder="Contoh: Gracia paling suka warna apa?"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                    <p className="text-sm font-semibold text-slate-800">Pilihan jawaban</p>
                    <div className="mt-3 space-y-3">
                      {[1, 2, 3, 4].map((number) => (
                        <div key={number} className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-semibold text-slate-500 ring-1 ring-slate-200">
                            {number}
                          </span>
                          <input
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none"
                            placeholder={`Pilihan ${number}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-2 rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
                    <label className="text-sm font-semibold text-emerald-800">
                      Jawaban yang benar
                    </label>
                    <input
                      className="mt-2 w-full rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none"
                      placeholder="Tulis pilihan yang benar"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full rounded-2xl bg-fuchsia-600 px-4 py-4 text-sm font-semibold text-white"
                  onClick={() => notify('Question baru berhasil ditambahkan')}
                >
                  Simpan question
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
      <BottomStickyNav />
    </div>
  )
}
