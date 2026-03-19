import { useNavigate } from 'react-router-dom'
import { currentUser } from '../chat/chatData.js'

export default function EditUserProfilePage({ showToast }) {
  const navigate = useNavigate()
  const notify = typeof showToast === 'function' ? showToast : () => {}

  return (
    <div className="min-h-screen bg-[#edf2f7]">
      <section className="bg-white shadow-none">
        <div className="bg-gradient-to-r from-rose-700 via-pink-600 to-orange-400 px-5 pb-8 pt-[calc(1rem+env(safe-area-inset-top)+1rem)] text-white">
          <button
            className="text-sm font-medium text-white/80"
            onClick={() => navigate('/user-profile')}
          >
            {'< Back'}
          </button>
          <h1 className="mt-1 text-2xl font-semibold">Change Data Detail</h1>
          <p className="mt-2 max-w-[24rem] text-sm leading-6 text-white/90">
            Ubah data profile utama untuk persona user yang sedang login.
          </p>
        </div>

        <div className="space-y-4 p-3 pb-8">
          <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-800">Nama</label>
                <input
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none"
                  defaultValue={currentUser.name}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-slate-800">Usia</label>
                  <input
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none"
                    defaultValue={currentUser.age}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-800">Gender</label>
                  <input
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none"
                    defaultValue="Wanita"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-800">Hobi</label>
                <textarea
                  className="mt-2 min-h-28 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none"
                  defaultValue={currentUser.hobby.join(', ')}
                />
              </div>

              <button
                type="button"
                className="w-full rounded-2xl bg-pink-600 px-4 py-4 text-sm font-semibold text-white shadow-sm"
                onClick={() => notify('Profile data updated')}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
