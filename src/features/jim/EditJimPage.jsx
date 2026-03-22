import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function createInitialForm(record) {
  return {
    title: record?.title || '',
    content: record?.content || '',
  }
}

export default function EditJimPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const record = location.state?.record
  const [formState, setFormState] = useState(() => createInitialForm(record))

  function handleChange(event) {
    const { name, value } = event.target

    setFormState((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    console.log('Edit Jim payload:', formState)
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <section className="bg-white shadow-none">
        <div className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 px-5 pb-8 pt-[calc(1rem+env(safe-area-inset-top)+1rem)] text-white">
          <button className="text-sm font-medium text-white/80" onClick={() => navigate('/jim')}>
            {'< Back'}
          </button>
          <h1 className="mt-1 text-2xl font-semibold">Edit Jim</h1>
          <p className="mt-2 max-w-[24rem] text-sm leading-6 text-white/90">
            Base sederhana untuk belajar update data dengan field title dan content.
          </p>
        </div>

        <div className="space-y-4 p-3 pb-8">
          <form
            className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100"
            onSubmit={handleSubmit}
          >
            {!record ? (
              <div className="mb-4 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                Data record belum dibawa dari halaman Jim. Kembali lalu pilih card untuk mulai edit.
              </div>
            ) : null}

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-800" htmlFor="title">
                  Title
                </label>
                <input
                  id="title"
                  name="title"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none"
                  value={formState.title}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-800" htmlFor="content">
                  Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  rows="6"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none"
                  value={formState.content}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
